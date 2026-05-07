const app = document.querySelector('#app')

let coins = 0
let timeLeft = 30
let combo = 0
let level = 1
let exp = 0
let gameOver = false

let ownedItems = []
let equippedItem = 'ふつうの服'

const shopItems = [
  { name: 'ピンクドレス', price: 10 },
  { name: '星のぼうし', price: 15 },
  { name: 'にじの羽', price: 25 },
]

app.innerHTML = `
  <h1>キラキラ星あつめ</h1>

  <div id="status">
    <p>レベル: <span id="level">1</span></p>
    <p>けいけんち: <span id="exp">0</span> / 10</p>
    <p>コイン: <span id="coins">0</span></p>
    <p>コンボ: <span id="combo">0</span></p>
    <p>いまの服: <span id="equipped">ふつうの服</span></p>
    <p>のこり時間: <span id="time">30</span>秒</p>
  </div>

  <button id="shopButton">ショップをひらく</button>

  <div id="shop" style="display:none;">
    <h2>ショップ</h2>
    <div id="shopItems"></div>
  </div>

  <div id="message">⭐をあつめよう！💀はさわらないでね</div>
  <div id="game"></div>
`

const game = document.querySelector('#game')
const message = document.querySelector('#message')
const shop = document.querySelector('#shop')
const shopButton = document.querySelector('#shopButton')
const shopItemsArea = document.querySelector('#shopItems')

game.style.position = 'relative'
game.style.width = '100%'
game.style.height = '500px'
game.style.border = '3px solid pink'
game.style.overflow = 'hidden'
game.style.background = '#fff0f5'

message.style.fontSize = '22px'
message.style.fontWeight = 'bold'
message.style.color = '#ff69b4'
message.style.margin = '12px'

shop.style.background = '#fff'
shop.style.border = '3px solid #ff9ed2'
shop.style.borderRadius = '20px'
shop.style.padding = '16px'
shop.style.margin = '16px 0'

function updateUI() {
  document.querySelector('#coins').textContent = coins
  document.querySelector('#combo').textContent = combo
  document.querySelector('#time').textContent = timeLeft
  document.querySelector('#level').textContent = level
  document.querySelector('#exp').textContent = exp
  document.querySelector('#equipped').textContent = equippedItem
  renderShop()
}

function addExp(amount) {
  exp += amount

  if (exp >= 10) {
    exp = exp - 10
    level++
    message.textContent = `🎉 レベル${level}にアップ！`
  }
}

function renderShop() {
  shopItemsArea.innerHTML = ''

  shopItems.forEach((item) => {
    const itemBox = document.createElement('div')
    itemBox.style.margin = '12px'
    itemBox.style.padding = '12px'
    itemBox.style.border = '2px solid pink'
    itemBox.style.borderRadius = '16px'

    const isOwned = ownedItems.includes(item.name)

    itemBox.innerHTML = `
      <strong>${item.name}</strong><br>
      ${isOwned ? 'もってるよ！' : `${item.price} コイン`}
    `

    const button = document.createElement('button')

    if (isOwned) {
      button.textContent = 'きる'
      button.addEventListener('click', () => {
        equippedItem = item.name
        message.textContent = `${item.name}をきたよ！`
        updateUI()
      })
    } else {
      button.textContent = 'かう'
      button.addEventListener('click', () => {
        if (coins >= item.price) {
          coins -= item.price
          ownedItems.push(item.name)
          equippedItem = item.name
          message.textContent = `${item.name}をかったよ！`
        } else {
          message.textContent = 'コインがたりないよ！'
        }

        updateUI()
      })
    }

    itemBox.appendChild(document.createElement('br'))
    itemBox.appendChild(button)
    shopItemsArea.appendChild(itemBox)
  })
}

shopButton.addEventListener('click', () => {
  if (shop.style.display === 'none') {
    shop.style.display = 'block'
    shopButton.textContent = 'ショップをとじる'
  } else {
    shop.style.display = 'none'
    shopButton.textContent = 'ショップをひらく'
  }
})

function createStar() {
  if (gameOver) return

  const star = document.createElement('div')
  const random = Math.random()
  const type = random < 0.2 ? 'fake' : random < 0.3 ? 'rare' : 'normal'

  star.textContent = type === 'fake' ? '💀' : type === 'rare' ? '🌈' : '⭐'

  star.style.position = 'absolute'
  star.style.fontSize = '46px'
  star.style.cursor = 'pointer'
  star.style.left = Math.random() * 90 + '%'
  star.style.top = Math.random() * 90 + '%'
  star.style.transition = 'all 0.4s'
  star.style.filter = 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))'

  const move = setInterval(() => {
    star.style.left = Math.random() * 90 + '%'
    star.style.top = Math.random() * 90 + '%'
  }, 600)

  star.addEventListener('click', () => {
    star.style.transform = 'scale(1.5) rotate(20deg)'

    if (type === 'fake') {
      coins -= 3
      combo = 0
      message.textContent = 'あっ！ニセ星だった！'
    } else if (type === 'rare') {
      coins += 5 + combo
      combo++
      addExp(3)
      message.textContent = '🌈 レア星ゲット！'
    } else {
      coins += 1 + combo
      combo++
      addExp(1)
      message.textContent = '⭐ いいね！'
    }

    updateUI()
    clearInterval(move)

    setTimeout(() => {
      star.remove()
    }, 150)
  })

  game.appendChild(star)

  setTimeout(() => {
    clearInterval(move)
    star.remove()
  }, 2000)
}

const starTimer = setInterval(() => {
  if (timeLeft > 0) {
    createStar()
  }
}, 600)

const timer = setInterval(() => {
  timeLeft--
  updateUI()

  if (timeLeft <= 0) {
    gameOver = true
    clearInterval(timer)
    clearInterval(starTimer)
    message.textContent = `ゲーム終了！ コイン${coins}まい、レベル${level}！`
  }
}, 1000)

updateUI()