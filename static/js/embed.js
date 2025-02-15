(function() {
    // Create iframe element
    function createChatbotIframe() {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://' + window.location.hostname + ':5000/embed';
        iframe.style.position = 'fixed';
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
        iframe.style.width = '400px';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '15px';
        iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        iframe.style.zIndex = '999999';
        return iframe;
    }

    // Add chatbot toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.width = '60px';
        button.style.height = '60px';
        button.style.borderRadius = '30px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        button.style.zIndex = '999999';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.transition = 'transform 0.3s ease';
        return button;
    }

    // Initialize chatbot
    window.initGrazipixChat = function() {
        const iframe = createChatbotIframe();
        const toggleButton = createToggleButton();
        let isChatVisible = false;

        // Add toggle functionality
        toggleButton.addEventListener('click', () => {
            if (isChatVisible) {
                iframe.style.display = 'none';
                toggleButton.style.transform = 'rotate(0deg)';
            } else {
                iframe.style.display = 'block';
                toggleButton.style.transform = 'rotate(360deg)';
            }
            isChatVisible = !isChatVisible;
        });

        // Add elements to page
        document.body.appendChild(toggleButton);
        document.body.appendChild(iframe);
        iframe.style.display = 'none';
    };

    // Auto-initialize if no conflicts
    if (!window.grazipixChatInitialized) {
        window.grazipixChatInitialized = true;
        window.initGrazipixChat();
    }
})();
