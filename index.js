
        // Form validation constants and messages
        const VALIDATION_MESSAGES = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: (min) => `Must be at least ${min} characters`,
            maxLength: (max) => `Must not exceed ${max} characters`
        };
        
        // Utility functions for error handling
        function showError(input, message) {
            removeError(input);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback d-block';
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            input.parentElement.appendChild(errorDiv);
        }
        
        function removeError(input) {
            const existingError = input.parentElement.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
        
        // Validation helper functions
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function isValidPhone(phone) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }
        
        // Field validation function
        function validateField(input) {
            const value = input.value.trim();
            
            // Check required fields
            if (input.hasAttribute('required') && !value) {
                showError(input, VALIDATION_MESSAGES.required);
                return false;
            }
        
            // Specific validation based on field type
            switch(input.id) {
                case 'name':
                    if (value.length < 2) {
                        showError(input, VALIDATION_MESSAGES.minLength(2));
                        return false;
                    }
                    if (value.length > 100) {
                        showError(input, VALIDATION_MESSAGES.maxLength(100));
                        return false;
                    }
                    break;
                    
                case 'email':
                    if (!isValidEmail(value)) {
                        showError(input, VALIDATION_MESSAGES.email);
                        return false;
                    }
                    break;
                    
                case 'phone':
                    if (!isValidPhone(value)) {
                        showError(input, VALIDATION_MESSAGES.phone);
                        return false;
                    }
                    break;
                    
                case 'projectTitle':
                    if (value.length < 5) {
                        showError(input, VALIDATION_MESSAGES.minLength(5));
                        return false;
                    }
                    if (value.length > 200) {
                        showError(input, VALIDATION_MESSAGES.maxLength(200));
                        return false;
                    }
                    break;
                    
                case 'projectDescription':
                    if (value.length < 50) {
                        showError(input, VALIDATION_MESSAGES.minLength(50));
                        return false;
                    }
                    if (value.length > 5000) {
                        showError(input, VALIDATION_MESSAGES.maxLength(5000));
                        return false;
                    }
                    break;
            }
            
            removeError(input);
            return true;
        }
        
        // Main initialization function
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('projectForm');
            const inputs = form.querySelectorAll('input:not([type="radio"]), textarea');
            const submitButton = form.querySelector('.btn-submit');
            
            // Add input animation and validation
            inputs.forEach(input => {
                // Handle input animations
                input.addEventListener('focus', () => {
                    input.parentElement.style.transform = 'translateX(10px)';
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.style.transform = 'translateX(0)';
                    validateField(input);
                });
                
                // Real-time validation
                input.addEventListener('input', () => {
                    validateField(input);
                    updateSubmitButtonState();
                });
            });
            
            // Gender validation
            const genderInputs = form.querySelectorAll('input[name="gender"]');
            genderInputs.forEach(radio => {
                radio.addEventListener('change', () => {
                    const genderContainer = document.querySelector('.gender-options');
                    genderContainer.classList.remove('is-invalid');
                    const errorMessage = genderContainer.querySelector('.invalid-feedback');
                    if (errorMessage) errorMessage.remove();
                    updateSubmitButtonState();
                });
            });
            
            // Update submit button state
            function updateSubmitButtonState() {
                const isFormValid = Array.from(inputs).every(input => validateField(input)) &&
                    form.querySelector('input[name="gender"]:checked');
                submitButton.disabled = !isFormValid;
            }
            
            // Form submission handler
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validate all fields
                let isValid = true;
                
                // Validate text inputs and textarea
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });
                
                // Validate gender selection
                if (!form.querySelector('input[name="gender"]:checked')) {
                    const genderContainer = document.querySelector('.gender-options');
                    genderContainer.classList.add('is-invalid');
                    showError(genderContainer, VALIDATION_MESSAGES.required);
                    isValid = false;
                }
                
                if (isValid) {
                    // Add loading state
                    submitButton.classList.add('loading');
                    
                    // Simulate form submission (replace with actual API call)
                    setTimeout(() => {
                        submitButton.classList.remove('loading');
                        
                        // Show success message
                        const successAlert = document.createElement('div');
                        successAlert.className = 'alert alert-success mt-3 animate__animated animate__fadeInDown';
                        successAlert.role = 'alert';
                        successAlert.textContent = '🎉 Form submitted successfully!';
                        form.appendChild(successAlert);
                        
                        // Reset form after delay
                        setTimeout(() => {
                            form.reset();
                            successAlert.remove();
                            inputs.forEach(input => {
                                input.classList.remove('is-valid');
                                input.classList.remove('is-invalid');
                            });
                            updateSubmitButtonState();
                        }, 3000);
                    }, 1500);
                }
            });
        });