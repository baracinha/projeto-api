

const form = document.getElementById('signinform');

if (form)  {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const tel = document.getElementById('tel').value;

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, tel })
            });
            const data = await response.json();
            if (!response.ok) {
                alert('erro: '+ data.message || 'erro desconhecido');
            } else {
                alert('bem vindo, ' + name);
                form.reset();
            }
        } catch (error) {
            console.error('Erro ao registrar utilizador:', error);
        }  
    });
}
const loginForm = document.getElementById('loginform');

if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });
            const data = await response.json();
            if (!response.ok) {
                alert('Erro: ' + data.message || 'Erro desconhecido');
            } else {
            localStorage.setItem('nomeUser', data.nomeUser);
            window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Erro ao efetuar login:', error);
        }
    });

}  else {
    console.log('Login form not found on this page.');
}

const userDisplay = document.getElementById('user-display');
const username = localStorage.getItem('nomeUser');
if (userDisplay && username) {
    userDisplay.textContent = username;
}

const logoutButton = document.getElementById('btn_logout');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('nomeUser');
        window.location.href = 'login.html';
    });
    if (!localStorage.getItem('nomeUser')) {
        logoutButton.style.display = 'none';
        window.location.href = 'login.html';
    }
}

const listaUtilizadoresDiv = document.getElementById('lista_utilizadores');
if (listaUtilizadoresDiv) {
    fetch('http://localhost:8080/lista')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.textContent = `Nome: ${user.username}, Email: ${user.email}, Telefone: ${user.telefone}`;
                listaUtilizadoresDiv.appendChild(userDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao obter a lista de utilizadores:', error);
        });
}