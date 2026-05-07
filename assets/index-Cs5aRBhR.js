(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#app`),t=0,n=0,r=1,i=0,a=30,o=!1,s=700,c=.1;e.innerHTML=`
  <h1>✨ キラキラ星あつめ ✨</h1>

  <div id="status">
    <p>レベル: <span id="level">1</span></p>
    <p>EXP: <span id="exp">0</span> / 10</p>
    <p>コイン: <span id="coins">0</span></p>
    <p>コンボ: <span id="combo">0</span></p>
    <p>のこり時間: <span id="time">30</span>秒</p>
  </div>

  <div id="message">
    ⭐をたくさんあつめよう！
  </div>

  <div id="game"></div>
`;var l=document.querySelector(`#game`),u=document.querySelector(`#message`);l.style.position=`relative`,l.style.width=`100%`,l.style.height=`500px`,l.style.background=`#fff0f5`,l.style.border=`4px solid pink`,l.style.borderRadius=`24px`,l.style.overflow=`hidden`;function d(){document.querySelector(`#coins`).textContent=t,document.querySelector(`#combo`).textContent=n,document.querySelector(`#level`).textContent=r,document.querySelector(`#exp`).textContent=i,document.querySelector(`#time`).textContent=a}function f(){i>=10&&(i-=10,r++,u.textContent=`🎉 レベル${r}！`,s=Math.max(300,s-50),c=Math.min(.35,c+.03))}function p(){if(o)return;let e=document.createElement(`div`),r=Math.random(),a=`normal`;r<c?a=`fake`:r<c+.12&&(a=`rare`),a===`fake`?e.textContent=`😈`:a===`rare`?e.textContent=`🌈`:e.textContent=`⭐`,e.style.position=`absolute`,e.style.fontSize=`48px`,e.style.cursor=`pointer`,e.style.left=Math.random()*85+`%`,e.style.top=Math.random()*85+`%`,e.style.transition=`all 0.5s`,e.style.userSelect=`none`,l.appendChild(e);let p=setInterval(()=>{e.style.left=Math.random()*85+`%`,e.style.top=Math.random()*85+`%`},s);Math.random()<.12&&a===`normal`&&setTimeout(()=>{e.parentNode&&(e.textContent=`😈`,a=`fake`)},1400),e.addEventListener(`click`,()=>{e.style.transform=`scale(1.4) rotate(15deg)`,a===`fake`&&(t-=3,n=0,u.textContent=`😈 いたずら星だった！`),a===`normal`&&(t+=1+n,n++,i+=1,n>=5?u.textContent=`🔥 ${n}コンボ！`:u.textContent=`⭐ ナイス！`),a===`rare`&&(t+=5+n,n++,i+=3,u.textContent=`🌈 レア星ゲット！`),f(),d(),clearInterval(p),setTimeout(()=>{e.remove()},150)}),setTimeout(()=>{clearInterval(p),e.parentNode&&e.remove()},2500)}var m=setInterval(()=>{o||p()},650),h=setInterval(()=>{a--,d(),a<=0&&(o=!0,clearInterval(h),clearInterval(m),u.textContent=`🎉 ゲーム終了！ ${t}コイン GET！`)},1e3);d();