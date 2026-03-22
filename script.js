let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x')
    navbar.classList.toggle('active');
}

document.getElementById("connectBtn").addEventListener("click", function() {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("getcv").addEventListener("click", function(event) {
    event.preventDefault();

    let fileId = "1KhR0qwqEob_4n0aLgPe5jCsenptgrW33"; 
    let downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    let a = document.createElement("a");
    a.href = downloadLink;
    a.download = "Dashintha-Jayawardana.pdf"; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// ========================================
// Contact Form Validation & Anti-Spam
// ========================================

// Spam keywords to block
const SPAM_KEYWORDS = [
    'http', 'www', 'https', 'crypto', 'cryptocurrency', 'bitcoin',
    'loan', 'casino', 'viagra', 'pills', 'click here', 'buy now',
    'limited time', 'act now', 'free money', 'winner', 'prize'
];

// Rate limiting configuration (30 seconds)
const RATE_LIMIT_TIME = 30000; // 30 seconds in milliseconds

// Get form and inputs
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const honeypotField = document.querySelector('input[name="website"]');

// Error display elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const messageError = document.getElementById('message-error');
const formStatus = document.getElementById('form-status');

/**
 * Validates name field
 * - Minimum 3 characters
 * - Only letters and spaces
 * - No repeated characters
 */
function validateName(name) {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters long' };
    }

    // Only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, message: 'Name can only contain letters and spaces' };
    }

    // Check for repeated characters (e.g., "aaaaaaa")
    if (hasRepeatedCharacters(trimmedName)) {
        return { valid: false, message: 'Name contains too many repeated characters' };
    }

    return { valid: true, message: '' };
}

/**
 * Validates email field
 * - Must be valid email format
 */
function validateEmail(email) {
    const trimmedEmail = email.trim();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true, message: '' };
}

/**
 * Validates phone number
 * - Must be numeric
 * - Minimum 10 digits
 */
function validatePhone(phone) {
    const trimmedPhone = phone.trim();

    // Remove common formatting characters
    const cleanedPhone = trimmedPhone.replace(/[\s\-\(\)]/g, '');

    // Must be numeric
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(cleanedPhone)) {
        return { valid: false, message: 'Phone number must contain only digits' };
    }

    // Minimum 10 digits
    if (cleanedPhone.length < 10) {
        return { valid: false, message: 'Phone number must be at least 10 digits' };
    }

    return { valid: true, message: '' };
}

/**
 * Validates message field
 * - Minimum 10 characters, recommended 20+
 * - No repeated characters
 * - Must contain meaningful words
 * - No spam keywords
 */
function validateMessage(message) {
    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 10) {
        return { valid: false, message: 'Message must be at least 10 characters long' };
    }

    if (trimmedMessage.length < 20) {
        return { valid: false, message: 'Please provide a more detailed message (at least 20 characters)' };
    }

    // Check for repeated characters
    if (hasRepeatedCharacters(trimmedMessage)) {
        return { valid: false, message: 'Message contains too many repeated characters' };
    }

    // Check for meaningful content (must have at least 3 words)
    if (!hasMeaningfulContent(trimmedMessage)) {
        return { valid: false, message: 'Please write a meaningful message with complete words' };
    }

    // Check for spam keywords
    if (containsSpamKeywords(trimmedMessage)) {
        return { valid: false, message: 'Message contains prohibited content' };
    }

    return { valid: true, message: '' };
}

/**
 * Checks if text has too many repeated characters
 * Returns true if 5 or more of the same character appear consecutively
 */
function hasRepeatedCharacters(text) {
    const repeatedPattern = /(.)\1{4,}/;
    return repeatedPattern.test(text);
}

/**
 * Checks if message has meaningful content
 * Must have at least 3 words (2+ characters each)
 */
function hasMeaningfulContent(text) {
    const words = text.split(/\s+/).filter(word => word.length >= 2);
    return words.length >= 3;
}

/**
 * Checks for spam keywords
 */
function containsSpamKeywords(text) {
    const lowerText = text.toLowerCase();
    return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Shows error message
 */
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = '#ef4444';
    element.style.fontSize = '1.25rem';
    element.style.marginTop = '0.5rem';
    element.style.fontWeight = '500';
}

