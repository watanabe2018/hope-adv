import { renderGameLayout, createSparkles } from '../ui.js'

export function startRabbitCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let points = 0
  let jumps = 0
  let hits = 0
  let passedObstacles = 0
  let gameOver = false
  let isJumping = false

  const obstacles = ['🪨', '🌵', '🧱', '🍄', '🪵']

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🐰 うさぎジャンプ</h2>
      <p>ポイント: <b id="points">0</b></p>
      <p>ジャンプ: <b id="jumps">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">🐰をタップして、じゃまものをジャンプしよう！</div>
      <div id="game">
        <div id="rabbit">🐰</div>
      </div>
    </div>
  `)

  const game = document.querySelector('#game')
  const rabbit = document.querySelector('#rabbit')
  const message = document.querySelector('#message')

  rabbit.style.position = 'absolute'
  rabbit.style.left = '25%'
  rabbit.style.bottom = '36px'
  rabbit.style.fontSize = '58px'
  rabbit.style.transition = 'bottom 0.25s ease-out, transform 0.2s'
  rabbit.style.zIndex = '5'
  rabbit.style.cursor = 'pointer'
  rabbit.style.userSelect = 'none'

  function updateUI() {
    document.querySelector('#points').textContent = points
    document.querySelector('#jumps').textContent = jumps
    document.querySelector('#time').textContent = timeLeft
  }

  function showFloatingText(text, color = '#ff69b4') {
    const effect = document.createElement('div')
    effect.textContent = text
    effect.style.position = 'absolute'
    effect.style.left = '28%'
    effect.style.bottom = '130px'
    effect.style.fontSize = '28px'
    effect.style.fontWeight = 'bold'
    effect.style.color = color
    effect.style.pointerEvents = 'none'
    effect.style.transition = 'all 0.8s ease-out'
    effect.style.zIndex = '10'

    game.appendChild(effect)

    requestAnimationFrame(() => {
      effect.style.transform = 'translateY(-60px) scale(1.2)'
      effect.style.opacity = '0'
    })

    setTimeout(() => effect.remove(), 800)
  }

  function jump() {
    if (gameOver || isJumping) return

    isJumping = true
    jumps++

    rabbit.textContent = '🐰'
    rabbit.style.bottom = '175px'
    rabbit.style.transform = 'scale(1.08)'

    setTimeout(() => {
      rabbit.style.bottom = '36px'
      rabbit.style.transform = 'scale(1)'
    }, 390)

    setTimeout(() => {
      isJumping = false
    }, 680)

    updateUI()
  }

  rabbit.addEventListener('click', jump)
  game.addEventListener('click', jump)

  function makeSoftRect(rect, shrinkX, shrinkY) {
    return {
      left: rect.left + shrinkX,
      right: rect.right - shrinkX,
      top: rect.top + shrinkY,
      bottom: rect.bottom - shrinkY,
    }
  }

  function isOverlapping(a, b) {
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    )
  }

  function createObstacle() {
    if (gameOver) return

    const obstacle = document.createElement('div')
    obstacle.textContent = obstacles[Math.floor(Math.random() * obstacles.length)]

    const obstacleSize = 34 + Math.random() * 26
    let isFast = false
    // 基本スピード
    let speed = 2.2 - Math.min(1.2, passedObstacles * 0.03)

    // ときどき爆速（20%）
    if (Math.random() < 0.2) {
      speed *= 0.55
      isFast = true
    }
    const isBig = obstacleSize > 52

    obstacle.style.position = 'absolute'
    obstacle.style.right = '-70px'
    obstacle.style.bottom = '36px'
    obstacle.style.fontSize = `${obstacleSize}px`
    obstacle.style.transition = `right ${speed}s linear`
    obstacle.style.zIndex = '4'
    obstacle.style.userSelect = 'none'

    if (isFast) {
      message.textContent = '⚡ はやい！きをつけて！'
      obstacle.style.filter = 'brightness(1.2)'
    }
    game.appendChild(obstacle)

    requestAnimationFrame(() => {
      obstacle.style.right = '110%'
    })

    let counted = false

    const check = setInterval(() => {
      if (gameOver || !obstacle.parentNode) {
        clearInterval(check)
        return
      }

      const rabbitRectRaw = rabbit.getBoundingClientRect()
      const obstacleRectRaw = obstacle.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()

      // 判定を見た目より小さくして、かなり当たりにくくする
      const rabbitRect = makeSoftRect(rabbitRectRaw, 18, 14)
      const obstacleRect = makeSoftRect(obstacleRectRaw, 14, 12)

      const hit = isOverlapping(rabbitRect, obstacleRect)

      if (hit) {
        hits++
        points = Math.max(0, points - 2)
        message.textContent = 'あたっちゃった！つぎはいけるよ'
        rabbit.textContent = '😭'
        rabbit.style.transform = 'scale(1.15) rotate(-8deg)'
        showFloatingText('-2', '#777')

        setTimeout(() => {
          rabbit.textContent = '🐰'
          rabbit.style.transform = 'scale(1)'
        }, 500)

        obstacle.remove()
        clearInterval(check)
        updateUI()
        return
      }

      const rabbitCenter = rabbitRectRaw.left + rabbitRectRaw.width / 2
      const obstacleRight = obstacleRectRaw.right
      const obstacleCenter = obstacleRectRaw.left + obstacleRectRaw.width / 2

      const isNearRabbit =
        Math.abs(obstacleCenter - rabbitCenter) < 70

      const isRabbitHigh =
        rabbitRectRaw.bottom < gameRect.bottom - 70

      if (!counted && isNearRabbit && isRabbitHigh) {
        counted = true
        passedObstacles++

        const add = isBig ? 8 : 5
        points += add

        message.textContent = isBig
          ? 'すごい！大きなじゃまものをジャンプ！'
          : 'ジャンプせいこう！'

        showFloatingText(`+${add}`)
        createSparkles(
          game,
          rabbitRectRaw.left - gameRect.left,
          rabbitRectRaw.top - gameRect.top
        )

        updateUI()
      }
    }, 50)

    setTimeout(() => {
      clearInterval(check)
      if (obstacle.parentNode) obstacle.remove()
    }, speed * 1000 + 300)
  }

  const obstacleTimer = setInterval(createObstacle, 1150)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(obstacleTimer)

      const power = Math.max(8, 12 + points + passedObstacles * 2 - hits * 4)
      onFinish(Math.min(60, power))
    }
  }, 1000)

  updateUI()
}