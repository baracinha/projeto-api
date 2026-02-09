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
            res.status(200).json({ message: 'Login bem-sucedido', token, nomeUser: user.username, idUser: user.id });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas' });
        }
    });


});

app.get('/lista', (req, res) => {
    db.query('SELECT * FROM utilizador', (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Erro ao obter utilizadores' });
        } else {
            const users = results.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                telefone: user.telefone
        }));
        res.status(200).send(users);
    }
    });
});

app.post('/pedido', (req, res) => {
    const { idadicionante, idadicionado } = req.body;

    const querycheck = `SELECT * FROM pedidos WHERE 
                        (adicionante = (SELECT id FROM utilizador WHERE username = ?))
                        AND adicionado = (SELECT id FROM utilizador WHERE username = ?)
                        OR (adicionante = (SELECT id FROM utilizador WHERE username = ?) 
                        AND adicionado = (SELECT id FROM utilizador WHERE username = ?))`; 
                        
    db.query(querycheck, [idadicionante, idadicionado, idadicionado, idadicionante], (err,results)=>{
        if(err){
            return res.status(500).json({message: "erro no server"})
        } else if (results.length > 0){
            return res.status(400).json({message: "ja existe um pedido ou amizade feita com quem mandaste"});
        }
        const query = `INSERT INTO pedidos (adicionante ,adicionado, status)
                    VALUES(
                            (SELECT id FROM utilizador WHERE username = ?),
                            (SELECT id FROM utilizador WHERE username = ?),
                            'pendente'
                    )`;
    db.query(query, [idadicionante, idadicionado], (err, results)=>{
        if(err){
            console.error('my people ta a dar erro a enviar o pedido', err);
            return res.status(500).json({message :" erro a gravar o pedido"})
        }else{
            res.status(200).json({message :`sucesso${idadicionado}`});
        }
        });

    });

});


app.get('/listapedidos', (req, res) => {
    const meuidpedido = req.query.adicionado;
    const sql = `SELECT u.username 
    FROM pedidos p
    JOIN utilizador u ON p.adicionante = u.id
    JOIN utilizador u2 ON p.adicionado = u2.id
    WHERE u2.username = ? AND p.status = 'pendente'`;
        db.query(sql, [meuidpedido], (err, results) => {
            if (err) {
                console.error('Erro no mysql:', err.sqlMessage || err.message);
                return res.status(500).json({ error : err.message});
            }        
            res.status(200).json(results);
        });
});

app.post('/fazeramizade', (req, res) => {
    const idadicionado = req.body.adicionado;
    const idadicionante = req.body.adicionante;
    const query = `UPDATE pedidos SET status = ? WHERE 
                    (adicionante = (SELECT id FROM utilizador WHERE username = ?)) 
                    AND adicionado = ?`;
    db.query(query, ['aceite', idadicionante, idadicionado], (err, results) => {
        if (err) {
            console.error('Erro no mysql:', err.sqlMessage || err.message);
            res.status(500).json({ message: 'Erro a atualizar o status' });
        } else{
            console.log('Pedido de ' + idadicionante + ' atualizado para aceito');
            const dataAdicionado = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.query(`INSERT INTO amizades (user1, user2, dataadicionado) VALUES(
                            (SELECT id FROM utilizador WHERE username = ?),
                            ?, 
                            ?)`
                            , [idadicionante, idadicionado, dataAdicionado], (err, results) => {
                if (err) {
                    console.error('Erro no mysql:', err.sqlMessage || err.message);
                    res.status(500).json({ message: 'Erro a criar amizade' });
                } else {
                    res.status(200).json({ message: 'Amizade criada com sucesso' });
                }
            });
        }
    });
});





