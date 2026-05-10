import { renderGameLayout, createSparkles } from '../ui.js'

export function startGermCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let germsCleared = 0
  let mistakes = 0
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🧼 ばいきんけし</h2>
      <p>けしたばいきん: <b id="germsCleared">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">🦠をタップしてけそう！🧸はさわらないでね</div>
      <div id="game"></div>
    </div>
  `)

  const game = document.querySelector('#game')

  function updateUI() {
    document.querySelector('#germsCleared').textContent = germsCleared
    document.querySelector('#time').textContent = timeLeft
  }

  function spawnItem() {
    if (gameOver) return

    const item = document.createElement('div')
    const isFriend = Math.random() < 0.18

    item.textContent = isFriend ? '🧸' : '🦠'
    item.style.position = 'absolute'
    item.style.fontSize = '48px'
    item.style.cursor = 'pointer'
    item.style.left = Math.random() * 85 + '%'
    item.style.top = Math.random() * 85 + '%'
    item.style.userSelect = 'none'
    item.style.transition = 'transform 0.2s'

    game.appendChild(item)

    item.addEventListener('click', () => {
      const rect = item.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()
      createSparkles(game, rect.left - gameRect.left, rect.top - gameRect.top)

      if (isFriend) {
        mistakes++
        timeLeft = Math.max(0, timeLeft - 2)
      } else {
        germsCleared++
      }

      updateUI()
      item.remove()
    })

    setTimeout(() => {
      item.remove()
    }, 1800)
  }

  const spawnTimer = setInterval(spawnItem, 550)

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(spawnTimer)

      const power = Math.max(8, 10 + germsCleared * 3 - mistakes * 4)
      onFinish(Math.min(55, power))
    }
  }, 1000)

  updateUI()
}