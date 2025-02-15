document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const backButton = document.getElementById('backButton');
    const clearButton = document.getElementById('clearButton');
    let currentCategory = '';
    let currentSubcategory = '';
    let currentStep = 'category';

    const subcategories = {
        'Shoes': ['Sneakers', 'Sandals', 'Boots'],
        'Perfumes': ['Floral', 'Citrus', 'Woody'],
        'Watches': ['Analog', 'Digital', 'Smartwatches']
    };

    const budgetOptions = ['Under $50', '$50–100', '$100+'];
    const steps = ['category', 'subcategory', 'budget', 'recommendations'];

    function clearChat() {
        currentStep = 'category';
        currentCategory = '';
        currentSubcategory = '';

        // Add fade-out animation to existing content
        const content = chatMessages.innerHTML;
        chatMessages.innerHTML = '<div class="fade-out">' + content + '</div>';

        // After animation, reset chat
        setTimeout(() => {
            chatMessages.innerHTML = `
                <button class="back-button" id="backButton">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Back
                </button>
                <div class="message">
                    <p>Welcome to Grazipix! What are you looking for today?</p>
                </div>
                <div class="buttons">
                    <button class="chat-button" data-category="Shoes">Shoes</button>
                    <button class="chat-button" data-category="Perfumes">Perfumes</button>
                    <button class="chat-button" data-category="Watches">Watches</button>
                </div>
            `;
            updateBackButton();
        }, 300);
    }

    clearButton.addEventListener('click', clearChat);

    function addMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
    }

    function addButtons(options, className) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'chat-button';
            button.textContent = option;
            button.dataset[className] = option;
            buttonsDiv.appendChild(button);
        });

        chatMessages.appendChild(buttonsDiv);
        return buttonsDiv;
    }

    function clearPreviousOptions() {
        const buttons = chatMessages.querySelectorAll('.buttons');
        buttons.forEach(buttonGroup => {
            buttonGroup.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => buttonGroup.remove(), 300);
        });
    }

    function showSubcategories(category) {
        currentCategory = category;
        currentStep = 'subcategory';
        clearPreviousOptions();
        addMessage(`What type of ${category.toLowerCase()} are you interested in?`);
        addButtons(subcategories[category], 'subcategory');
        updateBackButton();
    }

    function showBudgetOptions(subcategory) {
        currentSubcategory = subcategory;
        currentStep = 'budget';
        clearPreviousOptions();
        addMessage('What is your budget range?');
        addButtons(budgetOptions, 'budget');
        updateBackButton();
    }

    function updateBackButton() {
        const backButton = document.getElementById('backButton');
        if (currentStep === 'category') {
            backButton.classList.remove('visible');
        } else {
            backButton.classList.add('visible');
        }
    }

    function goBack() {
        const stepIndex = steps.indexOf(currentStep);
        if (stepIndex > 0) {
            currentStep = steps[stepIndex - 1];
            clearPreviousOptions();

            if (currentStep === 'category') {
                currentCategory = '';
                currentSubcategory = '';
                addMessage('What are you looking for today?');
                addButtons(['Shoes', 'Perfumes', 'Watches'], 'category');
            } else if (currentStep === 'subcategory') {
                currentSubcategory = '';
                showSubcategories(currentCategory);
            }

            updateBackButton();
        }
    }

    backButton.addEventListener('click', goBack);

    chatMessages.addEventListener('click', function(e) {
        if (e.target.classList.contains('chat-button')) {
            if (e.target.dataset.category) {
                showSubcategories(e.target.dataset.category);
            } else if (e.target.dataset.subcategory) {
                showBudgetOptions(e.target.dataset.subcategory);
            } else if (e.target.dataset.budget) {
                getRecommendations(e.target.dataset.budget);
            }
        }
    });

    async function getRecommendations(budget) {
        currentStep = 'recommendations';
        clearPreviousOptions();
        updateBackButton();

        try {
            const response = await fetch('/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: currentCategory,
                    subcategory: currentSubcategory,
                    budget: budget
                })
            });

            const data = await response.json();

            if (data.success) {
                addMessage('Here are your recommendations:');
                const recommendations = data.recommendations.join('<br>');
                addMessage(recommendations);
            } else {
                addMessage('Sorry, something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong. Please try again.');
        }
    }
});