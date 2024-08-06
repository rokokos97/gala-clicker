(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function p(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(n){if(n.ep)return;n.ep=!0;const c=p(n);fetch(n.href,c)}})();const z="/gala-clicker/galaStudent.webp",K="/gala-clicker/galaTrainee.webp",W="/gala-clicker/galaJunior.webp",Q="/gala-clicker/galaMiddle.webp",Z="/gala-clicker/galaSenior.webp",ee="/gala-clicker/galaTeamLead.webp",te="/gala-clicker/galaGoogle.webp",b="https://lisovyi.eu/api/users/";async function D(o){console.log("user",o);try{const r=await fetch(`${b}${o.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`)}catch(r){return console.error("Error updating user:",r),{error:"Error updating user data"}}}async function oe(o){try{let r=await fetch(`${b}${o}`);if(!r.ok)throw new Error(`Request error! status: ${r.status}`);return await r.json()}catch(r){console.error("Error fetching user:",r)}}async function N(){try{let o=await fetch(`${b}`);if(!o.ok)throw new Error(`Request error! status: ${o.status}`);return await o.json()}catch(o){console.error("Error fetching user:",o)}}function P(){const o=document.querySelectorAll("nav ul li a"),r=document.querySelectorAll(".section");o.forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const a=t.target.getAttribute("data-section");r.forEach(l=>{l.id===a?l.classList.add("active"):l.classList.remove("active")})})}),document.querySelectorAll("img").forEach(e=>{e.addEventListener("contextmenu",t=>t.preventDefault()),e.setAttribute("draggable","false")});const s=document.querySelector("#circle"),n=document.querySelector("#score"),c=document.querySelector("#daily-score"),f=document.querySelector("#monthly-score"),R=document.querySelector("#progress-fill"),X=document.querySelector("#clicks-left"),Y=document.querySelector("#available-lines");document.querySelector("#leaderboard");const j=document.querySelector("#loading-screen"),G=document.querySelector("#navigation");let d=Number(localStorage.getItem("availableLines"))||100,y=null,x=null;const S=[{id:1,name:"Student",numberOfCodeLines:0,imgUrl:z,xlevel:1,maxLines:100},{id:2,name:"Trainee",numberOfCodeLines:3e3,imgUrl:K,xlevel:1,maxLines:200},{id:3,name:"Junior",numberOfCodeLines:1e5,imgUrl:W,xlevel:5,maxLines:200},{id:4,name:"Middle",numberOfCodeLines:1e6,imgUrl:Q,xlevel:10,maxLines:400},{id:5,name:"Senior",numberOfCodeLines:1e7,imgUrl:Z,xlevel:15,maxLines:600},{id:6,name:"Team Lead",numberOfCodeLines:1e8,imgUrl:ee,xlevel:25,maxLines:800},{id:7,name:"Google",numberOfCodeLines:1e9,imgUrl:te,xlevel:50,maxLines:999}];function H(){J(),B(),U(i()),$(C()),w(O()),E(),M(),T(),L(),d<u(i()).maxLines&&(y=setInterval(q,1e3)),_(),N().then(e=>A(e)),j.style.display="none",document.getElementById("game").classList.add("active"),G.style.display="block"}function U(e){localStorage.setItem("score",e),n.textContent=e}function $(e){localStorage.setItem("dailyScore",e),c.textContent=e}function w(e){localStorage.setItem("monthlyScore",e),f.textContent=e}function i(){return Number(localStorage&&localStorage.getItem("score"))||0}function C(){return Number(localStorage.getItem("dailyScore"))||0}function O(){return Number(localStorage.getItem("monthlyScore"))||0}function J(){const e=localStorage.getItem("lastUpdated"),t=new Date().toISOString().split("T")[0];e!==t&&(localStorage.setItem("dailyScore",0),localStorage.setItem("lastUpdated",t))}function B(){const e=localStorage.getItem("lastUpdatedMonthly"),t=new Date().toISOString().split("T")[0].slice(0,7);e!==t&&(localStorage.setItem("monthlyScore",0),localStorage.setItem("lastUpdatedMonthly",t))}function F(){if(d>0){const e=i(),t=u(e),a=i()+t.xlevel,l=C()+t.xlevel,m=O()+t.xlevel;d-=1,localStorage.setItem("availableLines",String(d)),U(a),$(l),w(m),E(),M(),T(),L();const v={id:localStorage.getItem("userId"),first_name:localStorage.getItem("first_name"),last_name:localStorage.getItem("last_name"),username:localStorage.getItem("username"),score:a,dailyScore:localStorage.getItem("dailyScore"),monthlyScore:localStorage.getItem("monthlyScore"),lastUpdated:localStorage.getItem("lastUpdated"),lastUpdatedMonthly:localStorage.getItem("lastUpdatedMonthly"),availableLines:d};_(),D(v),clearTimeout(x),clearInterval(y),x=setTimeout(()=>{y=setInterval(q,500)},5e3)}else{s.classList.add("grayscale");return}}function E(){const e=i(),t=k(e),a=u(e),l=(e-a.numberOfCodeLines)/(t.numberOfCodeLines-a.numberOfCodeLines)*100;R.style.width=`${l}%`}function T(){const e=i(),t=k(e),a=u(e),l=Math.ceil((t.numberOfCodeLines-e)/a.xlevel);X.textContent=`Lines left level ${t.name}: ${l}`}function M(){const e=i(),t=u(e);s.setAttribute("src",`${t.imgUrl}`)}function L(){const e=i(),t=u(e);Y.textContent=`${d} / ${t.maxLines}`}function q(){const e=i(),t=u(e);d<t.maxLines?(d+=1,localStorage.setItem("availableLines",d),L(),D(I),d>0&&s.classList.remove("grayscale")):clearInterval(y)}function u(e){return S.slice().reverse().find(t=>e>=t.numberOfCodeLines)||S[0]}function k(e){return S.find(t=>e<t.numberOfCodeLines)||S[S.length-1]}function _(){const e=document.querySelector(".user__info"),t=i(),a=u(t),l=localStorage.getItem("first_name"),m=localStorage.getItem("last_name");e.innerHTML=`
            <p>Total Clicks: ${t}</p>
            <p>Current Level: ${a.name}</p>
            <p>First Name: ${l}</p>
            <p>Last Name: ${m}</p>
        `}function A(e){const a=e.sort((l,m)=>m.score-l.score).map((l,m)=>`
            <tr>
                <td>${m+1}</td>
                <td>${l.username}</td>
                <td>${l.score}</td>
            </tr>
        `).join("");document.querySelector("#tbody").innerHTML=a}document.querySelector("#leaderboardLink").addEventListener("click",()=>{N().then(e=>A(e))}),s.addEventListener("click",e=>{const t=s.getBoundingClientRect(),a=e.clientX-t.left-t.width/2,l=e.clientY-t.top-t.height/2,m=40,v=l/t.height*m,V=a/t.width*-m;s.style.setProperty("--tiltX",`${v}deg`),s.style.setProperty("--tiltY",`${V}deg`),setTimeout(()=>{s.style.setProperty("--tiltX","0deg"),s.style.setProperty("--tiltY","0deg")},200);const g=document.createElement("div");g.classList.add("plusone"),g.textContent=`+${u(i()).xlevel}`,g.style.left=`${e.clientX-t.left}px`,g.style.top=`${e.clientY-t.top}px`,s.parentElement.appendChild(g),F(),setTimeout(()=>{g.remove()},2e3)}),H()}const h=window.Telegram.WebApp,I=h.initDataUnsafe.user;I?(oe(I.id).then(o=>{o&&(console.log("User data:",o),localStorage.setItem("userId",o.id),localStorage.setItem("username",o.username),localStorage.setItem("first_name",o.first_name),localStorage.setItem("last_name",o.last_name),localStorage.setItem("score",o.score),localStorage.setItem("dailyScore",o.dailyScore),localStorage.setItem("monthlyScore",o.monthlyScore),localStorage.setItem("lastUpdated",o.lastUpdated),localStorage.setItem("lastUpdatedMonthly",o.lastUpdatedMonthly),localStorage.setItem("availableLines",String(o.availableLines)),P())}),h.expand(),h.ready()):(localStorage.setItem("userId","007"),localStorage.setItem("username","test"),localStorage.setItem("first_name","test"),localStorage.setItem("last_name","test"),localStorage.setItem("score",2990),localStorage.setItem("dailyScore",0),localStorage.setItem("monthlyScore",0),localStorage.setItem("lastUpdated",""),localStorage.setItem("lastUpdatedMonthly",""),localStorage.setItem("availableLines","100"),P(),console.error("User data not available"));
