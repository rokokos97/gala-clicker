import './style.css'

const $circle = document.querySelector("#circle")
const $score = document.querySelector("#score")
const $dailyScore = document.querySelector("#daily-score")
const $monthlyScore = document.querySelector("#monthly-score")
const $totalScore = document.querySelector("#total-score")

function start (score){
    checkAndResetDailyScore()
    checkAndResetMonthlyScore()
    setScore(getScore())
    setDailyScore(getDailyScore())
    setMonthlyScore(getMonthlyScore())
    setTotalScore(getTotalScore())
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


function setImage (){
    if ( getScore() > 1000 ) {
        $circle.setAttribute('src', './assets/galaMiddle.png')
    }  
    if (getScore() > 10000 ) {
        $circle.setAttribute('src', './assets/galaSenior.png' )
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
    const lastUpdated = localStorage.getItem('lastUpdated')
    const today = new Date().toISOString().split('T')[0]

    if (lastUpdated !== today) {
        localStorage.setItem('dailyScore', 0)
        localStorage.setItem('lastUpdated', today)
    }
}
function checkAndResetMonthlyScore() {
    const lastUpdated = localStorage.getItem('lastUpdatedMonthly')
    const currentMonth = new Date().toISOString().slice(0, 7)

    if (lastUpdated !== currentMonth) {
        localStorage.setItem('monthlyScore', 0)
        localStorage.setItem('lastUpdatedMonthly', currentMonth)
    }
}
function addOne (){
     setScore(getScore()+1)
     setDailyScore(getDailyScore()+1)
     setMonthlyScore(getMonthlyScore()+1)
     setTotalScore(getTotalScore()+1)
     setImage()
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
     plusOne.textContent = '+1'
     plusOne.style.left = `${event.clientX - rect.left}px`
     plusOne.style.top = `${event.clientY - rect.top}px`
     
     $circle.parentElement.appendChild(plusOne)

     addOne()

     setTimeout(() => {
        plusOne.remove()
     },2000)
} ) 

start()
