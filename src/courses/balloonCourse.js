import { renderGameLayout, createSparkles } from '../ui.js'

export function startBalloonCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let points = 0
  let combo = 0
  let mistakes = 0
  let gameOver = false

  const balloonTypes = [
    { key: 'red', name: 'あか', icon: '🔴' },
    { key: 'blue', name: 'あお', icon: '🔵' },
    { key: 'yellow', name: 'きいろ', icon: '🟡' },
    { key: 'green', name: 'みどり', icon: '🟢' },
    { key: 'gold', name: 'きん', icon: '🌟' },
  ]

  let targetType = pickTargetType()


renderGameLayout(`
  <div class="card">
    <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
    <h2>🎈 ふうせんミッション</h2>

    <p>ポイント: <b id="points">0</b> / コンボ: <b id="combo">0</b></p>
    <p>のこり: <b id="time">25</b></p>

    <div id="message">おなじマークをタップ！</div>

    <div class="target-bar">
      <span class="target-label">これ！</span>
      <span id="targetIcon" class="target-icon">${targetType.icon}</span>
    </div>

    <div id="game"></div>
  </div>
`)
  const game = document.querySelector('#game')
  const message = document.querySelector('#message')

  function pickTargetType() {
    return balloonTypes[Math.floor(Math.random() * balloonTypes.length)]
  }

  function updateUI() {
    document.querySelector('#points').textContent = points
    document.querySelector('#combo').textContent = combo
    document.querySelector('#time').textContent = timeLeft
    document.querySelector('#targetIcon').textContent = targetType.icon
  }

  function changeMission() {
    if (gameOver) return

    const oldKey = targetType.key
    do {
      targetType = pickTargetType()
    } while (targetType.key === oldKey)

    message.textContent = 'おだいチェンジ！'
    updateUI()
  }

  function showFloatingText(text, x, y, color = '#ff69b4') {
    const effect = document.createElement('div')
    effect.textContent = text
    effect.style.position = 'absolute'
    effect.style.left = x + 'px'
    effect.style.top = y + 'px'
    effect.style.fontSize = '28px'
    effect.style.fontWeight = 'bold'
    effect.style.color = color
    effect.style.pointerEvents = 'none'
    effect.style.transition = 'all 0.75s ease-out'
    effect.style.zIndex = '20'

    game.appendChild(effect)

    requestAnimationFrame(() => {
      effect.style.transform = 'translateY(-55px) scale(1.15)'
      effect.style.opacity = '0'
    })

    setTimeout(() => effect.remove(), 800)
  }

  function createBalloon() {
    if (gameOver) return

    const balloon = document.createElement('div')
    const type = balloonTypes[Math.floor(Math.random() * balloonTypes.length)]

    const isBomb = Math.random() < 0.1
    const isSmall = Math.random() < 0.3
    const isBig = !isSmall && Math.random() < 0.25

    balloon.textContent = isBomb ? '💣' : type.icon
    balloon.dataset.type = isBomb ? 'bomb' : type.key

    const fontSize = isSmall ? 34 : isBig ? 68 : 50

    // 数字が小さいほど速い。かなり幅を持たせる
    let speed = 1.4 + Math.random() * 3.0

    if (isSmall) speed *= 0.85
    if (isBig) speed *= 1.15

    const drift = -160 + Math.random() * 320
    const rotate = -35 + Math.random() * 70

    balloon.style.position = 'absolute'
    balloon.style.fontSize = `${fontSize}px`
    balloon.style.cursor = 'pointer'
    balloon.style.left = Math.random() * 80 + '%'
    balloon.style.top = '92%'
    balloon.style.userSelect = 'none'
    balloon.style.zIndex = '5'
    balloon.style.transition = `
      top ${speed}s linear,
      transform ${speed}s ease-in-out,
      opacity 0.2s
    `

    if (type.key === 'gold' && !isBomb) {
      balloon.style.filter = 'drop-shadow(0 0 10px gold)'
    }

    game.appendChild(balloon)

    const drift1 = -160 + Math.random() * 320
    const drift2 = -120 + Math.random() * 240

    requestAnimationFrame(() => {
      balloon.style.top = '-15%'
      balloon.style.transform = `translateX(${drift1}px) rotate(${rotate}deg)`
    })

    setTimeout(() => {
      if (!balloon.parentNode) return
      balloon.style.transform = `translateX(${drift2}px) rotate(${rotate}deg)`
    }, (speed * 1000) / 2)

    balloon.addEventListener('click', () => {
      if (gameOver) return

      const rect = balloon.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()
      const x = rect.left - gameRect.left
      const y = rect.top - gameRect.top

      const balloonKey = balloon.dataset.type
      const isCorrect = balloonKey === targetType.key

      balloon.style.transform += ' scale(1.4)'
      balloon.style.opacity = '0.3'

      if (balloonKey === 'bomb') {
        mistakes++
        combo = 0
        timeLeft = Math.max(0, timeLeft - 2)
        message.textContent = '💣 あぶない！'
        showFloatingText('-2', x, y, '#777')
      } else if (isCorrect) {
        combo++

        let add = 3
        if (isSmall) add += 3
        if (isBig) add += 1
        if (balloonKey === 'gold') add += 5
        if (combo >= 5) add += 3

        points += add
        message.textContent = combo >= 5 ? `${combo}コンボ！` : 'OK！'

        showFloatingText(`+${add}`, x, y)
        createSparkles(game, x + 24, y + 24)
      } else {
        mistakes++
        combo = 0
        timeLeft = Math.max(0, timeLeft - 1)
        message.textContent = 'ちがう！'
        showFloatingText('-1', x, y, '#777')
      }

      updateUI()
      setTimeout(() => balloon.remove(), 120)
    })

    setTimeout(() => {
      if (balloon.parentNode) balloon.remove()
    }, speed * 1000 + 200)
  }

  function finishCourse() {
    if (gameOver) return
    gameOver = true

    clearInterval(spawnTimer)
    clearInterval(timer)
    clearInterval(missionTimer)

    const power = Math.max(8, 12 + points - mistakes * 3)
    onFinish(Math.min(65, power))
  }

  const spawnTimer = setInterval(createBalloon, 500)
  const missionTimer = setInterval(changeMission, 4800)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      finishCourse()
    }
  }, 1000)

  updateUI()
}