import os
from flask import Flask, render_template, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")

# Mock product data
PRODUCTS = {
    'Shoes': {
        'Sneakers': {
            'Under $50': ['Basic Canvas Sneakers ($45)', 'Running Shoes ($49)'],
            '$50–100': ['Nike Sport Sneakers ($89)', 'Adidas Classics ($79)'],
            '$100+': ['Limited Edition Sneakers ($150)', 'Premium Running Shoes ($129)']
        },
        'Sandals': {
            'Under $50': ['Beach Sandals ($25)', 'Casual Flip-flops ($19)'],
            '$50–100': ['Leather Sandals ($69)', 'Sport Sandals ($59)'],
            '$100+': ['Designer Sandals ($119)', 'Premium Leather Sandals ($129)']
        },
        'Boots': {
            'Under $50': ['Rain Boots ($45)', 'Work Boots ($49)'],
            '$50–100': ['Hiking Boots ($89)', 'Fashion Boots ($79)'],
            '$100+': ['Premium Leather Boots ($159)', 'Designer Boots ($199)']
        }
    },
    'Perfumes': {
        'Floral': {
            'Under $50': ['Rose Essence ($45)', 'Jasmine Dreams ($49)'],
            '$50–100': ['Floral Bouquet ($89)', 'Garden Fresh ($79)'],
            '$100+': ['Premium Rose ($129)', 'Luxury Floral ($159)']
        },
        'Citrus': {
            'Under $50': ['Lemon Fresh ($39)', 'Orange Burst ($45)'],
            '$50–100': ['Citrus Blend ($69)', 'Summer Fresh ($89)'],
            '$100+': ['Premium Citrus ($119)', 'Luxury Citrus ($149)']
        },
        'Woody': {
            'Under $50': ['Cedar Basic ($45)', 'Pine Fresh ($49)'],
            '$50–100': ['Sandalwood Blend ($89)', 'Forest Mystery ($79)'],
            '$100+': ['Premium Oud ($159)', 'Luxury Woods ($199)']
        }
    },
    'Watches': {
        'Analog': {
            'Under $50': ['Basic Analog ($45)', 'Classic Design ($49)'],
            '$50–100': ['Steel Watch ($89)', 'Leather Band ($79)'],
            '$100+': ['Premium Analog ($159)', 'Luxury Watch ($199)']
        },
        'Digital': {
            'Under $50': ['Sport Digital ($45)', 'Basic Digital ($39)'],
            '$50–100': ['Advanced Digital ($89)', 'Multifunction ($79)'],
            '$100+': ['Premium Digital ($129)', 'Smart Digital ($159)']
        },
        'Smartwatches': {
            'Under $50': ['Basic Fitness Tracker ($49)', 'Simple Smart ($45)'],
            '$50–100': ['Advanced Tracker ($89)', 'Sport Smart ($79)'],
            '$100+': ['Premium Smart ($199)', 'Luxury Smart ($249)']
        }
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    category = data.get('category')
    subcategory = data.get('subcategory')
    budget = data.get('budget')
    
    try:
        recommendations = PRODUCTS[category][subcategory][budget]
        return jsonify({'success': True, 'recommendations': recommendations})
    except KeyError:
        return jsonify({'success': False, 'error': 'Invalid selection'}), 400
