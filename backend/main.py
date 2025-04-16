from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json
from data_dto import SalesRepDTO
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import httpx

app = FastAPI(
    title="SalesReps API",
    description="API for managing sales representatives and their data.",
    version="1.0.0",
    docs_url="/docs",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dummy data
with open("dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)

load_dotenv()

HUGGINGFACE_API_TOKEN = os.getenv("HF_API_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"  

HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}


class TextIn(BaseModel):
    text: str

@app.get("/api/data", tags=["Sales"], summary="List of all sales", description="Returns all sales with their details.")
def get_data():
    """
    Returns dummy data (e.g., list of users).
    """
    if not DUMMY_DATA:
        return JSONResponse(status_code=400, content={"data": None, "message": "No data available"})
    try:
        data = [SalesRepDTO(**rep).model_dump() for rep in DUMMY_DATA["salesReps"]]
        return JSONResponse(status_code=200, content={"message": "ok", "data": data})
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": "Error processing data", "error": str(e)}
        )

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.
    (Optionally integrate a real AI model or external service here.)
    """

    body = await request.json()
    user_question = body.get("question", "")

    print(f"Received question: {user_question}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:  # Increased timeout to 30 seconds
            response = await client.post(API_URL, headers=HEADERS, json={"inputs": user_question})

        if response.status_code != 200:
            print(f"Error: {response.status_code} - {response.text}")
            return JSONResponse(status_code=response.status_code, content={"data": None, "message": response.text})
        
        response_data = response.json()
        if isinstance(response_data, list) and len(response_data) > 0:
            summary_text = response_data[0].get("summary_text", "No summary available")
        else:
            summary_text = "No summary available"

        return JSONResponse(
            status_code=200,
            content={"message": "ok", "data": summary_text}
        )
    except httpx.ReadTimeout:
        print("Request to Hugging Face API timed out.")
        return JSONResponse(
            status_code=504,
            content={"message": "Request to Hugging Face API timed out. Please try again later."}
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        return JSONResponse(
            status_code=500,
            content={"message": "An unexpected error occurred.", "error": str(e)}
        )

    # Placeholder logic: echo the question or generate a simple response
    # Replace with real AI logic as desired (e.g., call to an LLM).
    # return {"answer": f"This is a placeholder answer to your question: {token}"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
