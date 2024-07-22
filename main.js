import './style.css'

const $circle = document.querySelector("#circle")
const $score = document.querySelector("#score")
const $dailyScore = document.querySelector("#daily-score")
const $monthlyScore = document.querySelector("#monthly-score")
const $totalScore = document.querySelector("#total-score")
const $progressFill = document.querySelector("#progress-fill")
let xlevel = 1;

const LEVELS = [10000, 100000, 1000000, 10000000, 100000000, 1000000000] 

function start (score){
    checkAndResetDailyScore()
    checkAndResetMonthlyScore()
    setScore(getScore())
    setDailyScore(getDailyScore())
    setMonthlyScore(getMonthlyScore())
    setTotalScore(getTotalScore())
    updateProgressBar()
    setImage()  
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

function setTotalScore(score) {
    localStorage.setItem('totalScore', score)
    $totalScore.textContent = score
}

function setImage() {
    const score = getScore()
    if (score >= LEVELS[5]) {
        $circle.setAttribute('src', './assets/galaGoogle.webp')
        xlevel = 50
    } else if (score >= LEVELS[4]) {
        $circle.setAttribute('src', './assets/galaTeamLead.webp')
        xlevel = 25
    } else if (score >= LEVELS[3]) {
        $circle.setAttribute('src', './assets/galaSenior.webp')
        xlevel = 15
    } else if (score >= LEVELS[2]) {
        $circle.setAttribute('src', './assets/galaMiddle.webp')
        xlevel = 10
    } else if (score >= LEVELS[1]) {
        $circle.setAttribute('src', './assets/galaJunior.webp')
        xlevel = 5
    } else if (score >= LEVELS[0]) {
        $circle.setAttribute('src', './assets/galaTrainee.webp')
        xlevel = 1
    } else {
        $circle.setAttribute('src', './assets/galaStudent.webp')
        xlevel = 1
    }
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

function getTotalScore() {
    return Number(localStorage.getItem('totalScore')) || 0
}
function checkAndResetDailyScore() {
    const lastUpdatedDaily = localStorage.getItem('lastUpdated')
    const today = new Date().toISOString().split('T')[0]

    if (lastUpdatedDaily !== today) {
        localStorage.setItem('dailyScore', 0)
        localStorage.setItem('lastUpdated', today)
    }
}
function checkAndResetMonthlyScore() {
    const lastUpdatedMonthly = localStorage.getItem('lastUpdatedMonthly')
    const currentMonth = new Date().toISOString().slice(0, 7)

    if (lastUpdatedMonthly !== currentMonth) {
        localStorage.setItem('monthlyScore', 0)
        localStorage.setItem('lastUpdatedMonthly', currentMonth)
    }
}
function addOne (){
    const newScore = getScore() + xlevel
    const newDailyScore = getDailyScore() + xlevel
    const newMonthlyScore = getMonthlyScore() + xlevel
    const newTotalScore = getTotalScore() + xlevel

    setScore(newScore)
    setDailyScore(newDailyScore)
    setMonthlyScore(newMonthlyScore)
    setTotalScore(newTotalScore)
    updateProgressBar()
    setImage()
}

function updateProgressBar() {
    const score = getScore()
    const nextLevel = LEVELS.find(level => score < level) || LEVELS[LEVELS.length - 1]
    const prevLevel = LEVELS.slice().reverse().find(level => score >= level) || 0
    const progress = (score - prevLevel) / (nextLevel - prevLevel) * 100
    
    $progressFill.style.width = `${progress}%`
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
     plusOne.textContent = `+${xlevel}`
     plusOne.style.left = `${event.clientX - rect.left}px`
     plusOne.style.top = `${event.clientY - rect.top}px`
     
     $circle.parentElement.appendChild(plusOne)

     addOne()

     setTimeout(() => {
        plusOne.remove()
     },2000)
} ) 

start()
