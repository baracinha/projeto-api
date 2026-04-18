0
import { posts } from './calls.js';

export async function Login(e){
     e.preventDefault();
        const username = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        
        const data = await posts('/login', {
            username: username,
            password_hash: password,
        });
            if (data.token) {
                localStorage.setItem('SessionToken', data.token);
                localStorage.setItem('nomeUser', data.nome);
                localStorage.setItem('idUser', data.id);
                window.location.href = 'index.html';
            } else {
                alert('Erro: '+ data.message );
            }
}

export async function criarconta(e){
    e.preventDefault();
        const name = document.getElementById('name').value;
        const cidade = document.getElementById('cidade').value
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const tel = document.getElementById('tel').value;

        const data = await posts('/register', {
            nome: name,
            email: email,
            telefone: tel,
            password_hash: password,
            cargo: 'utilizador',
            bio: "",
            imagem_perfil: "",
            cidade: cidade,
        }); 
            if(data.id){
                console.log('conta criada com sucesso');
                window.location.href = 'index.html'
            }
            
}

export async function logout(){

    localStorage.removeItem('SessionToken');
    localStorage.removeItem('nomeUser');
    localStorage.removeItem('idUser');
        window.location.href = 'login.html';

}