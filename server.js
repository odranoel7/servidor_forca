const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./banco.js');

const exps = express();

exps.use(bodyParser.urlencoded({ extended: true }));
exps.use(bodyParser.json());

exps.get('/api', (req, res) => {
    
    var escolheTipo = Math.floor(Math.random() * 2);
    var tipo = '';
    if (escolheTipo === 0) {
        tipo = 'OBJETO';
    } else if (escolheTipo === 1) {
        tipo = 'TECNOLOGIA';
    }
    knex.select('*').from('palavras').where('tipo', tipo).then(palavras => {
        const todaspalavras = Array();
        for (var i = 0; i < 3; i++) {
            var aux = Math.floor(Math.random() * palavras.length);
            todaspalavras.push(palavras[aux]);
        }
        res.status(200).json(todaspalavras);
    });
});

exps.use(function (res) {
    res.status(500).send('Erro')
});

exps.listen(8080, () => {
    console.log('Está rodando na porta -> 8080');
});