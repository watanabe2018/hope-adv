import { state, addReward } from './state.js'

export const app = document.querySelector('#app')

export function renderLayout(content) {
  app.innerHTML = `
    <h1>✨ きらきらコース ✨</h1>

    <div class="status">
      <span>🪙 コイン: <b>${state.coins}</b></span>
      <span>⭐ レベル: <b>${state.level}</b></span>
      <span>けいけんち: <b>${state.exp}</b>/10</span>
    </div>

    ${content}
  `
}

export function showResult(title, rewardCoins, rewardExp, onBackHome) {
  addReward(rewardCoins, rewardExp)

  renderLayout(`
    <div class="card">
      <h2>${title}</h2>
      <p>🪙 ${rewardCoins} コイン ゲット！</p>
      <p>⭐ けいけんち ${rewardExp} ゲット！</p>
      <button id="backHome">コースにもどる</button>
    </div>
  `)

  document.querySelector('#backHome').addEventListener('click', onBackHome)
}

export function createSparkles(parent, x, y) {
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement('div')
    sparkle.textContent = '✨'
    sparkle.style.position = 'absolute'
    sparkle.style.left = x + 'px'
    sparkle.style.top = y + 'px'
    sparkle.style.fontSize = '22px'
    sparkle.style.pointerEvents = 'none'
    sparkle.style.transition = 'all 0.8s ease-out'

    parent.appendChild(sparkle)

    const angle = Math.random() * Math.PI * 2
    const distance = 40 + Math.random() * 50

    requestAnimationFrame(() => {
      sparkle.style.transform =
        `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.4)`
      sparkle.style.opacity = '0'
    })

    setTimeout(() => sparkle.remove(), 800)
  }
}