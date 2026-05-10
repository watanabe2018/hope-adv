import { renderGameLayout, createSparkles } from '../ui.js'

export function startBalloonCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let balloonsPopped = 0
  let mistakes = 0
  let combo = 0
  let gameOver = false
  const targetBalloons = 12

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🎈 ふうせんタップ</h2>
      <p>わったふうせん: <b id="balloonsPopped">0</b> / ${targetBalloons}</p>
      <p>コンボ: <b id="combo">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">🎈をタップ！💣はさわらないでね</div>
      <div id="game"></div>
    </div>
  `)

  const game = document.querySelector('#game')
  const message = document.querySelector('#message')

  function updateUI() {
    document.querySelector('#balloonsPopped').textContent = balloonsPopped
    document.querySelector('#combo').textContent = combo
    document.querySelector('#time').textContent = timeLeft
  }

  function finishCourse() {
    if (gameOver) return
    gameOver = true
    clearInterval(spawnTimer)
    clearInterval(timer)

    const power = Math.max(10, 8 + balloonsPopped * 3 + combo - mistakes * 4)
    onFinish(Math.min(55, power))
  }

  function createBalloon() {
    if (gameOver) return

    const item = document.createElement('div')
    const random = Math.random()

    let type = 'balloon'
    if (random < 0.18) type = 'bomb'
    else if (random < 0.28) type = 'rare'

    item.textContent = type === 'bomb' ? '💣' : type === 'rare' ? '🎁' : '🎈'
    item.style.position = 'absolute'
    item.style.fontSize = '48px'
    item.style.cursor = 'pointer'
    item.style.left = Math.random() * 85 + '%'
    item.style.top = '85%'
    item.style.transition = 'top 2.2s linear, transform 0.2s'
    item.style.userSelect = 'none'

    game.appendChild(item)

    requestAnimationFrame(() => {
      item.style.top = '-10%'
    })

    item.addEventListener('click', () => {
      const rect = item.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()
      createSparkles(game, rect.left - gameRect.left, rect.top - gameRect.top)

      item.style.transform = 'scale(1.4)'

      if (type === 'bomb') {
        mistakes++
        combo = 0
        timeLeft = Math.max(0, timeLeft - 2)
        message.textContent = '💣 ばくだんだった！'
      } else if (type === 'rare') {
        balloonsPopped += 3
        combo++
        message.textContent = '🎁 ラッキー！ふうせん3こぶん！'
      } else {
        balloonsPopped++
        combo++
        message.textContent = combo >= 5 ? `🔥 ${combo}コンボ！` : '🎈 ぱんっ！'
      }

      updateUI()

      setTimeout(() => item.remove(), 120)

      if (balloonsPopped >= targetBalloons) {
        setTimeout(finishCourse, 250)
      }
    })

    setTimeout(() => {
      if (item.parentNode) item.remove()
    }, 2300)
  }

  const spawnTimer = setInterval(createBalloon, 550)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      finishCourse()
    }
  }, 1000)

  updateUI()
}