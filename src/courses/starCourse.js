import { renderLayout, showResult, createSparkles } from '../ui.js'

export function startStarCourse(showHome) {
  let timeLeft = 30
  let score = 0
  let combo = 0
  let gameOver = false
  let starSpeed = 700
  let trickyChance = 0.1

  renderLayout(`
    <div class="card">
      <h2>⭐ きらきらほしあつめ</h2>
      <p>てんすう: <b id="score">0</b> / コンボ: <b id="combo">0</b></p>
      <p>のこりじかん: <b id="time">30</b>びょう</p>
      <div id="message">⭐をあつめよう！😈はさわらないでね</div>
      <div id="game"></div>
    </div>
  `)

  const game = document.querySelector('#game')
  const message = document.querySelector('#message')

  function updateGameUI() {
    document.querySelector('#score').textContent = score
    document.querySelector('#combo').textContent = combo
    document.querySelector('#time').textContent = timeLeft
  }

  function createStar() {
    if (gameOver) return

    const star = document.createElement('div')
    const random = Math.random()

    let type = 'normal'
    if (random < trickyChance) type = 'fake'
    else if (random < trickyChance + 0.12) type = 'rare'

    star.textContent = type === 'fake' ? '😈' : type === 'rare' ? '🌈' : '⭐'

    star.style.position = 'absolute'
    star.style.fontSize = '48px'
    star.style.cursor = 'pointer'
    star.style.left = Math.random() * 85 + '%'
    star.style.top = Math.random() * 85 + '%'
    star.style.transition = 'all 0.5s'
    star.style.userSelect = 'none'

    game.appendChild(star)

    const move = setInterval(() => {
      star.style.left = Math.random() * 85 + '%'
      star.style.top = Math.random() * 85 + '%'
    }, starSpeed)

    if (Math.random() < 0.12 && type === 'normal') {
      setTimeout(() => {
        if (star.parentNode) {
          star.textContent = '😈'
          type = 'fake'
        }
      }, 1400)
    }

    star.addEventListener('click', () => {
      const rect = star.getBoundingClientRect()
      const gameRect = game.getBoundingClientRect()

      createSparkles(game, rect.left - gameRect.left, rect.top - gameRect.top)

      star.style.transform = 'scale(1.4) rotate(15deg)'

      if (type === 'fake') {
        score = Math.max(0, score - 3)
        combo = 0
        message.textContent = '😈 いたずらぼしだった！'
      } else if (type === 'rare') {
        score += 5 + combo
        combo++
        message.textContent = '🌈 レアぼしゲット！'
      } else {
        score += 1 + combo
        combo++
        message.textContent = combo >= 5 ? `🔥 ${combo}コンボ！` : '⭐ いいね！'
      }

      starSpeed = Math.max(320, starSpeed - 8)
      trickyChance = Math.min(0.3, trickyChance + 0.002)

      updateGameUI()
      clearInterval(move)

      setTimeout(() => star.remove(), 120)
    })

    setTimeout(() => {
      clearInterval(move)
      if (star.parentNode) star.remove()
    }, 2500)
  }

  const starTimer = setInterval(createStar, 650)

  const timer = setInterval(() => {
    timeLeft--
    updateGameUI()

    if (timeLeft <= 0) {
      gameOver = true
      clearInterval(timer)
      clearInterval(starTimer)

      const rewardCoins = Math.max(5, Math.floor(score / 2))
      const rewardExp = Math.max(2, Math.floor(score / 10))

      showResult('⭐ ほしあつめクリア！', rewardCoins, rewardExp, showHome)
    }
  }, 1000)

  updateGameUI()
}