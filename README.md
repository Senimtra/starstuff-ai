# 🌟 Multimodal AI ChatBot for Children's Astronomy Facts 🚀

## 📌 Project Overview
Welcome to the **Multimodal AI ChatBot** designed to help children learn about astronomy in a fun and interactive way! This chatbot extracts knowledge from YouTube videos, allowing kids to ask astronomy-related questions and receive engaging, easy-to-understand explanations. The chatbot functions as a **friendly teacher**, making learning an exciting adventure! 🧑‍🚀🌌

## 🎯 Key Features

✅ **Multimodal Interaction** - Users can interact with the chatbot via **text or voice** (speech-to-text & text-to-speech). 🎙️💬  
✅ **AI-Powered Q&A** - Answers astronomy-related questions based on processed **YouTube video transcripts**.  
✅ **Memory & Context Awareness** - The chatbot maintains conversation memory to ensure smooth, contextual discussions. 🧠  
✅ **Vector Search Database** - Utilizes **ChromaDB** for efficient information retrieval. 📚  
✅ **Child-Friendly Interface** - The chatbot mimics a **mobile app format** for an intuitive user experience. 📱  
✅ **Deployed Web App** - Frontend on **Netlify**, Backend on **Heroku**. 🚀  
✅ **Performance Evaluation** - Uses **LangSmith** for real-time evaluation and scoring. 📊  
✅ **Scalable Backend** - Built using **Django**, with SQLite as the memory database. 🏗️  
✅ **Future Enhancements (Wishlist)** - Option to include **podcasts, images, and video snippets** to enrich responses. 🎧🖼️  

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Django (Python) |
| **Frontend** | HTML / CSS / JavaScript |
| **Vector Database** | ChromaDB |
| **Memory Database** | SQLite |
| **LLM & Embeddings** | OpenAI API |
| **Speech Processing** | OpenAI Whisper (Speech-to-Text) + Text-to-Speech |
| **Evaluation** | LangSmith |
| **Deployment** | Netlify (Frontend) + Heroku (Backend) |

## 📌 Architecture Workflow

1️⃣ User asks a question via text or speech. 🎙️💬  
2️⃣ Speech input is converted to text using **Whisper AI**.  
3️⃣ The query is **embedded** using **OpenAI embeddings**.  
4️⃣ The chatbot **searches ChromaDB** for relevant transcripts. 🔍  
5️⃣ The retrieved information is processed through **OpenAI LLM** to generate an answer.  
6️⃣ The chatbot responds via text or **text-to-speech**. 🗣️  
7️⃣ **LangSmith** evaluates response quality in real time. 📊  

## 🚀 Deployment

1️⃣ **Frontend**: Deployed on **Netlify** 🎨  
2️⃣ **Backend**: Hosted on **Heroku** 🖥️  
3️⃣ **Database**: ChromaDB (Vector Search) & SQLite (Memory) 📚  

## 📂 Deliverables

📌 **GitHub Repository** (Source Code)  
📌 **Presentation Slides** (Google slides)  
📌 **Comprehensive README** (This Document)  
📌 **Deployed App** (Live Demo)

## 📅 Project Management

🗂️ **Kanban** in GitHub Projects to ensure smooth workflow and task tracking.

## 🏆 Evaluation Criteria

✅ **Accuracy**: How well the chatbot answers astronomy-related questions.  
✅ **Usability**: Mobile-friendly, child-friendly, and interactive interface.  
✅ **Latency**: Fast response times for a seamless user experience.  
✅ **Performance**: Real-time evaluation using LangSmith.  
✅ **Presentation**: Well-documented code, slides, and project explanation.  

## 🎉 Future Enhancements (Wishlist)

🔹 Generate **podcasts** for astronomy facts. 🎧  
🔹 Display **relevant images** along with answers. 🖼️  
🔹 Integrate **video snippets** to enhance explanations. 🎥  

## 👩‍🚀 Ready to Explore the Cosmos? 🌌

Stay tuned for updates as I bring this exciting chatbot to life! 🚀💡
