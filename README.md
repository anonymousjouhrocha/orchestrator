# SynergyAI Orchestrator v0.1.0
> Primera plataforma open-source donde múltiples IAs colaboran para resolver cualquier desafío.

## Instalación rápida
```bash
git clone https://github.com/anonymousjouhrocha/orchestrator.git
cd orchestrator
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# rellena tus claves en .env
python -m src.cli "Diseña un logo minimalista para IA-Hub"