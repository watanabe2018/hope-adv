(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#app`),t=0,n=30,r=0,i=1,a=0,o=!1,s=[],c=`ふつうの服`,l=[{name:`ピンクドレス`,price:10},{name:`星のぼうし`,price:15},{name:`にじの羽`,price:25}];e.innerHTML=`
  <h1>キラキラ星あつめ</h1>

  <div id="status">
    <p>レベル: <span id="level">1</span></p>
    <p>けいけんち: <span id="exp">0</span> / 10</p>
    <p>コイン: <span id="coins">0</span></p>
    <p>コンボ: <span id="combo">0</span></p>
    <p>いまの服: <span id="equipped">ふつうの服</span></p>
    <p>のこり時間: <span id="time">30</span>秒</p>
  </div>

  <button id="shopButton">ショップをひらく</button>

  <div id="shop" style="display:none;">
    <h2>ショップ</h2>
    <div id="shopItems"></div>
  </div>

  <div id="message">⭐をあつめよう！💀はさわらないでね</div>
  <div id="game"></div>
`;var u=document.querySelector(`#game`),d=document.querySelector(`#message`),f=document.querySelector(`#shop`),p=document.querySelector(`#shopButton`),m=document.querySelector(`#shopItems`);u.style.position=`relative`,u.style.width=`100%`,u.style.height=`500px`,u.style.border=`3px solid pink`,u.style.overflow=`hidden`,u.style.background=`#fff0f5`,d.style.fontSize=`22px`,d.style.fontWeight=`bold`,d.style.color=`#ff69b4`,d.style.margin=`12px`,f.style.background=`#fff`,f.style.border=`3px solid #ff9ed2`,f.style.borderRadius=`20px`,f.style.padding=`16px`,f.style.margin=`16px 0`;function h(){document.querySelector(`#coins`).textContent=t,document.querySelector(`#combo`).textContent=r,document.querySelector(`#time`).textContent=n,document.querySelector(`#level`).textContent=i,document.querySelector(`#exp`).textContent=a,document.querySelector(`#equipped`).textContent=c,_()}function g(e){a+=e,a>=10&&(a-=10,i++,d.textContent=`🎉 レベル${i}にアップ！`)}function _(){m.innerHTML=``,l.forEach(e=>{let n=document.createElement(`div`);n.style.margin=`12px`,n.style.padding=`12px`,n.style.border=`2px solid pink`,n.style.borderRadius=`16px`;let r=s.includes(e.name);n.innerHTML=`
      <strong>${e.name}</strong><br>
      ${r?`もってるよ！`:`${e.price} コイン`}
    `;let i=document.createElement(`button`);r?(i.textContent=`きる`,i.addEventListener(`click`,()=>{c=e.name,d.textContent=`${e.name}をきたよ！`,h()})):(i.textContent=`かう`,i.addEventListener(`click`,()=>{t>=e.price?(t-=e.price,s.push(e.name),c=e.name,d.textContent=`${e.name}をかったよ！`):d.textContent=`コインがたりないよ！`,h()})),n.appendChild(document.createElement(`br`)),n.appendChild(i),m.appendChild(n)})}p.addEventListener(`click`,()=>{f.style.display===`none`?(f.style.display=`block`,p.textContent=`ショップをとじる`):(f.style.display=`none`,p.textContent=`ショップをひらく`)});function v(){if(o)return;let e=document.createElement(`div`),n=Math.random(),i=n<.2?`fake`:n<.3?`rare`:`normal`;e.textContent=i===`fake`?`💀`:i===`rare`?`🌈`:`⭐`,e.style.position=`absolute`,e.style.fontSize=`46px`,e.style.cursor=`pointer`,e.style.left=Math.random()*90+`%`,e.style.top=Math.random()*90+`%`,e.style.transition=`all 0.4s`,e.style.filter=`drop-shadow(0 4px 4px rgba(0,0,0,0.2))`;let a=setInterval(()=>{e.style.left=Math.random()*90+`%`,e.style.top=Math.random()*90+`%`},600);e.addEventListener(`click`,()=>{e.style.transform=`scale(1.5) rotate(20deg)`,i===`fake`?(t-=3,r=0,d.textContent=`あっ！ニセ星だった！`):i===`rare`?(t+=5+r,r++,g(3),d.textContent=`🌈 レア星ゲット！`):(t+=1+r,r++,g(1),d.textContent=`⭐ いいね！`),h(),clearInterval(a),setTimeout(()=>{e.remove()},150)}),u.appendChild(e),setTimeout(()=>{clearInterval(a),e.remove()},2e3)}var y=setInterval(()=>{n>0&&v()},600),b=setInterval(()=>{n--,h(),n<=0&&(o=!0,clearInterval(b),clearInterval(y),d.textContent=`ゲーム終了！ コイン${t}まい、レベル${i}！`)},1e3);h();