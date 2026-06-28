import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

app = FastAPI()

# Enable CORS for the Angular frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active chat subscribers
subscribers = []

class Message(BaseModel):
    user: str
    text: str

@app.post("/api/messages")
async def send_message(msg: Message):
    """Receives chat messages and broadcasts them to all listening streams."""
    payload = {"user": msg.user, "text": msg.text}
    for queue in subscribers:
        await queue.put(payload)
    return {"status": "sent"}

@app.get("/api/stream")
async def message_stream(request: Request):
    """Establishes a persistent text/event-stream connection with the client."""
    queue = asyncio.Queue()
    subscribers.append(queue)

    async def event_generator():
        try:
            while True:
                # Disconnect if client closes connection
                if await request.is_disconnected():
                    break
                
                # Fetch new message from queue
                msg = await queue.get()
                yield {
                    "event": "message",
                    "data": f'{{"user": "{msg["user"]}", "text": "{msg["text"]}"}}'
                }
        except asyncio.CancelledError:
            pass
        finally:
            subscribers.remove(queue)

    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000)
