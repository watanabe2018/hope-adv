import { renderGameLayout, createSparkles } from '../ui.js'

export function startFishCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let fish = 0
  let miss = 0
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p class="course-count">${courseNumber}/${totalCourses}</p>
      <h2>🐟 さかなタップ</h2>
      <p>さかな: <b id="fish">0</b></p>
      <p>のこり: <b id="time">25</b></p>
      <div id="game"></div>
    </div>
  `)

  const game = document.querySelector('#game')

  function update() {
    document.querySelector('#fish').textContent = fish
    document.querySelector('#time').textContent = timeLeft
  }

  function spawn() {
    if (gameOver) return

    const el = document.createElement('div')
    const isShark = Math.random() < 0.2

    el.textContent = isShark ? '🦈' : '🐟'
    el.style.position = 'absolute'
    el.style.fontSize = '48px'
    el.style.left = Math.random() * 80 + '%'
    el.style.top = Math.random() * 80 + '%'

    game.appendChild(el)

    el.addEventListener('click', () => {
      const rect = el.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()
      createSparkles(game, rect.left - gameRect.left, rect.top - gameRect.top)

      if (isShark) {
        miss++
        timeLeft = Math.max(0, timeLeft - 2)
      } else {
        fish++
      }

      update()
      el.remove()
    })

    setTimeout(() => el.remove(), 2000)
  }

  const spawnTimer = setInterval(spawn, 600)

  const timer = setInterval(() => {
    timeLeft--
    update()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(spawnTimer)

      const power = 10 + fish * 3 - miss * 2
      onFinish(Math.max(5, power))
    }
  }, 1000)

  update()
}