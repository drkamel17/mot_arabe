// script.js - Game logic for the Arabic Word Game

// Global variables
let score = 0;              // Player's score
let dictionary = [];        // Array to store valid words from the dictionary

// DOM elements
const wordInput = document.getElementById('word-input');
const checkBtn = document.getElementById('check-btn');
const resultArea = document.getElementById('result-area');
const scoreDisplay = document.getElementById('score');

// Teacher panel elements
const toggleTeacherPanelBtn = document.getElementById('toggle-teacher-panel');
const teacherPanel = document.getElementById('teacher-panel');
const newWordInput = document.getElementById('new-word-input');
const addWordBtn = document.getElementById('add-word-btn');
const teacherResultArea = document.getElementById('teacher-result-area');

// Export/Import elements
const exportDictionaryBtn = document.getElementById('export-dictionary-btn');
const importDictionaryBtn = document.getElementById('import-dictionary-btn');
const importDictionaryInput = document.getElementById('import-dictionary-input');

// Regular expression for Arabic letters
// This regex matches Arabic characters including letters and some diacritics
const arabicRegex = /^[\u0621-\u064A\u0660-\u0669]+$/;

/**
 * Initialize the game by loading the dictionary
 */
async function initGame() {
    try {
        // First, try to load from localStorage
        const savedDictionary = localStorage.getItem('arabicDictionary');
        if (savedDictionary) {
            dictionary = JSON.parse(savedDictionary);
            console.log('Dictionary loaded from localStorage:', dictionary);
            return;
        }
        
        // If no saved dictionary, fetch the default one
        const response = await fetch('words.txt');
        const text = await response.text();
        
        // Split the text into an array of words
        dictionary = text.trim().split('\n')
            .map(word => word.trim())           // Remove extra whitespace
            .filter(word => word.length > 0);   // Remove empty lines
        
        console.log('Dictionary loaded from file:', dictionary);
    } catch (error) {
        console.error('Error loading dictionary:', error);
        resultArea.innerHTML = '<p style="color: red;">خطأ في تحميل القاموس! يرجى التأكد من وجود ملف words.txt</p>';
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
 * Display a message in the teacher result area
 * @param {string} message - Message to display
 * @param {string} className - CSS class for styling (teacher-success/teacher-error)
 */
function showTeacherResult(message, className) {
    teacherResultArea.textContent = message;
    teacherResultArea.className = `teacher-result-area ${className}`;
}

/**
 * Toggle the visibility of the teacher panel
 */
function toggleTeacherPanel() {
    teacherPanel.classList.toggle('hidden');
}

/**
 * Add a new word to the dictionary
 */
function addNewWord() {
    const newWord = newWordInput.value.trim();
    
    // Validate input
    if (newWord === '') {
        showTeacherResult('يرجى إدخال كلمة!', 'teacher-error');
        return;
    }
    
    if (!isValidWordFormat(newWord)) {
        showTeacherResult('الكلمة يجب أن تكون مكونة من 3 أحرف عربية فقط!', 'teacher-error');
        return;
    }
    
    // Check if word already exists
    if (isWordInDictionary(newWord)) {
        showTeacherResult(`الكلمة "${newWord}" موجودة بالفعل في القاموس!`, 'teacher-error');
        return;
    }
    
    // Add word to dictionary
    dictionary.push(newWord);
    
    // Show success message
    showTeacherResult(`تمت إضافة الكلمة "${newWord}" بنجاح إلى القاموس!`, 'teacher-success');
    
    // Clear the input field
    newWordInput.value = '';
    
    // Save the updated dictionary to localStorage for persistence
    try {
        localStorage.setItem('arabicDictionary', JSON.stringify(dictionary));
        console.log('Dictionary saved to localStorage');
    } catch (error) {
        console.error('Error saving dictionary to localStorage:', error);
    }
}

/**
 * Export the current dictionary as a text file
 */
function exportDictionary() {
    try {
        // Create the content for the file
        const content = dictionary.join('\n');
        
        // Create a Blob with the content
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'words_updated.txt';
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        showTeacherResult('تم تصدير القاموس بنجاح!', 'teacher-success');
    } catch (error) {
        console.error('Error exporting dictionary:', error);
        showTeacherResult('حدث خطأ أثناء تصدير القاموس!', 'teacher-error');
    }
}

/**
 * Import a dictionary from a text file
 */
function importDictionary() {
    importDictionaryInput.click();
}

/**
 * Handle the file import
 */
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const importedWords = content.trim().split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);
                   
            // Update the dictionary
            dictionary = importedWords;
            
            // Save to localStorage
            localStorage.setItem('arabicDictionary', JSON.stringify(dictionary));
            
            showTeacherResult(`تم استيراد ${importedWords.length} كلمة بنجاح!`, 'teacher-success');
            
            // Clear the file input
            importDictionaryInput.value = '';
        } catch (error) {
            console.error('Error importing dictionary:', error);
            showTeacherResult('حدث خطأ أثناء استيراد القاموس!', 'teacher-error');
        }
    };
    
    reader.onerror = function() {
        showTeacherResult('حدث خطأ أثناء قراءة الملف!', 'teacher-error');
    };
    
    reader.readAsText(file);
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
    
    // if (!isValidWordFormat(word)) {
        // showResult('الكلمة يجب أن تكون مكونة من 3 أحرف عربية فقط!', 'incorrect');
        // return;
    // }
    
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
toggleTeacherPanelBtn.addEventListener('click', toggleTeacherPanel);
addWordBtn.addEventListener('click', addNewWord);
exportDictionaryBtn.addEventListener('click', exportDictionary);
importDictionaryBtn.addEventListener('click', importDictionary);
importDictionaryInput.addEventListener('change', handleFileImport);

// Also check when Enter key is pressed
wordInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkWord();
    }
});

newWordInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addNewWord();
    }
});

// Restrict input to Arabic characters only
wordInput.addEventListener('keypress', restrictToArabic);
newWordInput.addEventListener('keypress', restrictToArabic);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
