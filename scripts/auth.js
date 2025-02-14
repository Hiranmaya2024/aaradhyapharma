
document.addEventListener('DOMContentLoaded', () => {
   
    const loginForm1 = document.getElementById('loginForm');
    if (!loginForm1) {
        console.error('Login form not found');
        return;
    }

    loginForm1.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
     //   const customerphoto = document.getElementById('customer-photo');


        errorMessage.textContent = '';

        try {
            if (typeof window.getLoginCredentials !== 'function') {
                throw new Error('API functions not loaded properly');
            }

            const credentials = await window.getLoginCredentials();
            if (!Array.isArray(credentials)) {
                throw new Error('Invalid credentials data received');
            }

            const user = credentials.find(row => row[0] === username && row[1] === password);
            

            if (user) {
                // Store user info in sessionStorage
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userType', user[2]);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('tourdate', user[5]);
                sessionStorage.setItem('shopname', user[6]);
                sessionStorage.setItem('area', user[7]);
                sessionStorage.setItem('prop', user[8]); 
                sessionStorage.setItem('phone', user[9]);
                // Redirect based on user type
                if (user[2] === 'staff') {
                    window.location.href = './pages/staff120125.html';
                } else if (user[2] === 'customer') {
                    window.location.href = './pages/customer040225.html';

                } else {
                    errorMessage.textContent = 'Unauthorized Access';
                }
            } else {
                errorMessage.textContent = 'Invalid username or password';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            console.error('Authentication error:', error);
        }
    });
});

