const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPausarTexto = document.querySelector('#start-pause span');
const imagemIniciarOuPausarTexto = document.querySelector('.app__card-primary-button-icon');
const tempoNaTela = document.querySelector('#timer');

const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');

const audioplay = new Audio('./sons/play.wav');
const audiopause = new Audio('./sons/pause.mp3');
const audiobeep = new Audio('./sons/beep.mp3');

let intervaloId = null;
let tempoDecorridoEmSegundos = 5;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused){
        musica.play();
    }else{
        musica.pause();
    }
})

focoBt.addEventListener('click',  () => {
    alterarContexto('foco')
    focoBt.classList.add('active');
    })

curtoBt.addEventListener('click', ()=> {
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click',() =>{
    alterarContexto('descanso-longo')
    longoBt.classList.add('active');
})

function alterarContexto(contexto){
    if(intervaloId){
        iniciarOuPausar();
    }
    botoes.forEach(function(botao){
      botao.classList.remove('active');  
    });
    
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch(contexto){
        case 'foco':
            tempoDecorridoEmSegundos = 5;
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>        
            `;
            break;
        case 'descanso-curto':
            tempoDecorridoEmSegundos = 3;
            titulo.innerHTML = `
                Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>   
            `;
            break;
            
        case 'descanso-longo':
            tempoDecorridoEmSegundos = 10;
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `;
            break;
        default:
            break;
    }
    mostrarTempo();
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0){
        audiobeep.play();
        alert('Tempo finalizado');
        const focoAtivo = html.getAttribute('data-contexto') === 'foco'
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar(){
    if(tarefaSelecionada){
        if(intervaloId){
            zerar();
            audiopause.play();
            return;
        }
        intervaloId = setInterval(contagemRegressiva, 1000);
        audioplay.play();
        imagemIniciarOuPausarTexto.setAttribute('src', `./imagens/pause.png`);
        iniciarOuPausarTexto.textContent = "Pausar";
    }else{
        alert("Selecione uma tarefa!");
    }
}

function zerar(){
    clearInterval(intervaloId);
    iniciarOuPausarTexto.textContent = "Começar";
    intervaloId = null;
    imagemIniciarOuPausarTexto.setAttribute('src', `./imagens/play_arrow.png`);
    switch(contexto){
        case 'foco':
            tempoDecorridoEmSegundos = 5;
            break;
        case 'descanso-curto':
            tempoDecorridoEmSegundos = 3;
            break;
                
        case 'descanso-longo':
            tempoDecorridoEmSegundos = 10;
            break;
        default:
            break;
        }
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br',{minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo();
