from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define a request model for the user's query
class UserQuery(BaseModel):
    prompt: str

# Mock function to simulate chatbot response
def generate_chatbot_response(prompt: str) -> str:
    # Replace this with your actual AI model or logic
    return f"Chatbot: You said '{prompt}'"

# Endpoint to handle user queries
@app.post("/chat")
async def chat(user_query: UserQuery):
    try:
        response = generate_chatbot_response(user_query.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)