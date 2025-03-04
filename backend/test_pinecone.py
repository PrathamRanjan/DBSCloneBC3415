import os
from pinecone import Pinecone

# Load API Key
pinecone_api_key = os.getenv("PINECONE_API_KEY")

if not pinecone_api_key:
    raise ValueError("PINECONE_API_KEY is not set. Please set it as an environment variable.")

# Initialize Pinecone Client
pc = Pinecone(api_key=pinecone_api_key)

# Define Index Name
index_name = "rag-chatbot"

# Check if Index Exists
existing_indexes = [index["name"] for index in pc.list_indexes()]
if index_name in existing_indexes:
    index = pc.Index(index_name)
    print(f"✅ Successfully connected to Pinecone index: {index_name}")
else:
    print(f"⚠️ Index '{index_name}' does not exist. Please create one in the Pinecone Console.")
