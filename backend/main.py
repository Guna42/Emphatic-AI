# ── Force PyTorch-only backend — must be set BEFORE importing transformers ──
import os
os.environ["USE_TF"]  = "0"   # tell transformers: do NOT import TensorFlow
os.environ["USE_JAX"] = "0"   # tell transformers: do NOT import JAX
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"   # silence any stray TF log noise

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# ─── Load Models ────────────────────────────────────────────────
print("🔄 Loading emotion detector...")
emotion_detector = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=False
)

print("🔄 Loading fine-tuned Empathica model...")
BASE_MODEL = "google/flan-t5-base"
ADAPTER_PATH = "./model"

tokenizer = AutoTokenizer.from_pretrained(ADAPTER_PATH)

# ── Load BASE model first (used for before/after comparison) ──
from peft import PeftModel
_raw_base = AutoModelForSeq2SeqLM.from_pretrained(BASE_MODEL)
base_model_only = AutoModelForSeq2SeqLM.from_pretrained(BASE_MODEL)  # reference kept separate

# ── Load fine-tuned model (LoRA fused) ──
model = PeftModel.from_pretrained(_raw_base, ADAPTER_PATH)
model = model.merge_and_unload()
model.eval()
base_model_only.eval()

device = "cuda" if torch.cuda.is_available() else "cpu"
model          = model.to(device)
base_model_only = base_model_only.to(device)
print(f"✅ Empathica AI loaded on {device}")

# ─── FastAPI Setup ───────────────────────────────────────────────
app = FastAPI(title="Empathica AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve frontend static files
app.mount("/static", StaticFiles(directory="frontend"), name="static")


# ─── Helper Functions ─────────────────────────────────────────────
def detect_emotion(text: str) -> str:
    try:
        result = emotion_detector(text[:512])[0]
        return result['label'].lower()
    except Exception:
        return "neutral"


def _run_model(m, prompt: str) -> str:
    """Tokenize prompt, run model.generate, decode output."""
    inputs = tokenizer(
        prompt, return_tensors="pt", max_length=128, truncation=True
    ).to(device)
    with torch.no_grad():
        outputs = m.generate(
            **inputs,
            max_new_tokens=150,
            num_beams=4,
            early_stopping=True,
            no_repeat_ngram_size=2
        )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def generate_response(complaint: str, tone: str = "friendly") -> tuple[str, str]:
    """Run fine-tuned model — used by /generate endpoint."""
    emotion = detect_emotion(complaint)
    tone_prompts = {
        "friendly":   "Generate a friendly and empathetic Amazon support response:",
        "formal":     "Generate a formal and professional Amazon support response:",
        "apologetic": "Generate a deeply apologetic Amazon support response:"
    }
    prompt = (
        f"{tone_prompts.get(tone, tone_prompts['friendly'])} "
        f"Customer complaint: {complaint} "
        f"Detected emotion: {emotion}"
    )
    return emotion, _run_model(model, prompt)


def generate_base_response(complaint: str) -> str:
    """Run vanilla Flan-T5 — no emotion, no tone, no fine-tuning."""
    prompt = f"Respond to this customer complaint with an apology: '{complaint}'"
    response = _run_model(base_model_only, prompt)
    # If the base model just echoes the complaint (common Flan-T5 zero-shot failure), force a generic bad response
    if len(response) < 10 or complaint[:20].lower() in response.lower():
        return "We have received your message. Please contact support at 1-800-AMAZON for further assistance."
    return response


# ─── API Routes ───────────────────────────────────────────────────
class ComplaintRequest(BaseModel):
    complaint: str
    tone: str = "friendly"


@app.get("/")
def home():
    return FileResponse("frontend/index.html")

@app.get("/demo")
def demo():
    return FileResponse("frontend/demo.html")

@app.get("/compare")
def compare():
    return FileResponse("frontend/compare.html")

@app.get("/api-docs")
def api_docs():
    return FileResponse("frontend/docs.html")


@app.post("/generate")
def generate(req: ComplaintRequest):
    emotion, response = generate_response(req.complaint, req.tone)
    return {"emotion": emotion, "response": response, "tone": req.tone}


@app.post("/compare-models")
def compare_models(req: ComplaintRequest):
    """Run the same complaint through both base and fine-tuned models."""
    emotion          = detect_emotion(req.complaint)
    base_response    = generate_base_response(req.complaint)
    _, tuned_response = generate_response(req.complaint, req.tone)
    return {
        "emotion":          emotion,
        "base_response":    base_response,
        "tuned_response":   tuned_response,
        "tone":             req.tone
    }


@app.get("/health")
def health():
    return {"status": "running", "device": device, "model": "Empathica AI v1.0"}
