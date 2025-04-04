document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const phoneNumber = document.getElementById('phoneNumber');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const phoneBtn = document.getElementById('phoneBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Add more cars with random positions and speeds
    for (let i = 0; i < 5; i++) {
        const car = document.createElement('div');
        car.className = 'moving-car';
        car.style.animationDuration = `${10 + Math.random() * 10}s`;
        car.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(car);
    }
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
            
            // Hide any messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        });
    });
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        if (password.type === 'password') {
            password.type = 'text';
            togglePassword.textContent = '👁️‍🗨️';
        } else {
            password.type = 'password';
            togglePassword.textContent = '👁️';
        }
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        loginBtn.innerHTML = 'Signing In <span class="loading"></span>';
        loginBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Demo credentials
            if (email.value === 'demo@rideshare.com' && password.value === 'password') {
                errorMessage.style.display = 'none';
                successMessage.style.display = 'block';
                
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                // Redirect in a real app
                setTimeout(() => {
                    successMessage.innerHTML = 'Success! Finding drivers near you <span class="loading"></span>';
                }, 1000);
            } else {
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                
                setTimeout(() => {
                    errorMessage.style.opacity = '1';
                    errorMessage.style.transform = 'translateY(0)';
                }, 10);
                
                setTimeout(() => {
                    errorMessage.style.opacity = '0';
                    errorMessage.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 300);
                }, 3000);
            }
            
            loginBtn.innerHTML = 'Sign In';
            loginBtn.disabled = false;
        }, 2000);
    });
    
    // Phone login
    phoneBtn.addEventListener('click', function() {
        if (!phoneNumber.value) {
            return;
        }
        
        phoneBtn.innerHTML = 'Sending Code <span class="loading"></span>';
        phoneBtn.disabled = true;
        
        setTimeout(() => {
            successMessage.style.display = 'block';
            successMessage.textContent = 'Verification code sent to your phone!';
            
            setTimeout(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 10);
            
            setTimeout(() => {
                // In a real app, this would switch to a verification code entry screen
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    phoneBtn.innerHTML = 'Continue';
                    phoneBtn.disabled = false;
                    successMessage.style.display = 'none';
                }, 300);
            }, 3000);
        }, 2000);
    });
    
    // Add input validation
    email.addEventListener('input', validateForm);
    password.addEventListener('input', validateForm);
    
    function validateForm() {
        if (email.value.includes('@') && password.value.length >= 6) {
            loginBtn.disabled = false;
        } else {
            loginBtn.disabled = true;
        }
    }
    
    // Initial validation
    validateForm();
});