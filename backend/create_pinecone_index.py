import os
import pinecone
from pinecone import ServerlessSpec

# Load API key from environment
pinecone_api_key = os.getenv("PINECONE_API_KEY")

if not pinecone_api_key:
    raise ValueError("PINECONE_API_KEY is not set. Please set it as an environment variable.")

# Initialize Pinecone client
pc = pinecone.Pinecone(api_key=pinecone_api_key)

# Define index name
index_name = "rag-chatbot"

# Check if the index already exists
existing_indexes = [index["name"] for index in pc.list_indexes()]
if index_name not in existing_indexes:
    pc.create_index(
        name=index_name,
        dimension=384,  # Change based on your embedding model
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
    print(f"✅ Index '{index_name}' created successfully.")
else:
    print(f"⚠️ Index '{index_name}' already exists.")
