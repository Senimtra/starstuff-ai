<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/96a0ac18-6071-4c04-8a7a-45d901da5eda" alt="Image" width="150">
    </td>
    <td>
      <h1>🌟 Professor Starstuff</h1>
      <h3>A Multimodal AI Chatbot for Children's Astronomy Facts 🚀</h3>
    </td>
  </tr>
</table>

## 📌 Project Overview
Welcome to **Professor Starstuff**, a specialized AI chatbot designed to make learning astronomy fun and interactive for children! This chatbot extracts knowledge from YouTube videos, allowing kids to ask astronomy-related questions and receive engaging, easy-to-understand explanations. Like a friendly teacher, **Professor Starstuff** transforms learning into an exciting cosmic adventure. 🧑‍🚀🌌

## 🎯 Key Features

✅ **Multimodal Interaction** – Interaction via **text or voice** (text-to-speech). 💬  
✅ **Question-Related Image** – Retrieves relevant images from the **NASA API**. 🖼️  
✅ **AI-Powered Q&A** – Answers astronomy questions based on **Video transcripts**. 📄  
✅ **Memory & Context Awareness** – Maintains conversation history. 🧠  
✅ **Vector Search Database** – Uses **ChromaDB** for information retrieval. 📚  
✅ **Child-Friendly Interface** – Adopts a **mobile app format** for intuitive use. 📱  
✅ **Deployed Web App** – Hosted on **Heroku** for easy access. 🚀  
✅ **Performance Evaluation** – Employs **LangSmith** for response quality assessment. 📊  
✅ **Scalable Backend** – Built with **Django** using ChromaDB/SQLite as the database. 🏗️  
✅ **Future Enhancement** – Option to add **podcast** for enriched responses. 🎧  

## 🛠️ Tech Stack

| Component            | Technology         |
|----------------------|--------------------|
| **Backend**          | Django (Python)   |
| **Frontend**         | HTML / CSS / JS   |
| **Vector Database**  | ChromaDB          |
| **LLM & Embeddings** | OpenAI API        |
| **Speech Processing**| OpenAI Whisper (TTS) |
| **Evaluation**       | LangSmith         |
| **Deployment**       | Heroku (PaaS)     |

## 📌 Architecture Workflow

1️⃣ **User Query**: The user asks a question via text input. ❓  
2️⃣ **Embedding**: The query is embedded using **OpenAI embeddings**. 🗄️  
3️⃣ **Search**: The chatbot searches **ChromaDB** for relevant video transcripts. 🔍  
4️⃣ **LLM Processing**: Retrieved information is processed through the **LLM**. ⤴️  
5️⃣ **NASA API Retrieval**: Relevant images are fetched from the **NASA API**. 🖼️  
6️⃣ **Response Generation**: The chatbot responds via text or **text-to-speech**. 🗣️  
7️⃣ **Evaluation**: **LangSmith** evaluates the response quality in real time. 📊  

## 🚀 Deployment

1️⃣ **Website/App**: Hosted on **Heroku**. 🖥️  
2️⃣ **Database**: **ChromaDB/SQLite** (Vector Search). 📚  

## 📂 Deliverables

- **GitHub Repository** (Complete Source Code)  
- **Presentation Slides** (Google Slides)  
- **Comprehensive README** (This Document)  
- **Deployed App** (Live Demo)

## 📅 Project Management

- **GitHub Projects Kanban** to manage tasks and ensure smooth workflow tracking. 🗂️

## 🏆 Evaluation Criteria

✅ **Accuracy** – Relevance and correctness of astronomy-related answers.  
✅ **Usability** – Child-friendly, mobile-friendly, and intuitive interface.  
✅ **Latency** – Speed of response for smooth user experience.  
✅ **Performance** – Real-time evaluation using **LangSmith**.  
✅ **Presentation** – Documented code, concise slides, and project explanation.  

## 🎉 Future Enhancement

- Expand capabilities to include **podcast** for richer audio learning content. 🎧  

## 👩‍🚀 Ready to Explore the Cosmos? 🌌

Stay tuned for more updates and enhancements! 🚀✨  
