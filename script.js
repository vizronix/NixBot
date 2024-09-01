const userInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');

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
    let response = '';

    switch (command.toLowerCase()) {
        case 'hello':
            response = 'Hi there! How can I assist you today?';
            break;
        case 'help':
            response = 'Available commands: hello, time, date, help';
            break;
        case 'time':
            response = `Current time: ${new Date().toLocaleTimeString()}`;
            break;
        case 'date':
            response = `Today's date: ${new Date().toLocaleDateString()}`;
            break;
        default:
            response = 'Unknown command. Type "help" for a list of commands.';
            break;
    }

    setTimeout(() => addMessage('bot', response), 500); // Simulate typing delay
}
