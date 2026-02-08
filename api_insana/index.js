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
    const queryCheck = 'SELECT * FROM pedidos WHERE adicionante = ? AND adicionado = ?';
    db.query(queryCheck, [idadicionante, idadicionado], (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: 'Ja enviaste um pedido para este utilizador' });
        }else{
            const query = 'INSERT INTO pedidos (adicionante, adicionado,status) VALUES (?, ?, ?)';
            db.query(query, [idadicionante, idadicionado, 'pendente'], (err, results) => {
            if (err) {
            console.error('Erro no mysql:', err.sqlMessage || err.message);
            res.status(500).json({ message: 'Erro ao enviar pedido' });
        } else {
            res.status(201).send({ message: 'Pedido enviado com sucesso' });
        }
    });
}
    });

});

app.post('/idadicionante', (req, res) => {
    const { idadicionante } = req.body;
    db.query('SELECT id FROM utilizador WHERE username = ?', [idadicionante], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Erro ao obter ID do adicionante' });
        } else {
            if (results.length > 0) {
                res.status(200).send({ id: results[0].id });
            } else {
                res.status(404).send({ message: 'Utilizador não encontrado' });
            }
        }
    });

});

app.post('/idadicionado', (req, res) => {
    const { idadicionado } = req.body;
    db.query('SELECT id FROM utilizador WHERE username = ?', [idadicionado], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Erro ao obter ID do adicionado' });
        } else {
            if (results.length > 0) {
                res.status(200).send({ id: results[0].id });
            } else {
                res.status(404).send({ message: 'Utilizador não encontrado' });
            }
        }
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
    const idadicionado = req.body.idadicionado;
    const idadicionante = req.body.idadicionante;
    const query = 'UPDATE pedidos SET status = ? WHERE adicionante = ? AND adicionado = ?';
    db.query(query, ['aceite', idadicionante, idadicionado], (err, results) => {
        if (err) {
            console.error('Erro no mysql:', err.sqlMessage || err.message);
            res.status(500).json({ message: 'Erro a atualizar o status' });
        } else{
            console.log('Pedido de ' + idadicionante + ' atualizado para aceito');
            const dataAdicionado = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.query('INSERT INTO amizades (user1, user2, dataadicionado) VALUES (?, ?, ?)', [idadicionante, idadicionado, dataAdicionado], (err, results) => {
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

app.get('/getidadicionante', (req, res) => {
    const idadicionante = req.query.username;
    db.query('SELECT id FROM utilizador WHERE username = ?', [idadicionante], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Erro ao obter ID do adicionante' });
        } else {
            if (results.length > 0) {
                res.status(200).json({ id: results[0].id });
            } else {
                res.status(404).json({ message: 'Utilizador não encontrado' });
            }
        }
    });

});



