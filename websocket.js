const knex = require('./banco.js');

const WebSocket = require('ws');
const todosjogadores = Array();
var todaspalavras = Array();
var dica = '';
var jogadorVez = 0;
const wss = new WebSocket.Server({
    port: 8080
});
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

wss.on('connection', async function conectar(ws, requisicao) {
    ws.on('message', dado => {
        var aux = JSON.parse(dado);
        if (aux.selecao == 'tracos_palavras_erradas'){
            enviar.pontoAcumulado[aux.idjog] = aux.pontosAc;
            enviar.palavrasPreenhidas = aux.palavras;
            enviar.letraserradas = aux.letraserradas;
        } else if(aux.selecao == 'palavras_acerto'){
            if (aux.numeroPalavra == 1){
                enviar.palavraumcorreta  = true;
                enviar.palavrasCorretaUm = aux.palavra.toUpperCase();
            } else if (aux.numeroPalavra == 2){
                enviar.palavradoiscorreta = true;
                enviar.palavrasCorretaDois = aux.palavra.toUpperCase();
            } else if (aux.numeroPalavra == 3){
                enviar.palavratrescorreta = true;
                enviar.palavrasCorretaTres = aux.palavra.toUpperCase();
            }
            //console.log(aux);
        }
        console.log(aux.idjog);
        enviar.jogadorvez = setJogadorVez();
        enviar.valor = sorteiaPontuacao();
        enviarMensagem(enviar);
        
    });

    var idjog = addJogador(requisicao);
    var pontoRodada = sorteiaPontuacao();
    if (todaspalavras.length == 0){
        await getPalavras();
    }
    
    enviar.valor                = pontoRodada;
    enviar.idjog                = idjog;
    enviar.jogadorvez           = jogadorVez;
    enviar.palavras             = todaspalavras;
    enviar.dica                 = dica;
    
    
    
    ws.send(JSON.stringify(enviar));
});

function enviarMensagem(mensagem){
    wss.clients.forEach(client => {
        client.send(JSON.stringify(mensagem));
    });
}

async function getPalavras(){
    var escolheTipo = Math.floor(Math.random() * 2);
    
    if (escolheTipo === 0) {
        dica = 'OBJETO';
    } else if (escolheTipo === 1) {
        dica = 'TECNOLOGIA';
    }
    await knex.select('*').from('palavras').where('tipo', dica).then(palavras => {
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
    if(todosjogadores.length != 0) {
        for(var i = 0; i < todosjogadores.length; i++){
            if(todosjogadores[i].endereco !== requisicao.socket.remoteAddress) {
                enviar.pontoAcumulado.push(0);
                todosjogadores.push({
                    id: todosjogadores.length++,
                    endereco: requisicao.socket.remoteAddress,
                    todospontos: 0
                });
            }
        }
        return todosjogadores.length-1;
    }else {
        enviar.pontoAcumulado.push(0);
        todosjogadores.push({
            id: 0,
            endereco: requisicao.socket.remoteAddress,
            todospontos: 0
        });
        return 0;
    }
}