/**
 * Clears error message
 */
function clearError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

/**
 * Shows form status message
 */
function showFormStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.style.color = isError ? '#ef4444' : '#22c55e';
    formStatus.style.fontSize = '1rem';
    formStatus.style.marginTop = '1rem';
    formStatus.style.textAlign = 'center';
    formStatus.style.fontWeight = '500';
}

/**
 * Clears form status message
 */
function clearFormStatus() {
    formStatus.textContent = '';
    formStatus.style.display = 'none';
}

/**
 * Checks rate limiting using localStorage
 */
function checkRateLimit() {
    const lastSubmissionTime = localStorage.getItem('lastFormSubmission');

    if (lastSubmissionTime) {
        const timeSinceLastSubmission = Date.now() - parseInt(lastSubmissionTime);

        if (timeSinceLastSubmission < RATE_LIMIT_TIME) {
            const remainingSeconds = Math.ceil((RATE_LIMIT_TIME - timeSinceLastSubmission) / 1000);
            return { allowed: false, remainingSeconds };
        }
    }

    return { allowed: true };
}

/**
 * Updates last submission timestamp
 */
function updateSubmissionTimestamp() {
    localStorage.setItem('lastFormSubmission', Date.now().toString());
}

/**
 * Validates entire form
 */
function validateForm() {
    let isValid = true;

    // Clear all previous errors
    clearError(nameError);
    clearError(emailError);
    clearError(phoneError);
    clearError(messageError);
    clearFormStatus();

    // Validate name
    const nameValidation = validateName(nameInput.value);
    if (!nameValidation.valid) {
        showError(nameError, nameValidation.message);
        isValid = false;
    }

    // Validate email
    const emailValidation = validateEmail(emailInput.value);
    if (!emailValidation.valid) {
        showError(emailError, emailValidation.message);
        isValid = false;
    }

    // Validate phone
    const phoneValidation = validatePhone(phoneInput.value);
    if (!phoneValidation.valid) {
        showError(phoneError, phoneValidation.message);
        isValid = false;
    }

    // Validate message
    const messageValidation = validateMessage(messageInput.value);
    if (!messageValidation.valid) {
        showError(messageError, messageValidation.message);
        isValid = false;
    }

    // Check honeypot (if filled, it's a bot)
    if (honeypotField && honeypotField.value !== '') {
        showFormStatus('Submission blocked. Please try again.', true);
        return false;
    }

    // Check rate limiting
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
        showFormStatus(`Please wait ${rateLimitCheck.remainingSeconds} seconds before submitting again`, true);
        return false;
    }

    return isValid;
}

/**
 * Handle form submission
 */
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Disable submit button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.value = 'Sending...';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';

    // Prepare form data
    const formData = new FormData(contactForm);

    try {
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Success
            showFormStatus('✓ Message sent successfully! I will get back to you soon.', false);

            // Update rate limit timestamp
            updateSubmissionTimestamp();

            // Reset form
            contactForm.reset();

            // Re-enable submit button after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.value = 'Send Message';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                clearFormStatus();
            }, 3000);
        } else {
            // Error from Web3Forms
            showFormStatus('✗ Something went wrong. Please try again.', true);

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.value = 'Send Message';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    } catch (error) {
        // Network or other error
        showFormStatus('✗ Network error. Please check your connection and try again.', true);

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.value = 'Send Message';
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
});

// Real-time validation on input (optional - provides better UX)
nameInput.addEventListener('blur', function() {
    const validation = validateName(this.value);
    if (!validation.valid) {
        showError(nameError, validation.message);
    } else {
        clearError(nameError);
    }
});

emailInput.addEventListener('blur', function() {
    const validation = validateEmail(this.value);
    if (!validation.valid) {
        showError(emailError, validation.message);
    } else {
        clearError(emailError);
    }
});

phoneInput.addEventListener('blur', function() {
    const validation = validatePhone(this.value);
    if (!validation.valid) {
        showError(phoneError, validation.message);
    } else {
        clearError(phoneError);
    }
});

messageInput.addEventListener('blur', function() {
    const validation = validateMessage(this.value);
    if (!validation.valid) {
        showError(messageError, validation.message);
    } else {
        clearError(messageError);
    }
});
