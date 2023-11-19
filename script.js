const api = { // Definição da API 
    key: "64ed82577ced7f69cb1687f0ce536131",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

//Definição das constantes para relizar a pesquisa dentro da API
const cidade = document.querySelector('.cidade') // Define o objeto da API e realiza requisições para a API do OpenWheather
const data = document.querySelector('.data');
const container_img = document.querySelector('.container-img');
const container_temp = document.querySelector('.container-temp');
const temp_numero = document.querySelector('.container-temp div');
const temp_unidade = document.querySelector('.container-temp span');
const clima = document.querySelector('.weather');
const input_pesquisa = document.querySelector('.form-control');
const botao_pesquisa = document.querySelector('.btn');
const baixa_alta = document.querySelector('.min-max');

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(definirPosicao, mostrarErro);
    }
    else {
        alert('Navegador não suporta geolocalização');
    }
    function definirPosicao(posicao) { // Evento que executa um conjunto de operações quando a janela termina de carregar
        console.log(posicao)
        let lat = posicao.coords.latitude;
        let long = posicao.coords.longitude;
        resultadoCoordenadas(lat, long);
    }
    function mostrarErro(erro) {
        alert(`Erro: ${erro.message}`);
    }
})

function resultadoCoordenadas(lat, long) { // Faz uma requisição à API com base nas coordenadas geográficas
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            exibirResultado(response)
        });
}

botao_pesquisa.addEventListener('click', function() { 
    resultadoPesquisa(input_pesquisa.value)
})

input_pesquisa.addEventListener('keypress', enter)
function enter(evento) {
    tecla = evento.keyCode
    if (tecla === 13) {
        resultadoPesquisa(input_pesquisa.value)
    }
}

function resultadoPesquisa(cidade) { // Realiza uma requisição à API com base no nome da cidade
    fetch(`${api.base}weather?q=${cidade}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            exibirResultado(response)
        });
}

function exibirResultado(clima) {
    console.log(clima)

    cidade.innerText = `${clima.name}, ${clima.sys.country}`;

    let agora = new Date();
    data.innerText = construirData(agora);

    let nomeIcone = clima.weather[0].icon;
    container_img.innerHTML = `<img src="./icons/${nomeIcone}.png">`;

    let temperatura = `${Math.round(clima.main.temp)}`
    temp_numero.innerHTML = temperatura;
    temp_unidade.innerHTML = `°C`;

    tempo_clima = clima.weather[0].description;
    clima.innerText = capitalizarPrimeiraLetra(tempo_clima)

    baixa_alta.innerText = `${Math.round(clima.main.temp_min)}°C / ${Math.round(clima.main.temp_max)}°C`;
}

function construirData(d) {
    let dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    let dia = dias[d.getDay()]; //getDay: 0-6
    let data = d.getDate();
    let mes = meses[d.getMonth()];
    let ano = d.getFullYear();

    return `${dia}, ${data} ${mes} ${ano}`;
}

container_temp.addEventListener('click', mudarTemperatura) // Recebe uma informação data e exibi no formato desejado 
function mudarTemperatura() { // Exibe a temperatura, permitindo que o usuário altere entre celsius e fahrenheit
    temp_numero_agora = temp_numero.innerHTML

    if (temp_unidade.innerHTML === "°C") {
        let f = (temp_numero_agora * 1.8) + 32
        temp_unidade.innerHTML = "°F"
        temp_numero.innerHTML = Math.round(f)
    }
    else {
        let c = (temp_numero_agora - 32) / 1.8
        temp_unidade.innerHTML = "°C"
        temp_numero.innerHTML = Math.round(c)
    }
}

function capitalizarPrimeiraLetra(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1);
}
