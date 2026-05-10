export const state = {
  coins: 0,
  level: 1,
  exp: 0,
}

export function addReward(coins, exp) {
  state.coins += coins
  state.exp += exp

  while (state.exp >= 10) {
    state.exp -= 10
    state.level++
  }
}