import { renderGameLayout, createSparkles } from '../ui.js'

export function startBalloonCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let points = 0
  let combo = 0
  let mistakes = 0
  let gameOver = false

  const balloonTypes = [
    { key: 'red', name: 'あか', icon: '🔴🎈' },
    { key: 'blue', name: 'あお', icon: '🔵🎈' },
    { key: 'yellow', name: 'きいろ', icon: '🟡🎈' },
    { key: 'green', name: 'みどり', icon: '🟢🎈' },
    { key: 'gold', name: 'きんいろ', icon: '🌟🎈' },
  ]

  let targetType = pickTargetType()

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🎈 ふうせんミッション</h2>

      <div class="mission-box">
        <div>おだい</div>
        <div class="mission-text">
          <span id="targetIcon">${targetType.icon}</span>
          <span id="targetName">${targetType.name}</span> のふうせんを わろう！
        </div>
      </div>

      <p>ポイント: <b id="points">0</b></p>
      <p>コンボ: <b id="combo">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>

      <div id="message">おだいと おなじ ふうせんを タップ！</div>
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
    document.querySelector('#targetName').textContent = targetType.name
  }

  function changeMission() {
    if (gameOver) return

    const oldKey = targetType.key

    do {
      targetType = pickTargetType()
    } while (targetType.key === oldKey)

    message.textContent = `おだいチェンジ！ ${targetType.name} をねらってね`
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

    const isBomb = Math.random() < 0.12
    const isSmall = Math.random() < 0.3
    const isBig = !isSmall && Math.random() < 0.25

    balloon.textContent = isBomb ? '💣' : type.icon
    balloon.dataset.type = isBomb ? 'bomb' : type.key

    const fontSize = isSmall ? 34 : isBig ? 62 : 48
    const baseSpeed = isSmall ? 2.2 : isBig ? 3.2 : 2.7
    const speed = baseSpeed + Math.random() * 1.2
    const drift = -45 + Math.random() * 90

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

    requestAnimationFrame(() => {
      balloon.style.top = '-15%'
      balloon.style.transform = `translateX(${drift}px) rotate(${Math.random() * 40 - 20}deg)`
    })

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
        message.textContent = '💣 ばくだんだった！'
        showFloatingText('-2びょう', x, y, '#777')
      } else if (isCorrect) {
        combo++

        let add = 3
        if (isSmall) add += 3
        if (isBig) add += 1
        if (balloonKey === 'gold') add += 5
        if (combo >= 5) add += 3

        points += add

        message.textContent =
          combo >= 5 ? `すごい！${combo}コンボ！` : 'せいかい！'

        showFloatingText(`+${add}`, x, y)
        createSparkles(game, x + 24, y + 24)
      } else {
        mistakes++
        combo = 0
        timeLeft = Math.max(0, timeLeft - 1)
        message.textContent = `ちがういろ！${targetType.name} をねらってね`
        showFloatingText('-1びょう', x, y, '#777')
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

  const spawnTimer = setInterval(createBalloon, 520)
  const missionTimer = setInterval(changeMission, 5200)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      finishCourse()
    }
  }, 1000)

  updateUI()
}