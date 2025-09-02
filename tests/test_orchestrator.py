from src.core.orchestrator import Orchestrator, Challenge

def test_dispatch():
    orch = Orchestrator(agents=["gpt"])
    res = orch.dispatch(Challenge(text="Say hi"))
    assert "challenge_id" in res