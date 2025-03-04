import os
import pinecone
import pdfplumber
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Load API Keys
pinecone_api_key = os.getenv("PINECONE_API_KEY")
if not pinecone_api_key:
    raise ValueError("PINECONE_API_KEY is not set. Please set it as an environment variable.")

# Initialize Pinecone
pc = Pinecone(api_key=pinecone_api_key)
index_name = "rag-chatbot"

# Connect to Pinecone index
if index_name in [idx["name"] for idx in pc.list_indexes()]:
    index = pc.Index(index_name)
    print(f"✅ Connected to Pinecone index: {index_name}")
else:
    raise ValueError(f"Index '{index_name}' does not exist. Create it in Pinecone Console first.")

# Initialize Embedding Model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Load the PDF file
pdf_path = "/Users/prathamranjan/test-tailwind/backend/Untitled document (14).pdf"

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

# Extract and split text
pdf_text = extract_text_from_pdf(pdf_path)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
chunks = text_splitter.split_text(pdf_text)

# Generate embeddings and upload to Pinecone
vectors = [(str(i), embedder.encode(chunk).tolist(), {"text": chunk}) for i, chunk in enumerate(chunks)]
index.upsert(vectors)

print(f"✅ Successfully stored {len(chunks)} chunks in Pinecone!")
