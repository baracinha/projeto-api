import {posts, gets} from './calls.js';
import { listarmensagens } from './messages.js';

export async function mandarpedidos(e){
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
export async function listaramizades(){
    const myid = localStorage.getItem('idUser');
    try {
        if(!myid) return;
        const data = await gets('/ListUsers?id=' + myid);
        console.log(data);
        if(data.length == 0){
            console.log('sem conversas');
        } else {
            const listaPedidosDiv = document.getElementById('containeramigos');
            const modelo = document.getElementById('amigos')

            if (!listaPedidosDiv || !modelo) return;

            data.forEach(pedido =>{
                const newdiv = modelo.cloneNode(true);
                newdiv.removeAttribute('id');
                newdiv.className = 'dummyamigo';
                newdiv.querySelector('.useradicionante').textContent = pedido.nome;
                listaPedidosDiv.appendChild(newdiv);
            });
        }
    } catch(error){
        console.log('sexo')
        console.error(error.message)
    }
}
export async function aceitarpedidos(e){
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
export async function selectUser(e){
    e.preventDefault();
    if(e.target && e.target.id === 'conversar'){
        const enviante = document.getElementById('usernameconversa');
        enviante.textContent = e.target.closest('.dummyamigo').querySelector('.useradicionante').textContent;
        const userconversa = document.getElementById('usernameconversa').textContent
        /*codigo para listar mensagens*/
        const data = await gets('/BasicList?nome=' + userconversa)
        if(data.length == 0){
            console.log('user não encontrado ou não selecionado')
        }else{
            const enviantemensagens = data.id;
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

export async function listarpedidos(){
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