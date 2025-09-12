document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                if (response.ok) {
                    alert('Registro bem-sucedido! Verifique seu e-mail para ativar sua conta.');
                    window.location.href = 'login.html';
                } else {
                    alert('Falha no registro. Verifique os dados inseridos.');
                }
            } catch (error) {
                console.error('Erro ao registrar:', error);
                alert('Ocorreu um erro ao tentar registrar.');
            }
        });
    }
});
