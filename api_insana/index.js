const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.listen(PORT);

app.get('/utilizadores', (req, res) =>{
    res.status(200).send({
        utilizadores: [
            {
                user: 'baracinha',
                tlf: '9999999'
            },
            {
                user: 'jose',
                tlf : '999999'
            },
        ]
    })
});

app.post('/utilizadores/:id', (req,res) =>{

    const { id } = req.params;
    const { user } = req.body;
    const { tlf } = req.body;

    /*if (!user){
        res.status(418).send({ message: 'é necessário um username'})
    }*/

    res.send({
        utilizador: `username: ${user} id: ${id} telefone: ${tlf}`,
    });
});