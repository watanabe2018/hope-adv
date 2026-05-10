import { renderGameLayout, createSparkles } from '../ui.js'

export function startTargetCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let hits = 0
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🎯 まとあて</h2>
      <p>あてたかず: <b id="hits">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">🎯をタップしよう！</div>
      <div id="game"></div>
    </div>
  `)

  const game = document.querySelector('#game')

  function updateUI() {
    document.querySelector('#hits').textContent = hits
    document.querySelector('#time').textContent = timeLeft
  }

  function createTarget() {
    if (gameOver) return

    const target = document.createElement('div')
    target.textContent = '🎯'
    target.style.position = 'absolute'
    target.style.fontSize = '52px'
    target.style.cursor = 'pointer'
    target.style.left = Math.random() * 85 + '%'
    target.style.top = Math.random() * 85 + '%'
    target.style.transition = 'all 0.45s'
    target.style.userSelect = 'none'

    game.appendChild(target)

    const move = setInterval(() => {
      target.style.left = Math.random() * 85 + '%'
      target.style.top = Math.random() * 85 + '%'
    }, 650)

    target.addEventListener('click', () => {
      const rect = target.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()
      createSparkles(game, rect.left - gameRect.left, rect.top - gameRect.top)

      hits++
      updateUI()
      clearInterval(move)
      target.remove()
    })

    setTimeout(() => {
      clearInterval(move)
      target.remove()
    }, 1800)
  }

  const targetTimer = setInterval(createTarget, 650)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(targetTimer)

      const power = Math.max(8, 10 + hits * 4)
      onFinish(Math.min(55, power))
    }
  }, 1000)

  updateUI()
}