import os
from langchain_groq import ChatGroq

# Load API key from environment variables
groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    raise ValueError("GROQ_API_KEY is not set. Please set it as an environment variable.")

# Initialize Groq LLM
llm = ChatGroq(model="llama3-8b-8192", temperature=0.0)

# Test message
messages = [
    ("system", "You are a helpful AI assistant."),
    ("human", "What is the capital of France?")
]

response = llm.invoke(messages)

print("Response:", response.content)
