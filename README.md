# Professor Starstuff 🚀✨

<img src="https://github.com/user-attachments/assets/9d58a0db-6d03-462d-ac1a-88bbc7f72991" alt="Professor Starstuff" width="250">

## 🌌 Bringing Astronomy to Life for Kids
**Professor Starstuff** is a multimodal AI chatbot that makes learning about space fun and interactive for children. This chatbot leverages natural language processing, vector-based retrieval, and podcast-style responses to engage young minds with fascinating space facts.

---

## 🔥 Features
- **🧠 Natural Language Processing (NLP):** Understands and responds to kids' astronomy questions.
- **📚 Vector-based Knowledge System:** Retrieves accurate space facts from YouTube video transcripts.
- **📡 NASA Image API:** Fetches real images of celestial objects for better visualization.
- **🎙️ Podcast-Style Responses:** Generates engaging storytelling audio from text-based answers.
- **🗂️ ChromaDB Integration:** Efficient search and retrieval of astronomy knowledge.
- **🔊 OpenAI TTS:** Converts text responses into audio format.
- **🚀 Deployabled on Heroku:** Django-based backend with an HTML/CSS/JavaScript frontend.

---

## 🏗️ Tech Stack
### Backend:
- **🟢 Django** - Main backend framework
- **🔵 SQLite (ChromaDB)** - Vector database for storing astronomy facts
- **🔴 Redis** - Cloud memory storage for conversation context
- **🟣 Heroku** - Deployment platform

### AI & Retrieval:
- **🤖 GPT-4 & GPT-3.5 Turbo** - Language models for chatbot responses
- **📌 ChromaDB** - Vector storage for RAG (Retrieval-Augmented Generation)
- **📡 NASA API** - Fetches real space images
- **🔊 OpenAI TTS** - Text-to-speech for podcast-style responses

### Frontend:
- **🌐 HTML, CSS, JavaScript** - Simple, interactive UI
- **🎨 Bootstrap** - Styling framework

---

## 📊 Dataset & Processing
Professor Starstuff is built on a dataset extracted from YouTube astronomy video transcripts:
1. **Transcript Extraction:** Uses `youtube_transcript_api` to fetch video transcripts (~8 hours of content).
2. **Chunking Strategy:**
   - **Chunk size:** 500 tokens
   - **Overlap:** 100 tokens for better context retention
3. **Vector Embeddings:**
   - Uses `text-embedding-3-large` from OpenAI for high-quality embeddings.
4. **Storage:**
   - Stored in ChromaDB with metadata (e.g., video titles) for efficient retrieval.

---

## 📡 System Architecture
1. **User Input:** Professor Starstuff processes questions and determines if they are related to astronomy.
2. **Decision Making (GPT-4):**
   - If the question is astronomical, it proceeds to retrieval.
   - If general, it provides a direct response.
3. **Retrieval & Response Generation:**
   - ChromaDB fetches relevant facts.
   - NASA Image API retrieves space-related images.
   - OpenAI TTS converts responses into audio.
4. **Final Output:**
   - Provides a text response, space images, and an audio podcast snippet.

<img src="https://github.com/user-attachments/assets/bedec8cb-9170-45a2-bea6-39824cb55b2e" alt="LangGraph Analysis" width="300">

---

## 🚀 Deployment
### **Django + ChromaDB on Heroku**
1. Clone the repository:
   ```sh
   git clone https://github.com/Senimtra/astronomy-bot.git
   cd astronomy-bot
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the application locally:
   ```sh
   python manage.py runserver
   ```
4. Deploy to Heroku:
   ```sh
   heroku create professor-starstuff
   git push heroku main
   ```

---

## 📈 Evaluation & Optimization
Professor Starstuff is continuously evaluated using **LangSmith**:
- **⚡ Inference Time:** Measures response speed.
- **📚 Retrieval Efficiency:** Ensures accurate fact retrieval.
- **🔧 Tool Efficiency:** API calls (NASA, ChromaDB, OpenAI TTS).
- **📊 Model Selection:**
  - GPT-4: Best for decision-making.
  - GPT-3.5 Turbo: Faster for general responses.

<img src="https://github.com/user-attachments/assets/7e953471-46a1-4715-8f15-216feec26c55" alt="LangSmith Evaluation" width="450">

---

## 🌟 Future Improvements
- **📡 Live Space Event Integration:** Fetch real-time astronomy news.
- **🔊 Voice Interaction:** Enable full voice-based conversation.
- **🛠 Streaming Responses:** Faster and smoother podcast delivery.
- **🎓 Educational Quizzes:** Make learning more interactive.
- **👤 User Profiles:** Personalize experience based on learning history.

---

## 🎉 Thanks for Exploring with Professor Starstuff!
**Made with 💙 for young space explorers!** 🌠
