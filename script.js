// script.js - Game logic for the Arabic Word Game

// Global variables
let score = 0;              // Player's score
let dictionary = [];        // Array to store valid words from the dictionary

// DOM elements
const wordInput = document.getElementById('word-input');
const checkBtn = document.getElementById('check-btn');
const resultArea = document.getElementById('result-area');
const scoreDisplay = document.getElementById('score');

// Regular expression for Arabic letters
// This regex matches Arabic characters including letters and some diacritics
const arabicRegex = /^[\u0621-\u064A\u0660-\u0669]+$/;

// Predefined dictionary of valid 3-letter Arabic words
const predefinedDictionary = [
    'كتب', 'لعب', 'ذهب', 'جلس', 'فتح',
    'علم', 'درس', 'قرأ', 'نام', 'أكل',
    'شرب', 'ركض', 'سبح', 'غنى', 'رسم',
    'قصة', 'قلم', 'كتاب', 'مدرسة', 'طالب'
];

/**
 * Initialize the game by setting up the dictionary
 */
function initGame() {
    try {
        // Use the predefined dictionary
        dictionary = predefinedDictionary;
        console.log('Dictionary loaded:', dictionary);
    } catch (error) {
        console.error('Error setting up dictionary:', error);
        resultArea.innerHTML = '<p style="color: red;">خطأ في تحميل القاموس!</p>';
    }
}

/**
 * Validate if a word consists of exactly 3 Arabic characters
 * @param {string} word - The word to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidWordFormat(word) {
    // Check if word is exactly 3 characters and all are Arabic letters
    return word.length === 3 && arabicRegex.test(word);
}

/**
 * Check if a word exists in the dictionary
 * @param {string} word - The word to check
 * @returns {boolean} - True if word exists in dictionary, false otherwise
 */
function isWordInDictionary(word) {
    return dictionary.includes(word);
}

/**
 * Update the player's score
 * @param {number} points - Points to add (can be negative)
 */
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}

/**
 * Display a message in the result area
 * @param {string} message - Message to display
 * @param {string} className - CSS class for styling (correct/incorrect)
 */
function showResult(message, className) {
    resultArea.textContent = message;
    resultArea.className = `result-area ${className}`;
}

/**
 * Handle the word checking process
 */
function checkWord() {
    // Get the word from input and trim whitespace
    const word = wordInput.value.trim();
    
    // Clear previous results
    resultArea.className = 'result-area';
    
    // Validate input
    if (word === '') {
        showResult('يرجى إدخال كلمة!', 'incorrect');
        return;
    }
    
    if (!isValidWordFormat(word)) {
        showResult('الكلمة يجب أن تكون مكونة من 3 أحرف عربية فقط!', 'incorrect');
        return;
    }
    
    // Check if word is in dictionary
    if (isWordInDictionary(word)) {
        // Correct word
        updateScore(1);
        const encouragementMessages = [
            'أحسنت! 🌟',
            'ممتاز! 👍',
            'رائع جداً! 🎉',
            'عمل جميل! ✨',
            'أنت ذكي! 🧠'
        ];
        
        // Select a random encouragement message
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        showResult(`${randomMessage} الكلمة "${word}" صحيحة.`, 'correct');
    } else {
        // Incorrect word
        showResult(`الكلمة "${word}" غير موجودة في القاموس. حاول مرة أخرى!`, 'incorrect');
    }
    
    // Clear the input field
    wordInput.value = '';
    
    // Focus back on the input field for better UX
    wordInput.focus();
}

/**
 * Prevent non-Arabic characters from being entered
 */
function restrictToArabic(event) {
    const char = String.fromCharCode(event.which);
    
    // If the character is not an Arabic letter, prevent it
    if (!arabicRegex.test(char)) {
        event.preventDefault();
    }
}

// Event listeners
checkBtn.addEventListener('click', checkWord);

// Also check when Enter key is pressed
wordInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkWord();
    }
});

// Restrict input to Arabic characters only
wordInput.addEventListener('keypress', restrictToArabic);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);