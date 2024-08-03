import './style.css'
import { v4 as uuidv4 } from 'uuid';
import galaStudent from '/galaStudent.webp'
import galaTrainee from '/galaTrainee.webp'
import galaJunior from '/galaJunior.webp'
import galaMiddle from '/galaMiddle.webp'
import galaSenior from '/galaSenior.webp'
import galaTeamLead from '/galaTeamLead.webp'
import galaGoogle from '/galaGoogle.webp'

const SERVER_URL = 'http://localhost:8080/api/users/'

async function updateUser(user) {
    console.log('preUpdated user:', user)
    try {
        const response = await fetch(`${SERVER_URL}${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        console.log('updated user:', data)
    } catch (error) {
        console.error('Error updating user:', error)
        return { error: 'Error updating user data' }
    }
}

async function fetchUser(userId) {
    try {
        let response = await fetch(`${SERVER_URL}${userId}`)
        if (!response.ok) {
            throw new Error(`Request error! status: ${response.status}`);
        }
        let data = await response.json()
        return data;
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}
function initializeApp() {
    const navLinks = document.querySelectorAll("nav ul li a")
    const sections = document.querySelectorAll(".section")
      
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSection = e.target.getAttribute("data-section");
  
        sections.forEach(section => {
          if (section.id === targetSection) {
            section.classList.add("active");
            } else {
            section.classList.remove("active");
          }
        });
        });
    });
    
    const images = document.querySelectorAll("img");
      images.forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault())
        img.setAttribute('draggable', 'false');
      });
    
    const $circle = document.querySelector("#circle")
    const $score = document.querySelector("#score")
    const $dailyScore = document.querySelector("#daily-score")
    const $monthlyScore = document.querySelector("#monthly-score")
    const $progressFill = document.querySelector("#progress-fill")
    const $clicksLeft = document.querySelector("#clicks-left")
    const $availableLines = document.querySelector("#available-lines")
    
    let availableLines = Number(localStorage.getItem('availableLines')) || 100
    let recoveryInterval = null
    let delayTimeout = null
    
    const LEVELS = [
        { id: 1, name: "Student", numberOfCodeLines: 0, imgUrl: galaStudent, xlevel: 1, maxLines: 100 },
        { id: 2, name: "Trainee", numberOfCodeLines: 10000, imgUrl: galaTrainee, xlevel: 1, maxLines: 100 },
        { id: 3, name: "Junior", numberOfCodeLines: 100000, imgUrl: galaJunior, xlevel: 5, maxLines: 200 },
        { id: 4, name: "Middle", numberOfCodeLines: 1000000, imgUrl: galaMiddle, xlevel: 10, maxLines: 400 },
        { id: 5, name: "Senior", numberOfCodeLines: 10000000, imgUrl: galaSenior, xlevel: 15, maxLines: 600 },
        { id: 6, name: "Team Lead", numberOfCodeLines: 100000000, imgUrl: galaTeamLead, xlevel: 25, maxLines: 800 },
        { id: 7, name: "Google", numberOfCodeLines: 1000000000, imgUrl: galaGoogle, xlevel: 50, maxLines: 999 }
    ]
    function start (score){
        checkAndResetDailyScore()
        checkAndResetMonthlyScore()
    
        setScore(getScore())
        setDailyScore(getDailyScore())
        setMonthlyScore(getMonthlyScore())
    
        updateProgressBar()
        updateImageAndLevel()
        updateClicksLeft()
    
        updateAvailableLines()
    
        if (availableLines < getCurrentLevel(getScore()).maxLines) {
            recoveryInterval = setInterval(recoverLines, 1000);
        }
        updateUserInfo(user);
    }
    
    function setScore (score){
        localStorage.setItem('score', score)
        $score.textContent = score
    }
    function setDailyScore(score) {
        localStorage.setItem('dailyScore', score)
        $dailyScore.textContent = score
    }
    
    function setMonthlyScore(score) {
        localStorage.setItem('monthlyScore', score)
        $monthlyScore.textContent = score
    }
    function getScore (){
        return Number( 
            localStorage && localStorage.getItem('score')) || 0
    }
    function getDailyScore() {
        return Number(localStorage.getItem('dailyScore')) || 0
    }
    function getMonthlyScore() {
        return Number(localStorage.getItem('monthlyScore')) || 0
    }
    function checkAndResetDailyScore() {
        const lastUpdatedDaily = localStorage.getItem('lastUpdated')
        const today = new Date().toISOString().split('T')[0];
        if (lastUpdatedDaily !== today) {
            localStorage.setItem('dailyScore', 0)
            localStorage.setItem('lastUpdated', today)
        }
    }
    function checkAndResetMonthlyScore() {
        const lastUpdatedMonthly = localStorage.getItem('lastUpdatedMonthly')
        const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7)
        if (lastUpdatedMonthly!==currentMonth) {
            localStorage.setItem('monthlyScore', 0)
            localStorage.setItem('lastUpdatedMonthly', currentMonth)
        }
    }
    function addOne (){
        if (availableLines > 0) {
        const score = getScore()
        const level = getCurrentLevel(score)
        const newScore = getScore() + level.xlevel
        const newDailyScore = getDailyScore() +level.xlevel
        const newMonthlyScore = getMonthlyScore() + level.xlevel
    
        availableLines -= 1
        localStorage.setItem('availableLines', String(availableLines));
    
        setScore(newScore)
        setDailyScore(newDailyScore)
        setMonthlyScore(newMonthlyScore)
    
        updateProgressBar()
        updateImageAndLevel()
        updateClicksLeft()
        updateAvailableLines()

        const user = {
            id: localStorage.getItem('userId'),
            first_name: localStorage.getItem('first_name'),
            last_name: localStorage.getItem('last_name'),
            username: localStorage.getItem('username'),
            score: newScore,
            dailyScore: localStorage.getItem('dailyScore'),
            monthlyScore: localStorage.getItem('monthlyScore'),
            lastUpdated: localStorage.getItem('lastUpdated'), 
            lastUpdatedMonthly:localStorage.getItem('lastUpdatedMonthly'),
            availableLines: availableLines,
        };
        updateUserInfo(user)
        updateUser(user)
    
        clearTimeout(delayTimeout)
          clearInterval(recoveryInterval)
    
          delayTimeout = setTimeout(() => {
            recoveryInterval = setInterval(recoverLines, 1000)
          }, 5000)
        } else {
            $circle.classList.add('grayscale')
            return
        }
    }
    function updateProgressBar() {
        const score = getScore()
        const nextLevel = getNextLevel(score)
        const prevLevel = getCurrentLevel(score)
        const progress = (score - prevLevel.numberOfCodeLines) / (nextLevel.numberOfCodeLines - prevLevel.numberOfCodeLines) * 100
        
        $progressFill.style.width = `${progress}%`
    }
    function updateClicksLeft() {
        const score = getScore()
        const nextLevel = getNextLevel(score)
        const level = getCurrentLevel(score)
        const clicksLeft = Math.ceil((nextLevel.numberOfCodeLines - score) / level.xlevel)
        $clicksLeft.textContent = `Lines left level ${nextLevel.name}: ${clicksLeft}`
    }
    function updateImageAndLevel() {
        const score = getScore()
        const level = getCurrentLevel(score)
        $circle.setAttribute('src', `${level.imgUrl}`)
    }
    function updateAvailableLines() {
        const score = getScore()
        const level = getCurrentLevel(score)
        $availableLines.textContent = `${availableLines} / ${level.maxLines}`
    }
    function recoverLines() {
        const score = getScore()
        const level = getCurrentLevel(score)
        if (availableLines < level.maxLines) {
            availableLines += 1
            localStorage.setItem('availableLines', availableLines);
            updateAvailableLines()
            updateUser(user)
            if (availableLines > 0) {
                $circle.classList.remove('grayscale')
              }
        } else {
            clearInterval(recoveryInterval)
        }
    }
    function getCurrentLevel(score) {
        return LEVELS.slice().reverse().find(level => score >= level.numberOfCodeLines) || LEVELS[0]
    }
    function getNextLevel(score) {
        return LEVELS.find(level => score < level.numberOfCodeLines) || LEVELS[LEVELS.length - 1]
    }
    function updateUserInfo(user) {
        const userInfoDiv = document.querySelector('.user__info');
        const score = getScore();
        const level = getCurrentLevel(score);
    
        userInfoDiv.innerHTML = `
            <p>Total Clicks: ${score}</p>
            <p>Current Level: ${level.name}</p>
            <p>First Name: ${user.first_name}</p>
            <p>Last Name: ${user.last_name}</p>
        `;
    }
    
    $circle.addEventListener('click', (event) => {
        const rect = $circle.getBoundingClientRect()
    
        const offsetX = event.clientX - rect.left - rect.width / 2
        const offsetY = event.clientY - rect.top - rect.height / 2
    
        const DEG = 40
    
        const tiltX = (offsetY / rect.height) * DEG
        const tiltY = (offsetX / rect.width) * -DEG
    
        $circle.style.setProperty('--tiltX', `${tiltX}deg`)
        $circle.style.setProperty('--tiltY', `${tiltY}deg`)
    
         setTimeout (()=> {
            $circle.style.setProperty('--tiltX', `0deg`)
            $circle.style.setProperty('--tiltY', `0deg`)
         }, 200)
    
         const plusOne = document.createElement('div')
         plusOne.classList.add('plusone')
         plusOne.textContent = `+${getCurrentLevel(getScore()).xlevel}`
         plusOne.style.left = `${event.clientX - rect.left}px`
         plusOne.style.top = `${event.clientY - rect.top}px`
         
         $circle.parentElement.appendChild(plusOne)

         addOne()
    
         setTimeout(() => {
            plusOne.remove()
         },2000)
    } ) 
    start()
}

const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe.user;
if (user) {
    fetchUser(user.id).then((data) => {
        if (data) {
            console.log('User data:', data);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('first_name', data.first_name);
            localStorage.setItem('last_name', data.last_name);
            localStorage.setItem('score', data.score);
            localStorage.setItem('dailyScore', data.dailyScore);
            localStorage.setItem('monthlyScore', data.monthlyScore);
            localStorage.setItem('lastUpdated', data.lastUpdated);
            localStorage.setItem('lastUpdatedMonthly', data.lastUpdatedMonthly);
            localStorage.setItem('availableLines', String(data.availableLines));
            initializeApp();
        } 
    });
    tg.expand();
    tg.ready();
} else {
    initializeApp({
        id: uuidv4(),
        first_name: 'Test',
        last_name: 'Testovich',
        username: 'Testolio',
        score: 0,
        dailyScore: 0,
        monthlyScore: 0,
        lastUpdated: new Date().toISOString().slice('T')[0], 
        lastUpdatedMonthly: new Date().toISOString().slice(0, 7),
        availableLines: 0
    });
}
