export const colorPieces = [
  { key: 'red', name: 'あか', emoji: '🔴', target: 'やね' },
  { key: 'blue', name: 'あお', emoji: '🔵', target: 'そら' },
  { key: 'yellow', name: 'きいろ', emoji: '🟡', target: 'あかり' },
  { key: 'green', name: 'みどり', emoji: '🟢', target: 'き' },
  { key: 'purple', name: 'むらさき', emoji: '🟣', target: 'ふく' },
]

const SAVE_KEY = 'color-town-save-v1'

const defaultState = {
  colorPower: 0,
  colors: {
    red: false,
    blue: false,
    yellow: false,
    green: false,
    purple: false,
  },
}

export const state = loadState()

function loadState() {
  const savedText = localStorage.getItem(SAVE_KEY)

  if (!savedText) {
    return structuredClone(defaultState)
  }

  try {
    const saved = JSON.parse(savedText)

    return {
      colorPower: saved.colorPower ?? defaultState.colorPower,
      colors: {
        red: saved.colors?.red ?? false,
        blue: saved.colors?.blue ?? false,
        yellow: saved.colors?.yellow ?? false,
        green: saved.colors?.green ?? false,
        purple: saved.colors?.purple ?? false,
      },
    }
  } catch {
    return structuredClone(defaultState)
  }
}

export function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state))
}

export function resetState() {
  state.colorPower = 0
  state.colors.red = false
  state.colors.blue = false
  state.colors.yellow = false
  state.colors.green = false
  state.colors.purple = false
  saveState()
}

export function getColorCount() {
  return Object.values(state.colors).filter(Boolean).length
}

export function isStoryComplete() {
  return getColorCount() === colorPieces.length
}

export function getWorldMessage() {
  const count = getColorCount()

  const messages = [
    'いろをなくした まちだよ',
    'やねに いろが もどった！',
    'そらに いろが もどった！',
    'あかりが ついた！',
    'きが げんきに なった！',
    'まちが カラフルに なった！',
  ]

  return messages[count]
}

export function getRandomMissingColor() {
  const missing = colorPieces.filter((piece) => !state.colors[piece.key])

  if (missing.length === 0) {
    return null
  }

  return missing[Math.floor(Math.random() * missing.length)]
}

export function addColorPower(amount) {
  state.colorPower += amount

  const unlockedColors = []

  while (state.colorPower >= 100 && !isStoryComplete()) {
    state.colorPower -= 100

    const color = getRandomMissingColor()
    if (!color) break

    state.colors[color.key] = true
    unlockedColors.push(color)
  }

  if (isStoryComplete()) {
    state.colorPower = 100
  }

  saveState()

  return unlockedColors
}