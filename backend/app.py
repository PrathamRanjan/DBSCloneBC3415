import os
import pinecone
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone

# Load API keys
pinecone_api_key = os.getenv("PINECONE_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

if not pinecone_api_key or not groq_api_key:
    raise ValueError("PINECONE_API_KEY or GROQ_API_KEY is not set.")

# Initialize Flask app & Enable CORS
app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Initialize Pinecone
pc = Pinecone(api_key=pinecone_api_key)
index_name = "rag-chatbot"
index = pc.Index(index_name)

# Initialize Llama 3 with Groq
llm = ChatGroq(model="llama3-8b-8192", temperature=0.7, api_key=groq_api_key)

# Sentence Transformer for Embeddings
embedder = SentenceTransformer("all-MiniLM-L6-v2")

@app.route("/", methods=["GET"])
def home():
    return "Welcome to the RAG Chatbot API!"

@app.route("/chat", methods=["POST"])
def chat():
    """Retrieve relevant chunks from Pinecone and generate an AI response."""
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    # Convert query to embedding
    query_vector = embedder.encode(user_query).tolist()

    # Search Pinecone for relevant chunks
    results = index.query(vector=query_vector, top_k=3, include_metadata=True)

    # Retrieve matched info
    matched_info = " ".join([match["metadata"]["text"] for match in results["matches"]])

    # Construct system prompt with RAG
    system_prompt = f"""
    Instructions:
    - Answer concisely using retrieved context.
    - If you don't know, say 'I don't know'.
    Context: {matched_info}
    """

    messages = [
        ("system", system_prompt),
        ("human", user_query)
    ]
    
    # Get response from Llama 3 via Groq
    response = llm.invoke(messages)

    return jsonify({"response": response.content})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5009, debug=True)  # Flask runs on port 5009
