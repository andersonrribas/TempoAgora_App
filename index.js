const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const input = document.querySelector('.search-box input');
const snackbar = document.getElementById('snackbar');

const APIKey = 'SUA API KEY';
const LANG = 'pt_br';

// Função para mostrar a Snackbar
function showSnackbar(message) {
    snackbar.textContent = message;
    snackbar.className = 'show'; // Adiciona a classe para mostrar
    setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', ''); // Remove a classe após 3 segundos
    }, 4000);
}

// Função para buscar as informações do tempo
function getWeather() {
    const city = input.value;

    if (city === '') {
        showSnackbar('Por favor, insira uma localização.'); // Mensagem de erro
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}&lang=${LANG}`)
        .then(response => {
            if (!response.ok) { // Verifica se a resposta não é ok
                throw new Error('Erro na requisição.'); // Lança um erro
            }
            return response.json();
        })
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        })
        .catch(error => {
            showSnackbar('Erro: ' + error.message); // Exibe a mensagem de erro
        });
}

// Ouvinte para o clique no botão de pesquisa
search.addEventListener('click', () => {
    getWeather();
});

// Ouvinte para pressionar a tecla "Enter" no campo de entrada
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeather(); // Chama a função que busca o clima
    }
});
