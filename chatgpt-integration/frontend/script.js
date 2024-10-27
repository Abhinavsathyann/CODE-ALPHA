const socket = new WebSocket('ws://localhost:5000');

const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const loader = document.getElementById('loader');

// Load chat history from local storage
const loadChatHistory = () => {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.forEach(({ user, text, timestamp }) => {
        addMessage(user, text, timestamp);
    });
};

// Add message to chat
const addMessage = (user, text, timestamp) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', user === 'user' ? 'user' : 'bot');
    messageDiv.textContent = `${user === 'user' ? 'You' : 'ChatGPT'}: ${text} ${new Date(timestamp).toLocaleTimeString()}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
};

// Function to send a message
function sendMessage() {
    const message = userInput.value;
    if (message) {
        addMessage('user', message, Date.now());
        
        // Show loader
        loader.removeAttribute('hidden');

        // Send message to server
        socket.send(message);
        userInput.value = '';
    }
}

// Receive messages from the server
socket.addEventListener('message', (event) => {
    const botMessage = event.data;
    addMessage('bot', botMessage, Date.now());

    // Hide loader
    loader.setAttribute('hidden', true);

    // Save to local storage
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.push({ user: 'user', text: message, timestamp: Date.now() });
    history.push({ user: 'bot', text: botMessage, timestamp: Date.now() });
    localStorage.setItem('chatHistory', JSON.stringify(history));
});

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Load chat history on page load
window.onload = loadChatHistory;
