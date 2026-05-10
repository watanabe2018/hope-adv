import { renderGameLayout, createSparkles } from '../ui.js'

export function startGhostCourse({ courseNumber, totalCourses, onFinish }) {
  let timeLeft = 25
  let ghostsFound = 0
  let mistakes = 0
  let combo = 0
  let gameOver = false
  let canChoose = false

  const targetGhosts = 3

  const hidingIcons = ['☁️', '🌙', '⭐', '🌸', '🍄', '🎈', '🫧', '🍀', '🌼', '🪐', '💫', '🌂']

  renderGameLayout(`
    <div class="card">
      <p class="course-count">コース ${courseNumber} / ${totalCourses}</p>
      <h2>👻 おばけかくれんぼ</h2>
      <p>みつけたおばけ: <b id="ghostsFound">0</b> / ${targetGhosts}</p>
      <p>コンボ: <b id="combo">0</b></p>
      <p>のこりじかん: <b id="time">25</b>びょう</p>
      <div id="message">おばけが どこにいるか おぼえよう！</div>
      <div id="cloudGame"></div>
    </div>
  `)

  const cloudGame = document.querySelector('#cloudGame')
  const message = document.querySelector('#message')

  function updateUI() {
    document.querySelector('#ghostsFound').textContent = ghostsFound
    document.querySelector('#combo').textContent = combo
    document.querySelector('#time').textContent = timeLeft
  }

  function showFloatingText(text, x, y, color = '#ff69b4') {
    const effect = document.createElement('div')
    effect.textContent = text
    effect.style.position = 'absolute'
    effect.style.left = x + 'px'
    effect.style.top = y + 'px'
    effect.style.fontSize = '28px'
    effect.style.fontWeight = 'bold'
    effect.style.color = color
    effect.style.pointerEvents = 'none'
    effect.style.transition = 'all 0.75s ease-out'
    effect.style.zIndex = '20'

    cloudGame.appendChild(effect)

    requestAnimationFrame(() => {
      effect.style.transform = 'translateY(-55px) scale(1.2)'
      effect.style.opacity = '0'
    })

    setTimeout(() => effect.remove(), 800)
  }

  function showMissEffect(button) {
    button.classList.add('miss-shake')
    button.textContent = '💨'

    setTimeout(() => {
      button.classList.remove('miss-shake')
    }, 400)
  }

  function shufflePositions(buttons, shuffleDuration) {
    const positions = buttons.map((button) => ({
      left: button.offsetLeft,
      top: button.offsetTop,
    }))

    const shuffled = [...buttons].sort(() => Math.random() - 0.5)

    shuffled.forEach((button, newIndex) => {
      const oldIndex = buttons.indexOf(button)
      const oldPos = positions[oldIndex]
      const newPos = positions[newIndex]

      const dx = oldPos.left - newPos.left
      const dy = oldPos.top - newPos.top

      button.style.transition = 'none'
      button.style.transform = `translate(${dx}px, ${dy}px)`
      button.style.order = newIndex
    })

    requestAnimationFrame(() => {
      shuffled.forEach((button) => {
        button.style.transition = `transform ${shuffleDuration}ms ease-in-out`
        button.style.transform = 'translate(0, 0)'
      })
    })
  }

  function getDifficultySetting() {
    const random = Math.random()

    if (random < 0.3) {
      return {
        label: 'かんたん',
        cloudCount: 9,
        peekTime: 1300,
        shuffleDuration: 800,
        shuffleCount: 1,
      }
    }

    if (random < 0.75) {
      return {
        label: 'ふつう',
        cloudCount: 12,
        peekTime: 950,
        shuffleDuration: 650,
        shuffleCount: 2,
      }
    }

    return {
      label: 'むずかしい',
      cloudCount: 12,
      peekTime: 650,
      shuffleDuration: 480,
      shuffleCount: 3,
    }
  }

  function createRound() {
    if (gameOver) return

    canChoose = false
    cloudGame.innerHTML = ''

    const setting = getDifficultySetting()
    const ghostIndex = Math.floor(Math.random() * setting.cloudCount)
    const icons = [...hidingIcons]
      .sort(() => Math.random() - 0.5)
      .slice(0, setting.cloudCount)

    const buttons = []

    message.textContent = `👀 ${setting.label}！おばけを よくみてね`

    for (let i = 0; i < setting.cloudCount; i++) {
      const button = document.createElement('button')
      const icon = icons[i]

      button.className = 'cloud-button memory-cloud'
      button.dataset.hasGhost = i === ghostIndex ? 'true' : 'false'
      button.dataset.icon = icon

      if (i === ghostIndex) {
        button.innerHTML = `
          <span class="peek-ghost">👻</span>
          <span class="hide-icon">${icon}</span>
        `
      } else {
        button.textContent = icon
      }

      button.addEventListener('click', () => {
        if (gameOver) return

        if (!canChoose) {
          message.textContent = 'まだだよ！うごいてから えらんでね'
          return
        }

        canChoose = false

        const rect = button.getBoundingClientRect()
        const gameRect = cloudGame.getBoundingClientRect()
        const x = rect.left - gameRect.left
        const y = rect.top - gameRect.top

        const isGhost = button.dataset.hasGhost === 'true'

        if (isGhost) {
          ghostsFound++
          combo++
          button.textContent = '👻'
          button.classList.add('hit-pop')
          message.textContent = combo >= 2 ? `👻 みっけ！${combo}コンボ！` : '👻 おばけみっけ！'

          showFloatingText('+10', x + 12, y, '#ff69b4')
          createSparkles(cloudGame, x + 24, y + 24)
        } else {
          mistakes++
          combo = 0
          timeLeft = Math.max(0, timeLeft - 2)
          message.textContent = 'あれれ？そこじゃなかった！'
          showMissEffect(button)
          showFloatingText('-2びょう', x, y, '#777')
        }

        updateUI()

        if (ghostsFound >= targetGhosts) {
          setTimeout(finishCourse, 750)
          return
        }

        setTimeout(createRound, 900)
      })

      buttons.push(button)
      cloudGame.appendChild(button)
    }

    setTimeout(() => {
      if (gameOver) return

      buttons.forEach((button) => {
        button.textContent = button.dataset.icon
      })

      message.textContent = `🌀 ${setting.shuffleCount}かい うごくよ！`
    }, setting.peekTime)

    let shuffleIndex = 0

    function runShuffle() {
      if (gameOver) return

      shuffleIndex++
      shufflePositions(buttons, setting.shuffleDuration)

      if (shuffleIndex < setting.shuffleCount) {
        setTimeout(runShuffle, setting.shuffleDuration + 180)
      } else {
        setTimeout(() => {
          if (gameOver) return
          message.textContent = 'おばけが かくれたアイコンは どれ？'
          canChoose = true
        }, setting.shuffleDuration + 120)
      }
    }

    setTimeout(runShuffle, setting.peekTime + 350)
  }

  function finishCourse() {
    if (gameOver) return
    gameOver = true
    clearInterval(timer)

    const power = Math.max(8, 20 + ghostsFound * 10 + combo * 4 - mistakes * 5 + timeLeft)
    onFinish(Math.min(60, power))
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