import './style.css'
    
const SERVER_USERS_URL = 'https://lisovyi.eu/api/users/'
const SERVER_LEVELS_URL = 'https://lisovyi.eu/api/levels/'
async function updateUser(updatedUser) {
    console.log('Updated USER', updatedUser)
    console.log('Updated USER ID', updatedUser.external_id_telegram)
    try {
        const response = await fetch(`${SERVER_USERS_URL}${updatedUser.external_id_telegram}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.error('Error updating user:', error)
        return { error: 'Error updating user data' }
    }
}
async function fetchUser(userId) {
    try {
        let response = await fetch(`${SERVER_USERS_URL}${userId}`)
        if (!response.ok) {
            throw new Error(`Request error! status: ${response.status}`);
        }
        let data = await response.json()
        return data;
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}
async function fetchAllUsers() {
    try {
        let response = await fetch(`${SERVER_USERS_URL}`)
        if (!response.ok) {
            throw new Error(`Request error! status: ${response.status}`);
        }
        let data = await response.json()
        return data;
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}
async function fetchLevels() {
    try {
        let response = await fetch(`${SERVER_LEVELS_URL}`)
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
    const $loading=document.querySelector("#loading-screen")
    const $navigation = document.querySelector("#navigation")
    
    let availableLines = Number(localStorage.getItem('availableLines')) || 100
    let recoveryInterval = null
    let delayTimeout = null
    
    // const LEVELS = fetchLevelsSheet();

    const LEVELS = [
        { id: 1, name: "Student", numberOfCodeLines: 0, imgUrl: './galaStudent.webp', xlevel: 1, maxLines: 100 },
        { id: 2, name: "Trainee", numberOfCodeLines: 3000, imgUrl: './galaTrainee.webp', xlevel: 1, maxLines: 200 },
        { id: 3, name: "Junior", numberOfCodeLines: 100000, imgUrl: './galaJunior.webp', xlevel: 5, maxLines: 200 },
        { id: 4, name: "Middle", numberOfCodeLines: 1000000, imgUrl: './galaMiddle.webp', xlevel: 10, maxLines: 400 },
        { id: 5, name: "Senior", numberOfCodeLines: 10000000, imgUrl: './galaSenior.webp', xlevel: 15, maxLines: 600 },
        { id: 6, name: "Team Lead", numberOfCodeLines: 100000000, imgUrl: './galaTeamLead.webp', xlevel: 25, maxLines: 800 },
        { id: 7, name: "Google", numberOfCodeLines: 1000000000, imgUrl: './galaGoogle.webp', xlevel: 50, maxLines: 999 }
    ]
    function start (){
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
        updateUserInfo();
        fetchLevels();
        fetchAllUsers().then(users => displayLeaderboard(users));

        $loading.style.display = 'none';
        document.getElementById('game').classList.add("active");
        $navigation.style.display = 'block';
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

        const userBeforeUpdate = {
            external_id_telegram: localStorage.getItem('external_id_telegram'),
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
        updateUserInfo()
        console.log('userBeforeUpdate', userBeforeUpdate);
        updateUser(userBeforeUpdate)
    
        clearTimeout(delayTimeout)
          clearInterval(recoveryInterval)
    
          delayTimeout = setTimeout(() => {
            recoveryInterval = setInterval(recoverLines, 500)
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
            // updateUser(telegrammUser)
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
    function updateUserInfo() {
        const userInfoDiv = document.querySelector('.user__info');
        const score = getScore();
        const level = getCurrentLevel(score);
        const first_name = localStorage.getItem('first_name');
        const last_name = localStorage.getItem('last_name');
    
        userInfoDiv.innerHTML = `
            <p>Total Clicks: ${score}</p>
            <p>Current Level: ${level.name}</p>
            <p>First Name: ${first_name}</p>
            <p>Last Name: ${last_name}</p>
        `;
    }

    function displayLeaderboard(users) {
        const sortedUsers = users.sort((a, b) => b.score - a.score);
        const tbodyHTML = sortedUsers.map((user, index) => `
            <tr>
                <td>${index+1}</td>
                <td>${user.username}</td>
                <td>${user.score}</td>
            </tr>
        `).join('');
        document.querySelector('#tbody').innerHTML = tbodyHTML
    }
    document.querySelector('#leaderboardLink').addEventListener('click', () => { fetchAllUsers().then(users => displayLeaderboard(users)) });
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
const telegrammUser = tg.initDataUnsafe.user;
if (telegrammUser) {
    fetchUser(telegrammUser.id).then((dbUser) => {
        if (dbUser) {
            console.log('DB user:', dbUser);
            localStorage.setItem('external_id_telegram', dbUser.external_id_telegram);
            localStorage.setItem('username', dbUser.username);
            localStorage.setItem('first_name', dbUser.first_name);
            localStorage.setItem('last_name', dbUser.last_name);
            localStorage.setItem('score', dbUser.score);
            localStorage.setItem('dailyScore', dbUser.dailyScore);
            localStorage.setItem('monthlyScore', dbUser.monthlyScore);
            localStorage.setItem('lastUpdated', dbUser.lastUpdated);
            localStorage.setItem('lastUpdatedMonthly', dbUser.lastUpdatedMonthly);
            localStorage.setItem('availableLines', String(dbUser.availableLines));
            initializeApp();
        } 
    });
    tg.expand();
    tg.ready();
} else {
    localStorage.setItem('userId', '007');
    localStorage.setItem('username', 'Test');
    localStorage.setItem('first_name', 'Test');
    localStorage.setItem('last_name', 'Testovich');
    localStorage.setItem('score', 0);
    localStorage.setItem('dailyScore', 0);
    localStorage.setItem('monthlyScore', 0);
    localStorage.setItem('lastUpdated', '');
    localStorage.setItem('lastUpdatedMonthly', '');
    localStorage.setItem('availableLines', '100');
    initializeApp();
    console.error('User data not available');
}
