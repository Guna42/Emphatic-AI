# Empathica AI — Gen AI Viva Preparation Guide

This document is your ultimate cheat sheet for your end-to-end Gen AI Viva on the Empathica AI project. It breaks down the architecture, tech stack, why certain technologies were chosen, and what the alternatives were.

---

## 1. Project Overview
**What is Empathica AI?**
Empathica AI is a dual-model Generative AI customer response system. It transforms cold, robotic customer support replies into genuine, empathetic responses. It does this by first detecting the customer's emotion from their complaint, and then generating a response conditioned on both that emotion and a desired brand tone (Friendly, Formal, or Apologetic).

---

## 2. The Tech Stack & Architecture

### **A. Backend & API**
- **Framework:** `FastAPI` (Python)
- **Server:** `Uvicorn`
- **Why we used it:** FastAPI is incredibly fast, supports asynchronous requests natively, and automatically generates API documentation (Swagger UI). 
- **Alternatives:** `Flask` (slower, synchronous by default), `Django` (too heavy/monolithic for a simple AI API).

### **B. Machine Learning & Gen AI**
- **Libraries:** `PyTorch`, `HuggingFace Transformers`, `PEFT` (Parameter-Efficient Fine-Tuning).
- **The Pipeline (How it works):**
  1. **Emotion Detection:** A sequence classification model reads the complaint and outputs the underlying emotion.
  2. **Prompt Construction:** The system takes the user's selected tone (e.g., "apologetic") and the detected emotion (e.g., "anger") to create a prompt: *"Generate a deeply apologetic Amazon support response. Customer complaint: [text]. Detected emotion: anger."*
  3. **Generative Inference:** A fine-tuned text-to-text generation model reads the prompt and streams out the final response.

### **C. The Models Used**
1. **Emotion Classifier:** `j-hartmann/emotion-english-distilroberta-base`
   - **What it is:** A distilled version of RoBERTa, trained to classify 7 emotions (Anger, Disgust, Fear, Joy, Neutral, Sadness, Surprise).
   - **Why we used it:** Highly accurate, pre-trained specifically on English emotion datasets, and lightweight enough for real-time inference.
   - **Alternatives:** `VADER Sentiment Analysis` (too basic, only gives pos/neg/neutral), training a custom text classifier from scratch (time-consuming, requires lots of labeled data).

2. **Generative Foundation Model:** `google/flan-t5-base`
   - **What it is:** A 250-million parameter encoder-decoder model by Google, optimized for instruction following.
   - **Why we used it:** It is small enough to run on consumer hardware but powerful enough to understand complex instructions (unlike raw T5 which needs heavier prompting).
   - **Alternatives:** `Llama-3-8B` or `Mistral-7B` (Too massive, requires heavy GPU compute and high RAM), `GPT-2` (Outdated, poor instruction following).

### **D. The Fine-Tuning Method**
- **Method:** `LoRA` (Low-Rank Adaptation) via HuggingFace `PEFT`.
- **Training Data:** A bitext dataset of ~3,000 samples of customer complaints and ideal empathetic responses.
- **LoRA Parameters:** Rank (r) = 16, Alpha = 32.
- **Why we used it:** Full fine-tuning of Flan-T5 (250M params) is computationally expensive and slow. LoRA freezes the base model weights and only trains a tiny adapter (approx. 1.76 Million parameters, which is just **0.71%** of the model). This prevents catastrophic forgetting and makes training blazingly fast.
- **Alternatives:** 
  - *Full Fine-Tuning:* Updates all 250M weights. Requires massive GPU memory (VRAM).
  - *Prompt Engineering (Zero-shot/Few-shot):* No training. Cheaper, but the model struggles to consistently adopt specific brand tones and empathy without hallucinating.

### **E. Frontend**
- **Stack:** Vanilla HTML, CSS, JavaScript.
- **Design System:** Glassmorphism, CSS Variables, Flexbox/Grid layouts.
- **Why we used it:** Kept the project lightweight with zero build steps. Fetch API is used to communicate asynchronously with the FastAPI backend.
- **Alternatives:** `React`, `Vue`, `Next.js` (Overkill for a 4-page dashboard, though great for scalability).

---

## 3. Potential Viva Questions & How to Answer Them

**Q1: Why did you use two models instead of just asking one large LLM to do everything?**
*Answer:* Using a single Massive LLM (like GPT-4) can do both, but it's expensive and slow. By splitting the task, we achieve high accuracy and speed locally: a specialized DistilRoBERTa model handles the classification perfectly, passing structured data to a smaller, fine-tuned Flan-T5 generation model. It’s a modular, efficient, and cost-effective architecture.

**Q2: What is LoRA and why is it better than standard fine-tuning?**
*Answer:* LoRA stands for Low-Rank Adaptation. Instead of updating all the weights of a neural network during training, LoRA injects small, trainable rank decomposition matrices into the Transformer architecture while keeping the original weights frozen. This reduced our trainable parameters to less than 1%, meaning we could train it faster, use less GPU VRAM, and easily swap out the small "adapter" file if we wanted to change the model's behavior.

**Q3: What challenges did you face?**
*Answer:* The biggest challenge with Generative AI is "hallucination" and generic responses. Initially, the base Flan-T5 model would just repeat the customer's complaint back to them or give a robotic "Please contact support" answer. We solved this by creating a highly structured prompt incorporating the detected emotion, and fine-tuning it with LoRA on high-quality bitext data to force it to learn empathetic sentence structures.

**Q4: How does the frontend communicate with the backend?**
*Answer:* The frontend uses vanilla JavaScript `fetch()` to send an asynchronous POST request containing a JSON payload (the complaint text and desired tone) to the FastAPI `/generate` endpoint. The backend processes this through the PyTorch pipeline and returns a JSON response containing the detected emotion and the generated text, which the DOM then updates dynamically.

**Q5: If you had more time, how would you improve this?**
*Answer:* 
1. I would implement streaming responses (Server-Sent Events) so the text appears token-by-token as it's being generated, reducing perceived latency. 
2. I would test quantization (e.g., 8-bit or 4-bit loading) using bitsandbytes to make the model run even faster on lower-end CPUs. 
3. I would upgrade the base model from Flan-T5 to something like Llama-3-8B-Instruct quantized, if hardware permitted, for richer vocabulary.
