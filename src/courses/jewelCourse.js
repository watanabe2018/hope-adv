import { renderGameLayout, createSparkles } from '../ui.js'

export function startJewelCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let jewelsFound = 0
  let mistakes = 0
  let gameOver = false
  const targetJewels = 5

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>💎 ほうせきさがし</h2>
      <p>みつけたほうせき: <b id="jewelsFound">0</b> / ${targetJewels}</p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">すなの中から💎をみつけよう！</div>
      <div id="jewelGame"></div>
    </div>
  `)

  const jewelGame = document.querySelector('#jewelGame')
  const message = document.querySelector('#message')

  function updateUI() {
    document.querySelector('#jewelsFound').textContent = jewelsFound
    document.querySelector('#time').textContent = timeLeft
  }

  function finishCourse() {
    if (gameOver) return
    gameOver = true
    clearInterval(timer)

    const power = Math.max(10, 20 + jewelsFound * 8 - mistakes * 3 + timeLeft)
    onFinish(Math.min(55, power))
  }

  function createRound() {
    if (gameOver) return

    jewelGame.innerHTML = ''

    const cellCount = 20
    const jewelIndex = Math.floor(Math.random() * cellCount)
    const rareIndex = Math.random() < 0.18 ? Math.floor(Math.random() * cellCount) : -1

    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('button')
      cell.textContent = '🟫'
      cell.className = 'jewel-cell'

      cell.addEventListener('click', () => {
        if (gameOver) return

        const isRare = i === rareIndex && rareIndex !== jewelIndex
        const isJewel = i === jewelIndex

        if (isRare) {
          cell.textContent = '🌈'
          jewelsFound += 2
          message.textContent = '🌈 レアほうせきみっけ！'
        } else if (isJewel) {
          cell.textContent = '💎'
          jewelsFound++
          message.textContent = '💎 ほうせきみっけ！'
        } else {
          cell.textContent = '🪨'
          mistakes++
          timeLeft = Math.max(0, timeLeft - 1)
          message.textContent = 'いしだった！'
        }

        const rect = cell.getBoundingClientRect()
        const gameRect = jewelGame.getBoundingClientRect()
        createSparkles(jewelGame, rect.left - gameRect.left, rect.top - gameRect.top)

        cell.disabled = true
        updateUI()

        if (jewelsFound >= targetJewels) {
          setTimeout(finishCourse, 250)
          return
        }

        setTimeout(createRound, 650)
      })

      jewelGame.appendChild(cell)
    }
  }

  const timer = setInterval(() => {
    if (gameOver) return

    timeLeft--
    updateUI()

    if (timeLeft <= 0) {
      finishCourse()
    }
  }, 1000)

  createRound()
  updateUI()
}