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
            if (data.nomeUser) {
                localStorage.setItem('nomeUser', data.nomeUser);
                localStorage.setItem('idUser', data.idUser);
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
            telefone: Number(tel),
            password_hash: password,
            cargo: 'admin',
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

    localStorage.removeItem('nomeUser');
        window.location.href = 'login.html';

}