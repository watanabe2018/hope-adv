import { renderGameLayout, createSparkles } from '../ui.js'

export function startFruitCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let points = 0
  let combo = 0
  let misses = 0
  let gameOver = false
  let basketX = 50

  const fruits = ['🍎', '🍇', '🍊', '🍓', '🍌']

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🍎 フルーツキャッチ</h2>

      <p>ポイント: <b id="points">0</b> / コンボ: <b id="combo">0</b></p>
      <p>のこり: <b id="time">25</b></p>
      <div id="message">🍎を かごでキャッチ！💣はよけよう</div>

      <div id="fruitGame">
        <div id="basket">🧺</div>
      </div>
    </div>
  `)

  const fruitGame = document.querySelector('#fruitGame')
  const basket = document.querySelector('#basket')
  const message = document.querySelector('#message')

  function updateUI() {
    document.querySelector('#points').textContent = points
    document.querySelector('#combo').textContent = combo
    document.querySelector('#time').textContent = timeLeft
    basket.style.left = `${basketX}%`
  }

  function moveBasketByTap(event) {
    if (gameOver) return

    const rect = fruitGame.getBoundingClientRect()
    const x = event.clientX - rect.left
    basketX = Math.max(8, Math.min(92, (x / rect.width) * 100))
    updateUI()
  }

  fruitGame.addEventListener('click', moveBasketByTap)

  function showFloatingText(text, x, y, color = '#ff69b4') {
    const effect = document.createElement('div')
    effect.textContent = text
    effect.style.position = 'absolute'
    effect.style.left = x + 'px'
    effect.style.top = y + 'px'
    effect.style.fontSize = '30px'
    effect.style.fontWeight = 'bold'
    effect.style.color = color
    effect.style.pointerEvents = 'none'
    effect.style.transition = 'all 0.75s ease-out'
    effect.style.zIndex = '20'

    fruitGame.appendChild(effect)

    requestAnimationFrame(() => {
      effect.style.transform = 'translateY(-60px) scale(1.18)'
      effect.style.opacity = '0'
    })

    setTimeout(() => effect.remove(), 800)
  }

  function spawnFruit() {
    if (gameOver) return

    const item = document.createElement('div')
    const isBomb = Math.random() < 0.27
    const isGold = !isBomb && Math.random() < 0.12

    item.textContent = isBomb
      ? '💣'
      : isGold
        ? '🌟'
        : fruits[Math.floor(Math.random() * fruits.length)]

    item.className = 'falling-fruit'

    const startX = 20 + Math.random() * 60
    const speed = 1.6 + Math.random() * 2.6
    const drift1 = -70 + Math.random() * 140
    const drift2 = -60 + Math.random() * 120

    item.style.left = `${startX}%`
    item.style.top = '-40px'
    item.style.opacity = '1'
    item.style.transform = 'translateX(0px) rotate(0deg)'
    item.style.transition = `
      top ${speed}s linear,
      transform ${speed}s ease-in-out,
      opacity 0.15s
    `

    fruitGame.appendChild(item)

    const rotate1 = Math.random() * 100 - 50
    const rotate2 = Math.random() * 120 - 60

    requestAnimationFrame(() => {
      item.style.opacity = '1'
      item.style.top = '110%'
      item.style.transform = `translateX(${drift1}px) rotate(${rotate1}deg)`
    })

    setTimeout(() => {
      if (!item.parentNode) return
      item.style.transform = `translateX(${drift2}px) rotate(${rotate2}deg)`
    }, (speed * 1000) / 2)

    const check = setInterval(() => {
      if (gameOver || !item.parentNode) {
        clearInterval(check)
        return
      }

      const itemRect = item.getBoundingClientRect()
      const basketRect = basket.getBoundingClientRect()
      const gameRect = fruitGame.getBoundingClientRect()

      const caught =
        itemRect.left < basketRect.right &&
        itemRect.right > basketRect.left &&
        itemRect.bottom > basketRect.top + 10 &&
        itemRect.top < basketRect.bottom

      if (caught) {
        clearInterval(check)

        const x = itemRect.left - gameRect.left
        const y = itemRect.top - gameRect.top

        if (isBomb) {
          combo = 0
          misses++
          timeLeft = Math.max(0, timeLeft - 2)
          message.textContent = '💣 ばくだん！'
          showFloatingText('-2', x, y, '#777')
        } else {
          combo++

          const add = isGold ? 8 : combo >= 5 ? 5 : 3
          points += add
          message.textContent = isGold ? '🌟 ラッキー！' : combo >= 5 ? `${combo}コンボ！` : 'キャッチ！'

          showFloatingText(`+${add}`, x, y)
          createSparkles(fruitGame, x + 24, y + 24)
        }

        updateUI()
        item.remove()
      }
    }, 40)

    setTimeout(() => {
      clearInterval(check)

      if (item.parentNode) {
        item.remove()

        if (!isBomb) {
          misses++
          combo = 0
          message.textContent = 'おしい！'
          updateUI()
        }
      }
    }, speed * 1000 + 100)
  }

  function finishCourse() {
    if (gameOver) return
    gameOver = true

    clearInterval(spawnTimer)
    clearInterval(timer)

    const power = Math.max(8, 12 + points - misses * 2)
    onFinish(Math.min(65, power))
  }

  const spawnTimer = setInterval(spawnFruit, 650)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      finishCourse()
    }
  }, 1000)

  updateUI()
}