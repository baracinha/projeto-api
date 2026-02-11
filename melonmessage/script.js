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

async function gets(endpoint) {
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

async function mandarpedidos(e){
        e.preventDefault();
        const form = e.target
        try {
            const nomeadicionado = document.getElementById('adicionado').value;
            const nomeadicionante = localStorage.getItem('nomeUser');
            if (!nomeadicionado || nomeadicionado == nomeadicionante){
                alert("nome invalido");
                return;
            }
            const data = await posts('/pedido',{idadicionado: nomeadicionado, idadicionante: nomeadicionante}) 
                if(data.message && data.message.includes('sucesso')){
                    console.log('pedido enviado com sucesso');
                    alert("pedido enviado para"+ nomeadicionado);
                    form.reset();
                }else {
                    alert("erro a enviar pedido" + data.message)
                    form.reset();
                }
        } catch (error) {
            console.error('bisa', error.message);
        }
}

async function listaramizades(){
    const adicionado = localStorage.getItem('nomeUser');
    try {
        if(!adicionado) return;
        const data = await gets('/listaamigos?adicionado=' + adicionado);
        if(data.length == 0){
            console.log('sem pedidos');
        } else {
            const listaPedidosDiv = document.getElementById('containeramigos');
            const modelo = document.getElementById('amigos')
            data.forEach(pedido =>{
                const newdiv = modelo.cloneNode(true);
                newdiv.removeAttribute('id');
                newdiv.className = 'dummyamigo';
                newdiv.querySelector('.useradicionante').textContent = pedido.username;
                listaPedidosDiv.appendChild(newdiv);
            });
        }
    } catch(error){
        console.log('sexo')
        console.error(error.message)
    }
}

async function aceitarpedidos(e){
    e.preventDefault();
    if (e.target && e.target.id === 'accept') {
            const myusername = localStorage.getItem('idUser');
            const userAdicionante = e.target.closest('.dummypedido').querySelector('.useradicionante').textContent;
            try {
                    const data = await posts('/fazeramizade', {adicionante :userAdicionante ,adicionado: myusername});
                    alert(`amizade de ${userAdicionante} aceite`);
                    location.reload();
            } catch (error) {
                console.error('Erro ao aceitar amizade:', error);
            }
        }
}

async function ToolBox(){
    
    listaramizades();
    
    console.log('teste');
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

    const listaPedidosDiv = document.getElementById('containerpedidos');
    if(listaPedidosDiv) {
            listarpedidos()
        }

    const pedidoForm = document.getElementById('frm_pedidos');
    if (pedidoForm) {
        pedidoForm.addEventListener('submit', mandarpedidos)
    }

    const pedidosContainer = document.getElementById('containerpedidos');
    if (pedidosContainer) {
        pedidosContainer.addEventListener('click', aceitarpedidos);
    }
}



window.onload = ToolBox();