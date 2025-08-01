const socket = io();
const logs = {
  gemini: document.getElementById('gemini-log'),
  chatgpt: document.getElementById('chatgpt-log'),
  grok: document.getElementById('grok-log'),
  claude: document.getElementById('claude-log')
};

function send(ia, event) {
  if (event.key === 'Enter') {
    const input = event.target;
    const message = input.value;
    if (!message.trim()) return;

    // Mostrar tu mensaje en el chat
    logs[ia].innerHTML += `<p><strong>Capataz:</strong> ${message}</p>`;
    socket.emit('sendMessage', { to: ia, message });
    input.value = '';
  }
}

socket.on('response', (data) => {
  const { from, message } = data;
  if (logs[from]) {
    logs[from].innerHTML += `<p><strong>${from.toUpperCase()}:</strong> ${message}</p>`;
    logs[from].scrollTop = logs[from].scrollHeight;
  }
});

function activateSynergy() {
  const objetivo = document.getElementById('objetivo').value;
  if (!objetivo) {
    alert("Primero define un objetivo, Capataz.");
    return;
  }
  alert("🔥 Sinergia activada. Las IAs están colaborando sin saberlo...");
  // Aquí podrías dividir el objetivo en subtareas automáticamente
}