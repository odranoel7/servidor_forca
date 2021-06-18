const amqp = require('amqplib/callback_api');
const knex = require('./banco.js');
const config = require('config');
const mqConfig = config.get('mq');

const gameStatus = {
    AGUARDANDO_INICIO: 'Aguardando Início',
    INICIADO: 'Iniciado'
}

let channel = null;

const todosjogadores = Array();
var todaspalavras = Array();
var dica = '';
var id = -99;
var jogadorVez = 0;
var enviar = {
    valor              : '',
    idjog              : '',
    pontoAcumulado     : Array(),
    jogadorvez         : '',
    palavras           : Array(),
    dica               : '',
    palavrasPreenhidas : Array(),
    letraserradas      : '',
    palavrasCorretaUm  : '',
    palavrasCorretaDois: '',
    palavrasCorretaTres: '',
    palavraumcorreta   : false,
    palavradoiscorreta : false,
    palavratrescorreta : false,
};

amqp.connect(mqConfig, async function (error, connection) {
    if (todaspalavras.length == 0){
        var escolheTipo = Math.floor(Math.random() * 2);
        if (escolheTipo === 0) {
            dica = 'OBJETO';
        } else if (escolheTipo === 1) {
            dica = 'TECNOLOGIA';
        }
        knex.select('*').from('palavras').where('tipo', dica).then(palavras => {
            for (var i = 0; i < 3; i++) {
                var aux = Math.floor(Math.random() * palavras.length);
                todaspalavras.push(palavras[aux]);
            }
        });
    }

    if(error) {
        console.error('error', error);
    }

    connection.createChannel(async (error, ch) => {
        if(error) {
            console.error('error', error);
        }

        channel = ch;

        channel.assertExchange(mqConfig.toPlayers.exchange, 'fanout', { durable: true });
        channel.assertQueue(mqConfig.fromPlayers.queue, { durable: true });

        channel.consume(mqConfig.fromPlayers.queue, async (msg) => {
            //console.log(msg.content.toString());

            //var idjog = addJogador(JSON.parse(msg.content.toString()));
            var pontoRodada = sorteiaPontuacao();
            enviar.valor                = pontoRodada;
            //enviar.idjog                = idjog;
            enviar.jogadorvez           = jogadorVez;
            enviar.palavras             = todaspalavras;
            enviar.dica                 = dica;
            console.log(todaspalavras);
            enviaMensagem(JSON.stringify(enviar));
        });
        
        
    });
});

/* exports.publishMessage = async function(data) {
    channel.publish(mqConfig.toPlayers.exchange, '', Buffer.from(data), {
        persistent: true
    });
} */

function enviaMensagem(msg) {
    channel.publish(mqConfig.toPlayers.exchange, '', Buffer.from(JSON.stringify(msg)));
}

async function getPalavras(){
    var escolheTipo = Math.floor(Math.random() * 2);
    
    if (escolheTipo === 0) {
        dica = 'OBJETO';
    } else if (escolheTipo === 1) {
        dica = 'TECNOLOGIA';
    }
    knex.select('*').from('palavras').where('tipo', dica).then(palavras => {
        for (var i = 0; i < 3; i++) {
            var aux = Math.floor(Math.random() * palavras.length);
            todaspalavras.push(palavras[aux]);
        }
    });
}

function setJogadorVez(){
    if (jogadorVez == (todosjogadores.length-1)){
        jogadorVez = 0;
    } else {
        jogadorVez++;
    }
    return jogadorVez;
}

function sorteiaPontuacao(){
    var aux = 0;
    while (aux == 0){
        aux = Math.floor(Math.random() * 11);
    }
    return aux;
}

function addJogador(requisicao){
    var auxi = requisicao.data.uid;
    console.log('length '+auxi);
    if(todosjogadores.length != 0) {
        for(var i = 0; i < todosjogadores.length; i++){
            if(todosjogadores[i].endereco !== auxi) {
                enviar.pontoAcumulado.push(0);
                todosjogadores.push({
                    id: todosjogadores.length++,
                    endereco: auxi,
                    todospontos: 0
                });
            }
        }
        return todosjogadores.length-1;
    }else {
        enviar.pontoAcumulado.push(0);
        todosjogadores.push({
            id: 0,
            endereco: auxi,
            todospontos: 0
        });
        return 0;
    }
}