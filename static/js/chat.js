document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    let currentCategory = '';
    let currentSubcategory = '';

    const subcategories = {
        'Shoes': ['Sneakers', 'Sandals', 'Boots'],
        'Perfumes': ['Floral', 'Citrus', 'Woody'],
        'Watches': ['Analog', 'Digital', 'Smartwatches']
    };

    const budgetOptions = ['Under $50', '$50–100', '$100+'];

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

    function showSubcategories(category) {
        currentCategory = category;
        addMessage(`What type of ${category.toLowerCase()} are you interested in?`);
        addButtons(subcategories[category], 'subcategory');
    }

    function showBudgetOptions(subcategory) {
        currentSubcategory = subcategory;
        addMessage('What is your budget range?');
        addButtons(budgetOptions, 'budget');
    }

    async function getRecommendations(budget) {
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
});
