import {
  state,
  colorPieces,
  getColorCount,
  getWorldMessage,
  isStoryComplete,
} from './state.js'

export const app = document.querySelector('#app')

export function renderTown() {
  const hasRed = state.colors.red
  const hasBlue = state.colors.blue
  const hasYellow = state.colors.yellow
  const hasGreen = state.colors.green
  const hasPurple = state.colors.purple

  return `
    <div class="town">
      <div class="sky ${hasBlue ? 'colored-sky' : ''}">
        <div class="sun ${hasYellow ? 'colored-sun' : ''}">☀️</div>
        <div class="cloud">☁️</div>
      </div>

      <div class="town-ground">
        <div class="tree ${hasGreen ? 'colored-tree' : ''}">
          <div class="tree-top">●</div>
          <div class="tree-trunk">▌</div>
        </div>

        <div class="house">
          <div class="roof ${hasRed ? 'colored-roof' : ''}"></div>
          <div class="house-body">
            <div class="window ${hasYellow ? 'colored-window' : ''}"></div>
            <div class="door"></div>
          </div>
        </div>

        <div class="character ${hasPurple ? 'colored-character' : ''}">
          <div class="face">🙂</div>
          <div class="body">⬟</div>
        </div>
      </div>
    </div>
  `
}

export function renderColorCollection() {
  return `
    <div class="color-collection">
      ${colorPieces
        .map((piece) => {
          const found = state.colors[piece.key]
          return `
            <span class="color-piece ${found ? 'found' : 'missing'}">
              ${found ? piece.emoji : '⚪'}
              <small>${piece.name}</small>
            </span>
          `
        })
        .join('')}
    </div>
  `
}

export function renderGauge() {
  const percent = Math.min(100, state.colorPower)

  return `
    <div class="gauge-area">
      <div class="gauge-label">いろパワー ${percent} / 100</div>
      <div class="gauge">
        <div class="gauge-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `
}

export function renderHomeLayout(content) {
  app.innerHTML = `
    <h1>🎨 いろをとりもどそう</h1>

    <div class="world-card">
      <div class="world-message">${getWorldMessage()}</div>
      <div class="world-progress">
        もどったいろ: ${getColorCount()} / ${colorPieces.length}
      </div>
      ${renderTown()}
      ${renderGauge()}
      ${renderColorCollection()}
    </div>

    ${content}
  `
}

export function renderGameLayout(content) {
  app.innerHTML = `
    <h1>🎨 いろをとりもどそう</h1>
    ${content}
  `
}

export function showJourneyResult(totalPower, unlockedColors, onBackHome) {
  if (isStoryComplete()) {
    renderHomeLayout(`
      <div class="card ending-card">
        <h2>🌈 ぜんぶのいろが もどった！</h2>
        <p>まちが カラフルに なったよ。</p>
        <p class="big-emoji">🎉🌈✨</p>
        <button id="backHome">ホームにもどる</button>
      </div>
    `)
  } else {
    renderHomeLayout(`
      <div class="card">
        <h2>よくがんばったね！</h2>
        <p class="reward-color">いろパワー +${totalPower}</p>
        ${
          unlockedColors.length > 0
            ? unlockedColors
                .map(
                  (color) =>
                    `<p class="reward-color">${color.emoji} ${color.name}のいろが もどった！</p>`
                )
                .join('')
            : '<p>もうすこしで いろが もどりそう！</p>'
        }
        <button id="backHome">ホームにもどる</button>
      </div>
    `)
  }

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