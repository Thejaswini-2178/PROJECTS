document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.querySelector('.clear-chat');
    
    // Configuration - point to your backend endpoint
    const API_ENDPOINT = '/api/chat'; // Relative path to your backend
    
    // Initialize conversation history
    let conversationHistory = [
        { role: "system", content: "You are a helpful assistant." }
    ];
    
    // Auto-resize textarea as user types
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Send message when button is clicked
    sendButton.addEventListener('click', sendMessage);
    
    // Send message when Enter is pressed
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Clear chat history
    clearChatButton.addEventListener('click', clearChat);
    
    // Function to send a message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to UI
        addMessage('user', message);
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Add user message to conversation history
        conversationHistory.push({ role: "user", content: message });
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Call the API through our secure backend
            const response = await callChatAPI(conversationHistory);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            if (response && response.choices && response.choices[0].message) {
                const botMessage = response.choices[0].message.content;
                
                // Add bot message to UI
                addMessage('bot', botMessage);
                
                // Add bot message to conversation history
                conversationHistory.push({ role: "assistant", content: botMessage });
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Show appropriate error message
            let errorMessage = "Sorry, I encountered an error. Please try again later.";
            
            if (error.message.includes('401')) {
                errorMessage = "Authentication error. Please check with the administrator.";
            } else if (error.message.includes('429')) {
                errorMessage = "Too many requests. Please wait a moment and try again.";
                showRateLimitWarning();
            }
            
            addMessage('bot', errorMessage);
            console.error('API Error:', error);
        }
    }
    
    // Function to call our backend API
    async function callChatAPI(messages) {
        sendButton.disabled = true;
        
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || `API request failed with status ${response.status}`
                );
            }
            
            return await response.json();
        } finally {
            sendButton.disabled = false;
        }
    }
    
    // Function to add a message to the chat UI
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.textContent = text;
        
        const timeElement = document.createElement('span');
        timeElement.classList.add('message-time');
        timeElement.textContent = getCurrentTime();
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(timeElement);
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('typing-indicator');
        typingElement.id = 'typing-indicator';
        
        typingElement.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    // Function to show rate limit warning
    function showRateLimitWarning() {
        const warning = document.createElement('div');
        warning.className = 'rate-limit-warning';
        warning.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>You're sending messages too quickly. Please wait a moment.</span>
        `;
        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 5000);
    }
    
    // Function to clear the chat
    function clearChat() {
        chatMessages.innerHTML = '';
        conversationHistory = [
            { role: "system", content: "You are a helpful assistant." }
        ];
    }
    
    // Helper function to get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Initial greeting
    setTimeout(() => {
        addMessage('bot', "Hello! How can I help you today?");
        conversationHistory.push({ role: "assistant", content: "Hello! How can I help you today?" });
    }, 500);
});