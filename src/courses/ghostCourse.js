import { renderGameLayout } from '../ui.js'

export function startGhostCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let ghostsFound = 0
  const targetGhosts = 3
  let mistakes = 0
  let gameOver = false

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>👻 おばけかくれんぼ</h2>
      <p>みつけたおばけ: <b id="ghostsFound">0</b> / ${targetGhosts}</p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">☁️のなかのおばけを${targetGhosts}びき みつけよう！</div>
      <div id="cloudGame"></div>
    </div>
  `)

  const cloudGame = document.querySelector('#cloudGame')
  const message = document.querySelector('#message')

  function updateGhostUI() {
    document.querySelector('#ghostsFound').textContent = ghostsFound
    document.querySelector('#time').textContent = timeLeft
  }

  function finishCourse() {
    if (gameOver) return
    gameOver = true
    clearInterval(timer)

    const power = Math.max(10, 35 + ghostsFound * 8 - mistakes * 3 + timeLeft)
    onFinish(Math.min(55, power))
  }

  function createCloudRound() {
    if (gameOver) return

    cloudGame.innerHTML = ''

    const cloudCount = 16
    const ghostIndex = Math.floor(Math.random() * cloudCount)
    const rareGhostIndex =
      Math.random() < 0.2 ? Math.floor(Math.random() * cloudCount) : -1

    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('button')
      cloud.textContent = '☁️'
      cloud.className = 'cloud-button'

      cloud.addEventListener('click', () => {
        if (gameOver) return

        const isGhost = i === ghostIndex
        const isRareGhost = i === rareGhostIndex && rareGhostIndex !== ghostIndex

        if (isRareGhost) {
          cloud.textContent = '🌈👻'
          ghostsFound++
          message.textContent = '🌈 レアおばけみっけ！'
        } else if (isGhost) {
          cloud.textContent = '👻'
          ghostsFound++
          message.textContent = '👻 おばけみっけ！'
        } else {
          cloud.textContent = '💨'
          mistakes++
          timeLeft = Math.max(0, timeLeft - 1)
          message.textContent = 'あれれ？いなかった！'
        }

        cloud.disabled = true
        updateGhostUI()

        if (ghostsFound >= targetGhosts) {
          setTimeout(finishCourse, 250)
          return
        }

        setTimeout(createCloudRound, 700)
      })

      cloudGame.appendChild(cloud)
    }
  }

  const timer = setInterval(() => {
    if (gameOver) return

    timeLeft--
    updateGhostUI()

    if (timeLeft <= 0) {
      finishCourse()
    }
  }, 1000)

  createCloudRound()
  updateGhostUI()
}