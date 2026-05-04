<div align="center">

<br/>

```
███████╗███╗   ███╗██████╗  █████╗ ████████╗██╗  ██╗██╗ ██████╗ █████╗ 
██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║██╔════╝██╔══██╗
█████╗  ██╔████╔██║██████╔╝███████║   ██║   ███████║██║██║     ███████║
██╔══╝  ██║╚██╔╝██║██╔═══╝ ██╔══██║   ██║   ██╔══██║██║██║     ██╔══██║
███████╗██║ ╚═╝ ██║██║     ██║  ██║   ██║   ██║  ██║██║╚██████╗██║  ██║
╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝
                                                          AI
```

### *An AI that doesn't just respond — it understands.*

<br/>

[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)](https://github.com/Guna42/Emphatic-AI)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flan-T5](https://img.shields.io/badge/Model-Flan--T5-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://huggingface.co/google/flan-t5-base)
[![LoRA](https://img.shields.io/badge/Fine--Tuned-LoRA%20%2F%20PEFT-8A2BE2?style=for-the-badge)](https://github.com/huggingface/peft)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Deployed-Docker%20%2B%20Render-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> **"Most AI talks *at* you. Empathica talks *with* you."**

<br/>

---

</div>

<br/>

## 🫀 What is Empathica AI?

**Empathica AI** is a fine-tuned language model built to do what most AI systems fail at — *actually understand how you feel.*

Built on Google's `Flan-T5` architecture and supercharged with **LoRA (Low-Rank Adaptation)** fine-tuning, Empathica generates responses that are warm, emotionally aware, and genuinely supportive. Not robotic. Not cold. *Human.*

It also ships with a **side-by-side comparison mode** — so you can see exactly how fine-tuning transforms a generic base model into something that *feels* different.

<br/>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Fine-Tuned Intelligence** | LoRA-adapted Flan-T5 trained on empathetic conversation data |
| ⚡ **Lightning Fast API** | FastAPI backend with low-latency model inference |
| 🔬 **Comparison Mode** | Live side-by-side: base model vs Empathica — spot the difference |
| 🌐 **Clean Web UI** | Minimal, beautiful frontend — no frameworks, just vibes |
| 📦 **Parameter-Efficient** | Only adapter weights stored — not the full model. Smart & lean |
| 🐳 **Docker-Ready** | One command to containerize and ship anywhere |
| ☁️ **Render Deployable** | `render.yaml` included — push and it's live |
| 📄 **Built-in Docs Page** | `docs.html` explains the project right in the browser |

<br/>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EMPATHICA AI                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   👤 User                                                       │
│      │                                                          │
│      ▼                                                          │
│  ┌──────────────────────────────────────┐                       │
│  │         FRONTEND  (HTML/CSS/JS)      │                       │
│  │  index.html   →   script.js          │                       │
│  │  compare.html →   compare.js         │                       │
│  │  demo.html    →   docs.html          │                       │
│  └─────────────────┬────────────────────┘                       │
│                    │  HTTP POST /generate                        │
│                    ▼                                            │
│  ┌──────────────────────────────────────┐                       │
│  │       BACKEND  (Python / FastAPI)    │                       │
│  │           backend/main.py            │                       │
│  │  • CORS handling                     │                       │
│  │  • Request parsing                   │                       │
│  │  • Prompt engineering                │                       │
│  │  • Model inference                   │                       │
│  └─────────────────┬────────────────────┘                       │
│                    │                                            │
│                    ▼                                            │
│  ┌──────────────────────────────────────┐                       │
│  │       MODEL  (Flan-T5 + LoRA)        │                       │
│  │  google/flan-t5-base  (base)         │                       │
│  │  + adapter_model.safetensors         │                       │
│  │  + adapter_config.json               │                       │
│  │  + tokenizer.json                    │                       │
│  └──────────────────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

<br/>

---

## 📁 Project Structure

```
Emphatic-AI/
│
├── 📂 frontend/                  # Static web UI
│   ├── index.html                # Main landing + chat page
│   ├── demo.html                 # Live demo page
│   ├── compare.html              # Base vs Fine-tuned comparison
│   ├── docs.html                 # In-browser documentation
│   ├── style.css                 # All styles (responsive + themed)
│   ├── script.js                 # Core frontend logic & API calls
│   └── compare.js                # Dual-model comparison logic
│
├── 📂 backend/
│   └── main.py                   # FastAPI app — model loading & endpoints
│
├── 📂 model/                     # Fine-tuned LoRA adapter (NOT full model)
│   ├── adapter_config.json       # LoRA rank, alpha, target modules
│   ├── adapter_model.safetensors # Fine-tuned adapter weights
│   ├── tokenizer.json            # Tokenizer vocabulary
│   ├── tokenizer_config.json     # Tokenizer settings
│   └── README.md                 # Model card
│
├── 📂 assets/                    # Screenshots and demo images
│
├── 🐳 Dockerfile                 # Container definition
├── ☁️  render.yaml               # Render deployment config
├── 📦 requirements.txt           # Python dependencies
├── 🪟 START_EMPATHICA.bat        # One-click Windows launcher
└── 📖 viva_preparation_guide.md  # Project explanation notes
```

<br/>

---

## 🧬 The AI Behind It

### Why Flan-T5?
Google's `flan-t5-base` is an instruction-tuned transformer that's compact, fast, and strong at following natural language instructions — making it ideal for empathetic response generation without needing massive compute.

### Why LoRA / PEFT?
**Low-Rank Adaptation** means we don't retrain the entire model (billions of parameters). Instead, we inject small trainable matrices into the base model — making fine-tuning:
- 🚀 Faster to train
- 💾 Cheaper to store (just the adapter, not the whole model)
- 🎯 Highly targeted to empathetic responses

```
Base Model (frozen)  +  LoRA Adapter (fine-tuned)  =  Empathica AI ✨
```

### Inference Flow
```
User Input  ──▶  Prompt Engineering  ──▶  Tokenizer  ──▶  Flan-T5 + LoRA
                                                                  │
                                                                  ▼
User sees warm, empathetic reply  ◀──  Detokenize  ◀──  model.generate()
```

<br/>

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- pip
- (Optional) Docker

---

### 🖥️ Local Setup

**1. Clone the repo**
```bash
git clone https://github.com/Guna42/Emphatic-AI.git
cd Emphatic-AI
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Start the backend**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**4. Open the frontend**

Just open `frontend/index.html` in your browser (or use VS Code Live Server).

> ✅ That's it. Talk to Empathica.

---

### 🪟 Windows One-Click

```bash
# Just double-click:
START_EMPATHICA.bat
```

---

### 🐳 Docker

```bash
# Build the image
docker build -t empathica-ai .

# Run the container
docker run -p 8000:8000 empathica-ai
```

---

### ☁️ Deploy on Render

1. Fork this repo
2. Connect it to [Render](https://render.com)
3. Render reads `render.yaml` automatically
4. Hit **Deploy** — your backend is live 🌍

<br/>

---

## 🔌 API Reference

### `POST /generate`

Generate an empathetic response.

**Request:**
```json
{
  "text": "I've been feeling really overwhelmed lately and don't know what to do."
}
```

**Response:**
```json
{
  "reply": "I'm really sorry you're feeling this way. It's completely okay to feel overwhelmed sometimes — it means you care deeply. Let's take it one step at a time together."
}
```

---

### `GET /health`

```json
{ "status": "Empathica AI is running 💚" }
```

<br/>

---

## 🔬 Comparison Mode

One of Empathica's coolest features — open `compare.html` to see **Base Flan-T5 vs Empathica AI** side by side.

| Input | Base Flan-T5 | Empathica AI |
|---|---|---|
| *"I failed my exam and feel terrible"* | `"Sorry to hear that."` | `"That must feel really discouraging. Failing an exam doesn't define your worth — it's one moment, not your whole story. What can I help you with?"` |
| *"I'm so stressed about everything"* | `"Try to relax."` | `"Stress like that can feel suffocating. You don't have to figure it all out at once. What's weighing on you most right now?"` |

> The difference is real. Fine-tuning *matters.*

<br/>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Language Model** | `google/flan-t5-base` |
| **Fine-tuning** | LoRA via 🤗 PEFT |
| **Backend** | Python + FastAPI + Uvicorn |
| **Frontend** | Vanilla HTML / CSS / JavaScript |
| **Containerization** | Docker |
| **Cloud Deployment** | Render |
| **Model Format** | SafeTensors (`.safetensors`) |

<br/>

---

## 🖼️ Screenshots

> *(See the `assets/` folder for full screenshots)*

| Page | Preview |
|---|---|
| 🏠 Landing | `assets/land1.png` |
| 💬 Chat Demo | `assets/land2.png` |
| 🔬 Comparison | `assets/compare.png` |
| 🔌 API Docs | `assets/api.png` |
| 🧠 Model Output | `assets/model-output.png` |

<br/>

---

## 🔮 Future Roadmap

- [ ] 🎙️ Voice input support
- [ ] 💾 Session memory / conversation history
- [ ] 📊 Sentiment analysis dashboard
- [ ] 🌍 Multi-language empathetic responses
- [ ] 🔐 User authentication & personal profiles
- [ ] 📱 PWA / Mobile app version
- [ ] 🧪 ROUGE / BERTScore evaluation metrics page

<br/>

---

## 🤝 Contributing

Contributions are welcome! If you want to improve Empathica:

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add: your feature'`)
4. Push and open a Pull Request

<br/>

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br/>

---

<div align="center">

**Built with 🧠 intelligence and ❤️ empathy**

*by [Guna42](https://github.com/Guna42)*

<br/>

```
If this project made you feel something — it's working.
```

⭐ **Star this repo if Empathica made you smile** ⭐

</div>
