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

import {Login, criarconta, logout} from './auth.js';
import {mandarpedidos, listaramizades, listarpedidos, selectUser, aceitarpedidos,} from './friends.js';
import {listarmensagens, enviarMsg} from './messages.js'

function ToolBox(){
    
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