import './style.css'
import { addColorPower } from './state.js'
import {
  renderHomeLayout,
  renderGameLayout,
  showJourneyResult,
} from './ui.js'

import { startStarCourse } from './courses/starCourse.js'
import { startGhostCourse } from './courses/ghostCourse.js'
import { startBalloonCourse } from './courses/balloonCourse.js'
import { startJewelCourse } from './courses/jewelCourse.js'
import { startFishCourse } from './courses/fishCourse.js'
import { startFruitCourse } from './courses/fruitCourse.js'
import { startRabbitCourse } from './courses/rabbitCourse.js'
import { startNumberCourse } from './courses/numberCourse.js'
import { startTargetCourse } from './courses/targetCourse.js'
import { startGermCourse } from './courses/germCourse.js'

const courses = [
  { name: 'ほしあつめ', icon: '⭐', start: startStarCourse },
  { name: 'おばけかくれんぼ', icon: '👻', start: startGhostCourse },
  { name: 'ふうせんタップ', icon: '🎈', start: startBalloonCourse },
  { name: 'ほうせきさがし', icon: '💎', start: startJewelCourse },
  { name: 'さかなタップ', icon: '🐟', start: startFishCourse },
  { name: 'フルーツキャッチ', icon: '🍎', start: startFruitCourse },
  { name: 'うさぎジャンプ', icon: '🐰', start: startRabbitCourse },
  { name: 'すうじタッチ', icon: '🔢', start: startNumberCourse },
  { name: 'まとあて', icon: '🎯', start: startTargetCourse },
  { name: 'ばいきんけし', icon: '🧼', start: startGermCourse },
]

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

function showHome() {
  renderHomeLayout(`
    <div class="card">
      <h2>まちに いろを もどそう！</h2>

      <button class="main-button" id="restoreColorButton">
        🎨 いろをとりもどす
      </button>

      <button class="sub-button" id="playCourseButton">
        🎮 コースをあそぶ
      </button>

      <p class="hint">「いろをとりもどす」は、3つのコースにチャレンジするよ。</p>
      <p class="hint">「コースをあそぶ」は、すきなコースをえらべるよ。</p>
    </div>
  `)

  document.querySelector('#restoreColorButton').addEventListener('click', () => {
    showJourneyPreview()
  })

  document.querySelector('#playCourseButton').addEventListener('click', () => {
    showCourseSelect()
  })
}

function showCourseSelect() {
  renderHomeLayout(`
    <div class="card">
      <h2>コースをえらぼう！</h2>

      <div class="course-grid">
        ${courses
          .map(
            (course, index) => `
              <button class="course-select-button" data-course-index="${index}">
                <div class="course-select-icon">${course.icon}</div>
                <div class="course-select-name">${course.name}</div>
              </button>
            `
          )
          .join('')}
      </div>

      <button id="backHomeButton">ホームにもどる</button>
    </div>
  `)

  document.querySelectorAll('.course-select-button').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.courseIndex)
      playSingleCourse(courses[index])
    })
  })

  document.querySelector('#backHomeButton').addEventListener('click', showHome)
}

function playSingleCourse(course) {
  course.start({
    courseNumber: 1,
    totalCourses: 1,
    onFinish: (power) => {
      renderGameLayout(`
        <div class="card course-result-card">
          <div class="big-emoji">${course.icon}</div>
          <h2>${course.name} おしまい！</h2>
          <p class="reward-color">いろパワー +${power}</p>

          <button class="main-button" id="playAgainButton">
            もういちど
          </button>

          <button id="backCourseSelectButton">
            コースをえらぶ
          </button>

          <button id="backHomeButton">
            ホームにもどる
          </button>
        </div>
      `)

      document.querySelector('#playAgainButton').addEventListener('click', () => {
        playSingleCourse(course)
      })

      document
        .querySelector('#backCourseSelectButton')
        .addEventListener('click', showCourseSelect)

      document.querySelector('#backHomeButton').addEventListener('click', showHome)
    },
  })
}

function pickJourneyCourses() {
  return shuffle(courses).slice(0, 3)
}

function showJourneyPreview() {
  const journeyCourses = pickJourneyCourses()

  renderHomeLayout(`
    <div class="card">
      <h2>この3つにチャレンジ！</h2>

      <div class="journey-preview">
        ${journeyCourses
          .map(
            (course, index) => `
              <div class="journey-course">
                <div class="journey-number">${index + 1}</div>
                <div class="journey-icon">${course.icon}</div>
                <div class="journey-name">${course.name}</div>
              </div>
            `
          )
          .join('')}
      </div>

      <button class="main-button" id="startJourneyButton">
        はじめる！
      </button>

      <button id="backHomeButton">
        やっぱりやめる
      </button>
    </div>
  `)

  document.querySelector('#startJourneyButton').addEventListener('click', () => {
    playJourneyCourse(journeyCourses, 0, 0)
  })

  document.querySelector('#backHomeButton').addEventListener('click', showHome)
}

function playJourneyCourse(journeyCourses, index, totalPower) {
  if (index >= journeyCourses.length) {
    const unlockedColors = addColorPower(totalPower)
    showJourneyResult(totalPower, unlockedColors, showHome)
    return
  }

  const course = journeyCourses[index]

  course.start({
    courseNumber: index + 1,
    totalCourses: journeyCourses.length,
    onFinish: (power) => {
      showCourseResult({
        course,
        power,
        nextIndex: index + 1,
        totalCourses: journeyCourses.length,
        onNext: () => {
          playJourneyCourse(journeyCourses, index + 1, totalPower + power)
        },
      })
    },
  })
}

function showCourseResult({ course, power, nextIndex, totalCourses, onNext }) {
  const isLast = nextIndex >= totalCourses

  renderGameLayout(`
    <div class="card course-result-card">
      <div class="big-emoji">${course.icon}</div>
      <h2>${course.name} おしまい！</h2>
      <p class="reward-color">いろパワー +${power}</p>
      <p>${nextIndex} / ${totalCourses} コース おわったよ</p>

      <button class="main-button" id="nextCourseButton">
        ${isLast ? 'けっかをみる' : 'つぎのコースへ'}
      </button>
    </div>
  `)

  document.querySelector('#nextCourseButton').addEventListener('click', onNext)
}

showHome()