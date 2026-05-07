const app = document.querySelector('#app')

let coins = 0
let combo = 0
let level = 1
let exp = 0
let timeLeft = 30
let gameOver = false

let starSpeed = 700
let skullChance = 0.1

app.innerHTML = `
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
`

const game = document.querySelector('#game')
const message = document.querySelector('#message')

game.style.position = 'relative'
game.style.width = '100%'
game.style.height = '500px'
game.style.background = '#fff0f5'
game.style.border = '4px solid pink'
game.style.borderRadius = '24px'
game.style.overflow = 'hidden'

function updateUI() {
  document.querySelector('#coins').textContent = coins
  document.querySelector('#combo').textContent = combo
  document.querySelector('#level').textContent = level
  document.querySelector('#exp').textContent = exp
  document.querySelector('#time').textContent = timeLeft
}

function levelUp() {
  if (exp >= 10) {
    exp = exp - 10
    level++

    message.textContent = `🎉 レベル${level}！`

    // 少しずつ難しく
    starSpeed = Math.max(300, starSpeed - 50)
    skullChance = Math.min(0.35, skullChance + 0.03)
  }
}

function createStar() {
  if (gameOver) return

  const star = document.createElement('div')

  const random = Math.random()

  let type = 'normal'

  if (random < skullChance) {
    type = 'fake'
  } else if (random < skullChance + 0.12) {
    type = 'rare'
  }

  if (type === 'fake') {
    star.textContent = '😈'
  } else if (type === 'rare') {
    star.textContent = '🌈'
  } else {
    star.textContent = '⭐'
  }

  star.style.position = 'absolute'
  star.style.fontSize = '48px'
  star.style.cursor = 'pointer'
  star.style.left = Math.random() * 85 + '%'
  star.style.top = Math.random() * 85 + '%'
  star.style.transition = 'all 0.5s'
  star.style.userSelect = 'none'

  game.appendChild(star)

  // フワフワ移動
  const move = setInterval(() => {
    star.style.left = Math.random() * 85 + '%'
    star.style.top = Math.random() * 85 + '%'
  }, starSpeed)

  // 消える前に変化
  const transformChance = Math.random() < 0.12

  if (transformChance && type === 'normal') {
    setTimeout(() => {
      if (star.parentNode) {
        star.textContent = '😈'
        type = 'fake'
      }
    }, 1400)
  }

  star.addEventListener('click', () => {
    star.style.transform = 'scale(1.4) rotate(15deg)'
    const rect = star.getBoundingClientRect()
    const gameRect = game.getBoundingClientRect()

    createSparkles(
      rect.left - gameRect.left,
      rect.top - gameRect.top
    )

    if (type === 'fake') {
      coins -= 3
      combo = 0
      message.textContent = '😈 いたずら星だった！'
    }

    if (type === 'normal') {
      coins += 1 + combo
      combo++
      exp += 1

      if (combo >= 5) {
        message.textContent = `🔥 ${combo}コンボ！`
      } else {
        message.textContent = '⭐ ナイス！'
      }
    }

    if (type === 'rare') {
      coins += 5 + combo
      combo++
      exp += 3

      message.textContent = '🌈 レア星ゲット！'
    }

    levelUp()

    updateUI()

    clearInterval(move)

    setTimeout(() => {
      star.remove()
    }, 150)
  })

  setTimeout(() => {
    clearInterval(move)

    if (star.parentNode) {
      star.remove()
    }
  }, 2500)
}

const starTimer = setInterval(() => {
  if (!gameOver) {
    createStar()
  }
}, 650)

const timer = setInterval(() => {
  timeLeft--

  updateUI()

  if (timeLeft <= 0) {
    gameOver = true

    clearInterval(timer)
    clearInterval(starTimer)

    message.textContent =
      `🎉 ゲーム終了！ ${coins}コイン GET！`
  }
}, 1000)

updateUI()

function createSparkles(x, y) {
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement('div')

    sparkle.textContent = '✨'

    sparkle.style.position = 'absolute'
    sparkle.style.left = x + 'px'
    sparkle.style.top = y + 'px'
    sparkle.style.fontSize = '24px'
    sparkle.style.pointerEvents = 'none'
    sparkle.style.transition = 'all 0.8s ease-out'

    game.appendChild(sparkle)

    const angle = Math.random() * Math.PI * 2
    const distance = 50 + Math.random() * 50

    const moveX = Math.cos(angle) * distance
    const moveY = Math.sin(angle) * distance

    requestAnimationFrame(() => {
      sparkle.style.transform =
        `translate(${moveX}px, ${moveY}px) scale(0.5)`

      sparkle.style.opacity = '0'
    })

    setTimeout(() => {
      sparkle.remove()
    }, 800)
  }
}