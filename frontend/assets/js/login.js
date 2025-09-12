document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('jwt', data.token);
                    window.location.href = 'index.html';
                } else {
                    alert('Falha no login. Verifique suas credenciais.');
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Ocorreu um erro ao tentar fazer login.');
            }
        });
    }
});
