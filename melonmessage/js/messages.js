import {gets, posts} from './calls.js';

export async function listarmensagens(conversado){
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

export async function enviarMsg(e){
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