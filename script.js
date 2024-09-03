const userInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');

const API_KEY = 'p48LpLkKKedF8aOM'; // Replace with your actual API key
const BRAINSHOP_BID = '181404'; // Replace with your bot ID
const BRAINSHOP_UID = '1'; // Replace with your user ID

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const userText = userInput.value.trim();
        if (userText) {
            addMessage('user', userText);
            handleCommand(userText);
            userInput.value = '';
        }
    }
});

function addMessage(sender, text) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.textContent = text;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleCommand(command) {
    // Send the user command to BrainShop API and get the response
    const url = `https://api.brainshop.ai/get?bid=${BRAINSHOP_BID}&key=${API_KEY}&uid=${BRAINSHOP_UID}&msg=${encodeURIComponent(command)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cnt) {
                addMessage('bot', data.cnt); // Display the bot's response
            } else {
                addMessage('bot', 'Sorry, I did not understand that.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('bot', 'An error occurred. Please try again.');
        });
}
