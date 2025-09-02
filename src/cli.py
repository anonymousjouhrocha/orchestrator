import sys, os, json
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from src.core.orchestrator import Orchestrator, Challenge

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cli.py 'your challenge text'")
        sys.exit(1)
    ch_text = " ".join(sys.argv[1:])
    orch = Orchestrator(agents=["gpt", "claude", "gemini"])
    result = orch.dispatch(Challenge(text=ch_text))
    print(json.dumps(result, indent=2, ensure_ascii=False))