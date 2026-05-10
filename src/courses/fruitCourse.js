import { renderGameLayout, createSparkles } from '../ui.js'

export function startFruitCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let score = 0
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p>${courseNumber}/${totalCourses}</p>
      <h2>🍎 フルーツキャッチ</h2>
      <p>スコア: <b id="score">0</b></p>
      <p>のこり: <b id="time">25</b></p>
      <div id="game"></div>
    </div>
  `)

  const game = document.querySelector('#game')

  function update() {
    document.querySelector('#score').textContent = score
    document.querySelector('#time').textContent = timeLeft
  }

  function spawn() {
    if (gameOver) return

    const el = document.createElement('div')
    const bad = Math.random() < 0.2

    el.textContent = bad ? '💀' : ['🍎', '🍌', '🍇'][Math.floor(Math.random() * 3)]
    el.style.position = 'absolute'
    el.style.left = Math.random() * 80 + '%'
    el.style.top = '0%'

    game.appendChild(el)

    let y = 0
    const fall = setInterval(() => {
      y += 5
      el.style.top = y + '%'

      if (y > 90) {
        clearInterval(fall)
        el.remove()
      }
    }, 50)

    el.addEventListener('click', () => {
      const rect = el.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()
      createSparkles(game, rect.left - gameRect.left, rect.top - gameRect.top)

      if (bad) {
        score -= 3
      } else {
        score += 2
      }

      update()
      clearInterval(fall)
      el.remove()
    })
  }

  const spawnTimer = setInterval(spawn, 500)

  const timer = setInterval(() => {
    timeLeft--
    update()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(spawnTimer)

      onFinish(Math.max(5, score))
    }
  }, 1000)

  update()
}