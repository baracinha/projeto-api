const jwt = require('jsonwebtoken');
const http = require('http');
const express = require('express');
const cors = require('cors');
const db = require('./conn');
const app = express();
const PORT = 8080;

const secretkey = 'secretkey';

app.use(cors());
app.use(express.json());

app.listen(PORT);

console.log(`Servidor a correr na porta ${PORT}`);

app.get('/utilizadores', (req, res) => {
    db.query('SELECT * FROM utilizador', (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Erro ao obter utilizadores' });
        } else {
            res.status(200).send(results);
        }
    });
});
app.post('/register', (req,res) =>{
    const { name, email, password, tel } = req.body;

    const query = 'INSERT INTO utilizador (username, email, password, telefone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, password,tel], (err, results) => {
        if (err) {
            console.error('Erro ao registrar utilizador:', err);
            res.status(500).json({ error:err.message});
        } else {
            res.status(201).send({ message: 'Utilizador registrado com sucesso', id: results.insertId });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Tentativa de login para o utilizador:', username);
    const query = 'SELECT * FROM utilizador WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao efetuar login' });
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ id: user.id, name: user.username }, 'secretkey', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login bem-sucedido', token, nomeUser: user.username });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    });


});
