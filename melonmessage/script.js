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
    const model = document.getElementById('pedidos');

    if (!listaPedidosDiv || !model) return;

    if(listaPedidosDiv && data.length > 0){
            data.forEach(pedido =>{
                const newdiv = model.cloneNode(true);
                newdiv.removeAttribute('id');
                newdiv.style.display = 'flex'
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
            console.log('sem amizades');
        } else {
            const listaPedidosDiv = document.getElementById('containeramigos');
            const modelo = document.getElementById('amigos')

            if (!listaPedidosDiv || !modelo) return;

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

async function listarmensagens(conversado){
    const meuuser = localStorage.getItem('idUser');
    
    const campomensagens = document.getElementById('campomensagens');
    
    try{
        if(!meuuser) return;
        const data = await gets(`/listarmensagens?enviante=${conversado}&user=${meuuser}`);
        campomensagens.replaceChildren();
        if (!data || data.length === 0) {
            console.log('Não há mensagens entre estes utilizadores.');
        } else {
            for(const mensagem of data){
                let modelo;
                if(mensagem.receptor == meuuser){
                    modelo = document.getElementById('mensagemrecebida')
                } else {
                    modelo = document.getElementById('mensagemenviada'); 
                }

                if (modelo) {
                    const newmsg = modelo.cloneNode(true);
                    newmsg.removeAttribute('id');
                    newmsg.style.display = 'flex';

                    const textoElemento =
                        newmsg.querySelector('.txtrecebido') ||
                        newmsg.querySelector('.txtenviado');

                    if (textoElemento) {
                        textoElemento.textContent = mensagem.mensagem;
                    }

                    campomensagens.appendChild(newmsg);
                }
            campomensagens.scrollTop = campomensagens.scrollHeight;
            }
            
        }
    } catch(error){
        console.log('erro a listar as mensagens')
        console.error(error.message)
    }
}

async function aceitarpedidos(e){
    e.preventDefault();
    if (e.target && e.target.classList.contains('accept-btn')) {
            const myusername = localStorage.getItem('idUser');
            const container = e.target.closest('.dummypedido');
            const containeruser = container.querySelector('.useradicionante');
            const userAdicionante = containeruser.textContent;
            try {
                    const data = await posts('/fazeramizade', {adicionante :userAdicionante ,adicionado: myusername});
                    alert(`amizade de ${userAdicionante} aceite`);
                    location.reload();
            } catch (error) {
                console.error('Erro ao aceitar amizade:', error);
            }
        }
}

async function selectUser(e){
    e.preventDefault();
    if(e.target && e.target.id === 'conversar'){
        const enviante = document.getElementById('usernameconversa');
        enviante.textContent = e.target.closest('.dummyamigo').querySelector('.useradicionante').textContent;
        const userconversa = document.getElementById('usernameconversa').textContent
        /*codigo para listar mensagens*/
        const data = await gets('/lista?user=' + userconversa)
        if(data.length == 0){
            console.log('user não encontrado ou não selecionado')
        }else{
            const enviantemensagens = data[0].id;
            console.log("ID do utilizador encontrado:", enviantemensagens);
            await listarmensagens(enviantemensagens);
            document.querySelectorAll('.buttonconversar').forEach(btn => {
            btn.style.display = 'block';
        });
            const botaoParaEsconder = e.target.closest('.dummyamigo').querySelector('.buttonconversar');
            botaoParaEsconder.style.display = 'none';
        }
    }
}

async function enviarMsg(e){
    e.preventDefault();
    const form = e.target;
    
    try {
        const mensagem = document.getElementById('mensagemcampo').value;
        const enviante = localStorage.getItem('idUser');
        const receptorNome = document.getElementById('usernameconversa').textContent;

        if (receptorNome === 'nome aqui' || !mensagem.trim()) {
            console.error('Nenhum utilizador selecionado ou mensagem vazia');
            return; 
        }

        const responseEnvio = await posts('/inserirmensagens', {
            mensagem: mensagem, 
            enviante: enviante, 
            receptor: receptorNome
        });

        if (responseEnvio.message && responseEnvio.message.includes('erro')) {
            console.error('Erro ao enviar:', responseEnvio.message);
            form.reset();
        } else {
            form.reset();
            const userData = await gets('/lista?user=' + receptorNome);

            if (userData && userData.length > 0) {
                const receptorid = userData[0].id;
                console.log('A chamar listarmensagens para ID:', receptorid);
                
                await listarmensagens(receptorid);
            }
        } 
    } catch (error) {
        console.error('Erro na função enviarMsg:', error);
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
            listarpedidos();
        }

    const pedidoForm = document.getElementById('frm_pedidos');
    if (pedidoForm) {
        pedidoForm.addEventListener('submit', mandarpedidos);
    }

    const pedidosContainer = document.getElementById('containerpedidos');
    if (pedidosContainer) {
        pedidosContainer.addEventListener('click', aceitarpedidos);
    }

    const userlist = document.getElementById('containeramigos');
    if(userlist) {
        userlist.addEventListener('click', selectUser);
    }

    const enviarmsg = document.getElementById('frm_mensagem')
    if(enviarmsg){
        enviarmsg.addEventListener('submit', enviarMsg);
    }
}



window.onload = ToolBox;