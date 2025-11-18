const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileUpload = document.getElementById('file-upload');

// API Key dari kamu
const API_KEY = 'sk-caea7a878fac4778b47e75964b186961';

// Fungsi untuk tambah pesan ke chat
function addMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar', role === 'user' ? 'user' : 'ai');
  avatarDiv.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', role);
  contentDiv.textContent = content;

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Kirim pesan ke API DeepSeek
async function sendToAI(message) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Tidak ada respons.";
    addMessage('ai', aiResponse);
  } catch (err) {
    console.error(err);
    addMessage('ai', 'Ups, ada masalah saat menghubungi AI.');
  }
}

// Event: Kirim pesan
sendBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim();
  if (msg) {
    addMessage('user', msg);
    sendToAI(msg);
    messageInput.value = '';
  }
});

// Event: Enter untuk kirim
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// Event: Upload file (placeholder dulu)
uploadBtn.addEventListener('click', () => {
  fileUpload.click();
});

fileUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    addMessage('user', `File terkirim: ${file.name}`);
    // Nanti kamu bisa kirim file ke API di sini (butuh backend)
  }
});
