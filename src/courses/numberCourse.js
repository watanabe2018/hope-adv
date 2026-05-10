import { renderGameLayout, createSparkles } from '../ui.js'

export function startNumberCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let correct = 0
  let mistakes = 0
  let targetNumber = 1
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>🔢 すうじタッチ</h2>
      <div class="number-target-box">
        <div class="number-target-label">これをタップ！</div>
        <div id="numberTarget" class="number-target">1</div>
      </div>
      <p>せいかい: <b id="correct">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="numberGame"></div>
    </div>
  `)

  const numberGame = document.querySelector('#numberGame')

  function updateUI() {
    document.querySelector('#numberTarget').textContent = targetNumber
    document.querySelector('#correct').textContent = correct
    document.querySelector('#time').textContent = timeLeft
  }

  function createRound() {
    if (gameOver) return

    numberGame.innerHTML = ''
    targetNumber = Math.floor(Math.random() * 9) + 1

    const numbers = []
    for (let i = 0; i < 12; i++) {
      numbers.push(Math.floor(Math.random() * 9) + 1)
    }

    numbers[Math.floor(Math.random() * numbers.length)] = targetNumber

    numbers.forEach((number) => {
      const button = document.createElement('button')
      button.textContent = number
      button.className = 'number-button'
      button.style.position = 'relative'
      button.style.transition = 'transform 0.6s ease'

      button.addEventListener('click', () => {
        const rect = button.getBoundingClientRect()
        const gameRect = numberGame.getBoundingClientRect()
        createSparkles(numberGame, rect.left - gameRect.left, rect.top - gameRect.top)

        if (number === targetNumber) {
          correct++
          createRound()
        } else {
          mistakes++
          timeLeft = Math.max(0, timeLeft - 1)
        }

        updateUI()
      })

      numberGame.appendChild(button)
      const moveTimer = setInterval(() => {
        if (gameOver || !button.parentNode) {
          clearInterval(moveTimer)
          return
        }

        const x = -20 + Math.random() * 40
        const y = -16 + Math.random() * 32
        button.style.transform = `translate(${x}px, ${y}px)`
      }, 700)
    })

    updateUI()
  }

  const timer = setInterval(() => {
    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)

      const power = Math.max(8, 10 + correct * 6 - mistakes * 3)
      onFinish(Math.min(55, power))
    }
  }, 1000)

  createRound()
}