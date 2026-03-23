// Update Modal Logic
const updateModal = document.getElementById('update-modal');
const goToUpdatedBtn = document.getElementById('go-to-updated');
const stayHereBtn = document.getElementById('stay-here');

function showUpdateModal() {
    updateModal.classList.add('show');
}

function hideUpdateModal() {
    updateModal.classList.remove('show');
}

goToUpdatedBtn.addEventListener('click', function() {
    window.location.href = 'https://dashijayawardana.vercel.app/';
});

stayHereBtn.addEventListener('click', hideUpdateModal);

// Show modal on page load
window.addEventListener('load', function() {
    showUpdateModal();
});

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

const SPAM_KEYWORDS = [
    'http', 'www', 'https', 'crypto', 'cryptocurrency', 'bitcoin',
    'loan', 'casino', 'viagra', 'pills', 'click here', 'buy now',
    'limited time', 'act now', 'free money', 'winner', 'prize'
];

const RATE_LIMIT_TIME = 30000;

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const honeypotField = document.querySelector('input[name="website"]');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const messageError = document.getElementById('message-error');
const formStatus = document.getElementById('form-status');

function validateName(name) {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters long' };
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, message: 'Name can only contain letters and spaces' };
    }

    if (hasRepeatedCharacters(trimmedName)) {
        return { valid: false, message: 'Name contains too many repeated characters' };
    }

    return { valid: true, message: '' };
}

function validateEmail(email) {
    const trimmedEmail = email.trim();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true, message: '' };
}

function validatePhone(phone) {
    const trimmedPhone = phone.trim();

    const cleanedPhone = trimmedPhone.replace(/[\s\-\(\)]/g, '');

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(cleanedPhone)) {
        return { valid: false, message: 'Phone number must contain only digits' };
    }

    if (cleanedPhone.length < 10) {
        return { valid: false, message: 'Phone number must be at least 10 digits' };
    }

    return { valid: true, message: '' };
}

function validateMessage(message) {
    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 10) {
        return { valid: false, message: 'Message must be at least 10 characters long' };
    }

    if (trimmedMessage.length < 20) {
        return { valid: false, message: 'Please provide a more detailed message (at least 20 characters)' };
    }

    if (hasRepeatedCharacters(trimmedMessage)) {
        return { valid: false, message: 'Message contains too many repeated characters' };
    }

    if (!hasMeaningfulContent(trimmedMessage)) {
        return { valid: false, message: 'Please write a meaningful message with complete words' };
    }

    if (containsSpamKeywords(trimmedMessage)) {
        return { valid: false, message: 'Message contains prohibited content' };
    }

    return { valid: true, message: '' };
}

function hasRepeatedCharacters(text) {
    const repeatedPattern = /(.)\1{4,}/;
    return repeatedPattern.test(text);
}


function hasMeaningfulContent(text) {
    const words = text.split(/\s+/).filter(word => word.length >= 2);
    return words.length >= 3;
}


function containsSpamKeywords(text) {
    const lowerText = text.toLowerCase();
    return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword));
}


function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = '#ef4444';
    element.style.fontSize = '1.25rem';
    element.style.marginTop = '0.5rem';
    element.style.fontWeight = '500';
}


function clearError(element) {
    element.textContent = '';
    element.style.display = 'none';
}


function showFormStatus(message, isError = false) {
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.style.color = isError ? '#ef4444' : '#22c55e';
    formStatus.style.fontSize = '1rem';
    formStatus.style.marginTop = '1rem';
    formStatus.style.textAlign = 'center';
    formStatus.style.fontWeight = '500';
}


function clearFormStatus() {
    formStatus.textContent = '';
    formStatus.style.display = 'none';
}


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


function updateSubmissionTimestamp() {
    localStorage.setItem('lastFormSubmission', Date.now().toString());
}


function validateForm() {
    let isValid = true;

    clearError(nameError);
    clearError(emailError);
    clearError(phoneError);
    clearError(messageError);
    clearFormStatus();

    const nameValidation = validateName(nameInput.value);
    if (!nameValidation.valid) {
        showError(nameError, nameValidation.message);
        isValid = false;
    }

    const emailValidation = validateEmail(emailInput.value);
    if (!emailValidation.valid) {
        showError(emailError, emailValidation.message);
        isValid = false;
    }

    const phoneValidation = validatePhone(phoneInput.value);
    if (!phoneValidation.valid) {
        showError(phoneError, phoneValidation.message);
        isValid = false;
    }

    const messageValidation = validateMessage(messageInput.value);
    if (!messageValidation.valid) {
        showError(messageError, messageValidation.message);
        isValid = false;
    }

    if (honeypotField && honeypotField.value !== '') {
        showFormStatus('Submission blocked. Please try again.', true);
        return false;
    }

    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
        showFormStatus(`Please wait ${rateLimitCheck.remainingSeconds} seconds before submitting again`, true);
        return false;
    }

    return isValid;
}

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    submitBtn.disabled = true;
    submitBtn.value = 'Sending...';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';

    const formData = new FormData(contactForm);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showFormStatus('✓ Message sent successfully! I will get back to you soon.', false);

            updateSubmissionTimestamp();

            contactForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.value = 'Send Message';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                clearFormStatus();
            }, 3000);
        } else {
            showFormStatus('✗ Something went wrong. Please try again.', true);

            submitBtn.disabled = false;
            submitBtn.value = 'Send Message';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    } catch (error) {
        showFormStatus('✗ Network error. Please check your connection and try again.', true);

        submitBtn.disabled = false;
        submitBtn.value = 'Send Message';
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
});

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
