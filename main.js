import './style.css'

const $circle = document.querySelector("#circle")
const $score = document.querySelector("#score")
const $dailyScore = document.querySelector("#daily-score")
const $monthlyScore = document.querySelector("#monthly-score")
const $totalScore = document.querySelector("#total-score")
const $progressFill = document.querySelector("#progress-fill")
const $clicksLeft = document.querySelector("#clicks-left")
const $availableLines = document.querySelector("#available-lines")

let availableLines = 100
let recoveryInterval = null

const LEVELS = [
    { id: 1, name: "Student", numberOfCodeLines: 0, imgUrl: './assets/galaStudent.webp', xlevel: 1, maxLines: 100 },
    { id: 2, name: "Trainee", numberOfCodeLines: 10000, imgUrl: './assets/galaTrainee.webp', xlevel: 1, maxLines: 100 },
    { id: 3, name: "Junior", numberOfCodeLines: 100000, imgUrl: './assets/galaJunior.webp', xlevel: 5, maxLines: 200 },
    { id: 4, name: "Middle", numberOfCodeLines: 1000000, imgUrl: './assets/galaMiddle.webp', xlevel: 10, maxLines: 400 },
    { id: 5, name: "Senior", numberOfCodeLines: 10000000, imgUrl: './assets/galaSenior.webp', xlevel: 15, maxLines: 600 },
    { id: 6, name: "Team Lead", numberOfCodeLines: 100000000, imgUrl: './assets/galaTeamLead.webp', xlevel: 25, maxLines: 800 },
    { id: 7, name: "Google", numberOfCodeLines: 1000000000, imgUrl: './assets/galaGoogle.webp', xlevel: 50, maxLines: 999 }
]

function start (score){
    checkAndResetDailyScore()
    checkAndResetMonthlyScore()

    setScore(getScore())
    setDailyScore(getDailyScore())
    setMonthlyScore(getMonthlyScore())
    setTotalScore(getTotalScore())

    updateProgressBar()
    updateImageAndLevel()
    updateClicksLeft()

    updateAvailableLines()
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
    if (availableLines > 0) {
    const score = getScore()
    const level = getCurrentLevel(score)
    const newScore = getScore() + level.xlevel
    const newDailyScore = getDailyScore() +level.xlevel
    const newMonthlyScore = getMonthlyScore() + level.xlevel
    const newTotalScore = getTotalScore() + level.xlevel

    availableLines -= 1

    setScore(newScore)
    setDailyScore(newDailyScore)
    setMonthlyScore(newMonthlyScore)
    setTotalScore(newTotalScore)

    updateProgressBar()
    updateImageAndLevel()
    updateClicksLeft()
    updateAvailableLines()

    clearInterval(recoveryInterval)
    recoveryInterval = setInterval(recoverLines, 1000)
    } else {
        alert('No more lines available')
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
    $circle.setAttribute('src', level.imgUrl)
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
        updateAvailableLines()
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
