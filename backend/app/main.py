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
        if user_query.prompt == "Hi":
            response = "Hi, I’m Hydra Bot. How may I assist you today?"
        elif user_query.prompt == "Hey, my washing machine has been making a loud noise for the past two days.":
          response = "I understand that your washing machine has been making a loud noise for the past two days. The service call will cost $75. Would you like to schedule an appointment?"
        elif user_query.prompt == "Yeh, definitely!":
            response = "What time works best for you?"
        elif user_query.prompt == "I'm available from 4pm to 8pm":
            response = "Done, your appointment is scheduled! Do let me know if I can assist you further."
        elif user_query.prompt == "Thanks!":
            response = "You are welcome."
        else:
            response = "I'm sorry, I'm currently not initegrated with llm. Please provide me key to continue chatting with me."
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)