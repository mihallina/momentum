const time = document.querySelector('.time');
const dateDiv = document.querySelector('.date');
const date = new Date();
const options = {
    month: "long",
    day: "numeric",
    weekday: "long"
};
const currentDate = date.toLocaleDateString("ru-RU", options);
const greeting = document.querySelector('.greeting');
const userName = document.querySelector('.name')
const body = document.querySelector('body');
let randomNum;
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const cityInput = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const quotesDiv = document.querySelector('.quote');
const authorDiv = document.querySelector('.author');
const quotesBtn = document.querySelector('.change-quote');
let isPlay = false;
let playNum = 0;
const musicBtn = document.querySelector('.play');
const playRight = document.querySelector('.play-next');
const playLeft = document.querySelector('.play-prev');
const ulPlayList = document.querySelector('.play-list');

//TIME

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate()
    getGreeting()
    setTimeout(showTime, 1000);
}

showTime();

//DATE

function showDate() {
    const date = new Date();
    const options = {
        month: "long",
        day: "numeric",
        weekday: "long"
    };
    dateDiv.textContent = date.toLocaleDateString("en-US", options);
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    let timeOfDay = '';

    if (hours < 6) {
        timeOfDay = 'night';
    } else if (hours < 13) {
        timeOfDay = 'morning';
    } else if (hours < 19) {
        timeOfDay = 'afternoon';
    } else if (hours < 24) {
        timeOfDay = 'evening';
    }
    return timeOfDay;
}

//GREETING

function getGreeting() {
    const timeOfDay = getTimeOfDay();
    greeting.textContent = `Good ${timeOfDay}`
}


window.addEventListener('beforeunload', () => {
    localStorage.userName = userName.value;
})

window.addEventListener('load', () => {
    const nameFromLS = localStorage.getItem('userName');

    if (nameFromLS !== null) {
        userName.value = nameFromLS
    }
})

//RANDOMNUM

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//IMAGE SLIDER

randomNum = getRandomNum(1, 20);

function setBg(num) {
    const img = new Image();
    const timeOfDay = getTimeOfDay();
    const stringNum = String(num);
    let bgNum = stringNum.padStart(2, '0');
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`

    img.onload = () => {
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
    }

}

setBg(randomNum);

function getSlideNext() {
    if (randomNum == 20) {
        randomNum = 1;
    } else if (randomNum < 20) {
        randomNum++;
    }
    setBg(randomNum);
}

function getSlidePrev() {
    if (randomNum > 1) {
        randomNum = randomNum - 1;
    } else if (randomNum == 1) {
        randomNum = 20;
    }
    setBg(randomNum);
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.onclick = () => getSlidePrev();

//WEATHER

async function getWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=en&appid=60a7f09556949a566135ecb0ac14ee83&units=metric`;
        const json = await fetch(url);
        const data = await json.json();

        weatherIcon.className = "weather-icon owf";
        weatherError.textContent = '';
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';

        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
    } catch (error) {
        weatherError.textContent = `Error! city not found for '${cityInput.value}'!`;
        cityInput.select();
    }
}

cityInput.addEventListener('change', () => {
    getWeather();
})


window.addEventListener('beforeunload', () => {
    localStorage.cityName = cityInput.value;
})

function getLocalStorage() {
    const cityFromLS = localStorage.getItem('cityName');

    if (cityFromLS !== null) {
        cityInput.value = cityFromLS
        getWeather(cityInput.value);
    }
}

window.addEventListener('load', () => {
    getLocalStorage();
    // cityInput.setAttribute('value', 'Minsk');//как проверить
});

//QUOTES

async function getQuotes() {
    const quotes = "data.json";
    const res = await fetch(quotes);
    const data = await res.json();

    const ranNum = getRandomNum(0, data.length - 1);
    quotesDiv.textContent = data[ranNum].text;
    authorDiv.textContent = data[ranNum].author;
}

getQuotes()

quotesBtn.addEventListener('click', () => {
    getQuotes()
})

//AUDIO

import playList from "./playList.js";


playList.forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList[playList.indexOf(el)].title;
    ulPlayList.append(li);
})
const liArr = Array.from(document.querySelectorAll('.play-item'));


const audio = new Audio();

function playAudio(name) {
    if (!isPlay) {
        audio.src = `assets/sounds/${name}.mp3`;
        audio.currentTime = 0;
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
}

function playListAudio(name) {
    audio.src = `assets/sounds/${name}.mp3`;
    audio.currentTime = 0;
    audio.play();
}

const playNext = (num) => {
    if (num === playList.length - 1) {
        playNum = 0
    } else {
        playNum = num + 1;
    }
    playListAudio(playList[playNum].title);
}

const playPrev = (num) => {
    if(num == 0){
        playNum = playList.length - 1;
    } else {
        playNum = num - 1;
    }
    playListAudio(playList[playNum].title);
}

const playListActive = (num) => {
    liArr.forEach(el => {
        el.classList.remove('item-active');
    });
    liArr[num].classList.add('item-active')
}


playRight.addEventListener('click', () => {
    musicBtn.classList.add('pause');
    isPlay = true;
    playNext(playNum);
    playListActive(playNum);
})

playLeft.addEventListener('click', () => {
    musicBtn.classList.add('pause');
    isPlay = true;
    playPrev(playNum);
    playListActive(playNum);
})

musicBtn.addEventListener('click', () => {
    if(!isPlay){
        playAudio(playList[playNum].title);
        musicBtn.classList.remove('pause');
        playListActive(playNum);
    } else {
        playAudio(playList[playNum ].title)
        musicBtn.classList.add('pause');
    }
    musicBtn.classList.toggle('pause');
});

ulPlayList.addEventListener('click', (e) => {
    liArr.forEach((el) => {
        if (e.target == el) {
            playNum = liArr.indexOf(el);
            playPauseAudio();
        }
    })
});