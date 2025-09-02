import json, time, uuid, redis, os
from typing import List, Dict
from pydantic import BaseModel
from litellm import completion

r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

class Message(BaseModel):
    role: str
    content: str
    agent: str = None
    timestamp: float = None

class Challenge(BaseModel):
    text: str
    id: str = None
    messages: List[Message] = []

class Orchestrator:
    def __init__(self, agents: List[str]):
        self.agents = agents

    def dispatch(self, challenge: Challenge) -> Dict:
        challenge.id = challenge.id or str(uuid.uuid4())
        r.json().set(f"challenge:{challenge.id}", "$", challenge.model_dump())

        for agent in self.agents:
            msg = Message(
                role="user",
                content=challenge.text,
                agent=agent,
                timestamp=time.time()
            )
            self._append_msg(challenge.id, msg)

        for agent in self.agents:
            self._run_agent(agent, challenge.id)

        final = self._collect_votes(challenge.id)
        return {"challenge_id": challenge.id, "final_solution": final}

    def _run_agent(self, agent: str, cid: str):
        ch = Challenge(**r.json().get(f"challenge:{cid}"))
        history = [{"role": m.role, "content": m.content} for m in ch.messages]
        prompt = f"You are {agent}. Solve the user's problem and return ONLY a JSON object like {{'solution': '...', 'vote': 'best'}}."
        messages = [{"role": "system", "content": prompt}] + history
        resp = completion(
            model=self._map_model(agent),
            messages=messages,
            temperature=0.3
        )
        content = resp["choices"][0]["message"]["content"]
        try:
            data = json.loads(content)
        except Exception:
            data = {"solution": content, "vote": agent}
        self._append_msg(cid, Message(role="assistant", content=data["solution"], agent=agent, timestamp=time.time()))

    def _collect_votes(self, cid: str) -> str:
        msgs = Challenge(**r.json().get(f"challenge:{cid}")).messages
        votes = [m.content for m in msgs if m.agent and m.role == "assistant"]
        return max(set(votes), key=votes.count) if votes else "No consensus"

    def _append_msg(self, cid: str, msg: Message):
        r.json().arrappend(f"challenge:{cid}", "$.messages", msg.model_dump())

    def _map_model(self, agent: str) -> str:
        return {
            "gpt": "gpt-4o-mini",
            "claude": "claude-3-haiku-20240307",
            "gemini": "gemini/gemini-1.5-flash"
        }[agent]