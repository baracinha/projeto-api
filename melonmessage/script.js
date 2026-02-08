/*
const API_URL = 'http://localhost:8080';

// Função Utilitária para tratar todos os POSTs do teu site
async function postDados(endpoint, objetoDados) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objetoDados)
    });
    return await response.json();
}
*/

const API_URL = 'http://localhost:8080';

async function posts(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`,{
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body) 
    });
    return await response.json();
}

async function gets(endpoint,body) {
    try{
        const response = await fetch(`${API_URL}${endpoint}`,{
            method : 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        return await response.json();
    }catch (error){
        console.error(`erro no ${endpoint}.`);
        return [];
    }
}

async function Login(e){
     e.preventDefault();
        const username = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        
        const data = await posts('/login', {username, password});
            if (data.nomeUser) {
                localStorage.setItem('nomeUser', data.nomeUser);
                localStorage.setItem('idUser', data.idUser);
                window.location.href = 'index.html';
            } else {
                alert('Erro: '+ data.message );
            }
}

async function criarconta(e){
    e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const tel = document.getElementById('tel').value;

        const data = await posts('/register', {name,email, password,tel }); 
            if(data.id){
                console.log('conta criada com sucesso');
                window.location.href = 'index.html'
            }
            
}

async function logout(){

    localStorage.removeItem('nomeUser');
        window.location.href = 'login.html';

}

async function listarpedidos(){
    const nome = localStorage.getItem('nomeUser');
    if(!nome) return;
    const nomereal = encodeURIComponent(localStorage.getItem('nomeUser'));
    const data = await gets('/listapedidos?adicionado=' + nomereal)
    const listaPedidosDiv = document.getElementById('containerpedidos');
        if(listaPedidosDiv && data.length > 0){
                const model = document.getElementById('pedidos');
            data.forEach(pedido =>{
                const newdiv = model.cloneNode(true);
                newdiv.removeAttribute('id');
                newdiv.className = 'dummypedido';
                newdiv.querySelector('.useradicionante').textContent = pedido.username;
                listaPedidosDiv.appendChild(newdiv);
            });
        }
}


const form = document.getElementById('signinform');

if (form)  {
    form.addEventListener('submit', criarconta);
}
const loginForm = document.getElementById('loginform');

if (loginForm) {

    loginForm.addEventListener('submit', Login);

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
    logoutButton.addEventListener('click', logout)
        
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

const listaPedidosDiv = document.getElementById('containerpedidos');
if(listaPedidosDiv) {
        listarpedidos()
    }

const pedidoForm = document.getElementById('frm_pedidos');
if (pedidoForm) {
    pedidoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idadicionado = document.getElementById('adicionado').value;
        const idadicionante = localStorage.getItem('nomeUser');

        try {
            const response_idadicionante = await fetch('http://localhost:8080/idadicionante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idadicionante })
            });
            const response_idadicionado = await fetch('http://localhost:8080/idadicionado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idadicionado })
            });
            const data_idadicionante = await response_idadicionante.json();
            const data_idadicionado = await response_idadicionado.json();
            const response_pedido = await fetch('http://localhost:8080/pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idadicionante: data_idadicionante.id, idadicionado: data_idadicionado.id })
            });
            if (!response_pedido.ok) {
                const data_pedido = await response_pedido.json();
                alert('Erro ao enviar pedido: ' + data_pedido.message || 'Erro desconhecido');
            } else {
                alert('Pedido enviado com sucesso!');
                pedidoForm.reset();
            }
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
        }
    });
}

const pedidosContainer = document.getElementById('containerpedidos');
if (pedidosContainer) {
    pedidosContainer.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'accept') {
            const myusername = localStorage.getItem('idUser');
            const userAdicionante = e.target.closest('.dummypedido').querySelector('.useradicionante').textContent;
            try {

                const idAdicionante = await fetch('http://localhost:8080/getidadicionante?username=' + userAdicionante);
                const dataid = await idAdicionante.json();
                const userAdicionanteId = dataid.id;
                const responseamizade = await fetch('http://localhost:8080/fazeramizade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        idadicionante: userAdicionanteId, 
                        idadicionado: myusername 
                    })
                });
                const response = await responseamizade.json();

                    if (!responseamizade.ok) {
                        alert('Erro ao aceitar amizade: ' + response.message || 'Erro desconhecido');
                    } else {                    alert('Amizade aceita com sucesso!');
                        e.target.closest('.dummypedido').remove();
                    }
            } catch (error) {
                console.error('Erro ao aceitar amizade:', error);
            }
        }
    });
}
