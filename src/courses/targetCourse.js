import { renderGameLayout, createSparkles } from '../ui.js'

export function startTargetCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let hits = 0
  let shots = 0
  let bombsHit = 0
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🎯 まとあて</h2>
      <p>あたり: <b id="hits">0</b> / うったかず: <b id="shots">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">🎯をねらおう！💣はダメ！</div>
      <div id="targetGame">
        <div id="target">🎯</div>
        <div id="bomb">💣</div>
        <div id="bow">🏹</div>
      </div>
    </div>
  `)

  const targetGame = document.querySelector('#targetGame')
  const target = document.querySelector('#target')
  const bomb = document.querySelector('#bomb')
  const message = document.querySelector('#message')

  let targetX = 50
  let targetY = 30
  let bombX = 25
  let bombY = 45

  let targetDX = 0.7
  let targetDY = 0.45
  let bombDX = 0.65
  let bombDY = 0.5

  let targetSpeedBoost = 1
  let bombSpeedBoost = 1

  function updateUI() {
    document.querySelector('#hits').textContent = hits
    document.querySelector('#shots').textContent = shots
    document.querySelector('#time').textContent = timeLeft
  }

  function changeSpeedMood() {
    if (gameOver) return

    const mood = Math.random()

    if (mood < 0.35) {
      targetSpeedBoost = 0.65
      message.textContent = 'ゆっくりチャンス！'
    } else if (mood < 0.7) {
      targetSpeedBoost = 1.0
    } else {
      targetSpeedBoost = 1.8
      message.textContent = 'はやい！まとがにげる！'
    }

    bombSpeedBoost = 0.8 + Math.random() * 1.2
  }

  function updateMovingObjects() {
    targetX += targetDX * targetSpeedBoost
    targetY += targetDY * targetSpeedBoost
    bombX += bombDX * bombSpeedBoost
    bombY += bombDY * bombSpeedBoost

    if (targetX < 12 || targetX > 88) targetDX *= -1
    if (targetY < 10 || targetY > 62) targetDY *= -1

    if (bombX < 12 || bombX > 88) bombDX *= -1
    if (bombY < 10 || bombY > 62) bombDY *= -1

    target.style.left = targetX + '%'
    target.style.top = targetY + '%'

    bomb.style.left = bombX + '%'
    bomb.style.top = bombY + '%'
  }

  function getElementCenter(element, gameRect) {
    const rect = element.getBoundingClientRect()

    return {
      x: rect.left - gameRect.left + rect.width / 2,
      y: rect.top - gameRect.top + rect.height / 2,
    }
  }

  function shootArrow(event) {
    if (gameOver) return

    shots++

    const gameRect = targetGame.getBoundingClientRect()

    const tapX = event.clientX - gameRect.left
    const tapY = event.clientY - gameRect.top

    const startX = gameRect.width / 2
    const startY = gameRect.height - 35

    const arrow = document.createElement('div')
    arrow.textContent = '➤'
    arrow.className = 'arrow'

    arrow.style.left = startX + 'px'
    arrow.style.top = startY + 'px'

    const dx = tapX - startX
    const dy = tapY - startY
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`

    targetGame.appendChild(arrow)

    requestAnimationFrame(() => {
      arrow.style.left = tapX + 'px'
      arrow.style.top = tapY + 'px'
    })

    setTimeout(() => {
      if (gameOver) return

      const currentTarget = getElementCenter(target, gameRect)
      const currentBomb = getElementCenter(bomb, gameRect)

      const targetDistance = Math.hypot(tapX - currentTarget.x, tapY - currentTarget.y)
      const bombDistance = Math.hypot(tapX - currentBomb.x, tapY - currentBomb.y)

      if (bombDistance < 42) {
        bombsHit++
        timeLeft = Math.max(0, timeLeft - 2)
        message.textContent = '💣 ばくだんに あたった！'
        bomb.classList.add('bomb-hit')
        setTimeout(() => bomb.classList.remove('bomb-hit'), 350)
      } else if (targetDistance < 46) {
        hits++
        message.textContent = '🎯 あたり！'
        createSparkles(targetGame, currentTarget.x, currentTarget.y)
        target.classList.add('target-hit')
        setTimeout(() => target.classList.remove('target-hit'), 350)
      } else {
        message.textContent = 'よけられた！'
      }

      updateUI()

      setTimeout(() => {
        arrow.remove()
      }, 250)
    }, 280)

    updateUI()
  }

  targetGame.addEventListener('click', shootArrow)

  const moveTimer = setInterval(() => {
    if (!gameOver) updateMovingObjects()
  }, 30)

  const speedTimer = setInterval(changeSpeedMood, 1800)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(moveTimer)
      clearInterval(speedTimer)

      const power = Math.max(
        8,
        10 + hits * 7 - Math.max(0, shots - hits) - bombsHit * 6
      )

      onFinish(Math.min(60, power))
    }
  }, 1000)

  changeSpeedMood()
  updateMovingObjects()
  updateUI()
}