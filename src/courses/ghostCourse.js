import { renderLayout, showResult } from '../ui.js'

export function startGhostCourse(showHome) {
  let timeLeft = 30
  let ghostsFound = 0
  let targetGhosts = 3
  let rewardScore = 0
  let gameOver = false

  renderLayout(`
    <div class="card">
      <h2>👻 おばけかくれんぼ</h2>
      <p>みつけたおばけ: <b id="ghostsFound">0</b> / ${targetGhosts}</p>
      <p>のこりじかん: <b id="time">30</b>びょう</p>
      <div id="message">☁️のなかのおばけをみつけよう！</div>
      <div id="cloudGame"></div>
    </div>
  `)

  const cloudGame = document.querySelector('#cloudGame')
  const message = document.querySelector('#message')

  function updateGhostUI() {
    document.querySelector('#ghostsFound').textContent = ghostsFound
    document.querySelector('#time').textContent = timeLeft
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
          rewardScore += 15
          message.textContent = '🌈 レアおばけみっけ！'
        } else if (isGhost) {
          cloud.textContent = '👻'
          ghostsFound++
          rewardScore += 5
          message.textContent = '👻 おばけみっけ！'
        } else {
          cloud.textContent = '💨'
          timeLeft = Math.max(0, timeLeft - 1)
          message.textContent = 'あれれ？いなかった！'
        }

        cloud.disabled = true
        updateGhostUI()

        if (ghostsFound >= targetGhosts) {
          gameOver = true
          showResult('👻 おばけかくれんぼクリア！', Math.max(5, rewardScore), 5, showHome)
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
      gameOver = true
      clearInterval(timer)

      showResult('⏰ おばけさがしおしまい！', Math.max(3, Math.floor(rewardScore / 2)), 2, showHome)
    }
  }, 1000)

  createCloudRound()
  updateGhostUI()
}