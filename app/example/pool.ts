import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const table: any[] = []

for (let i = 0; i < 256; i++) {
  table.push({
    ip: `192.168.1.${i}`,
    suffix: `${i}`,
  })
}

const container = document.querySelector('#root') as HTMLDivElement

// container.addEventListener('click', function (e) {
//   console.log('table[i]', e.target)
// })

const { width, height } = container.getBoundingClientRect()

container.innerHTML = `
  <style>
    #root {
      background-color: #000000;
    }
    a {
      color: #8ff;
    }

    #menu {
      position: absolute;
      bottom: 20px;
      width: 100%;
      text-align: center;
    }

    .item {
      width: 120px;
      height: 160px;
      box-shadow: 0px 0px 12px rgba(0,255,255,0.5);
      border: 1px solid rgba(127,255,255,0.25);
      font-family: Helvetica, sans-serif;
      text-align: center;
      line-height: normal;
      cursor: default;
      border-radius: 4px;
    }

    .item:hover {
      box-shadow: 0px 0px 12px rgba(0,255,255,0.75);
      border: 1px solid rgba(127,255,255,0.75);
    }

    .item strong {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 22px;
      color: rgba(127,255,255,0.75);
    }

    .item symbol {
      position: absolute;
      top: 40px;
      left: 0px;
      right: 0px;
      font-size: 60px;
      font-weight: bold;
      color: rgba(255,255,255,0.75);
      text-shadow: 0 0 10px rgba(0,255,255,0.95);
    }

    .item .details {
      position: absolute;
      bottom: 15px;
      left: 0px;
      right: 0px;
      font-size: 12px;
      color: rgba(127,255,255,0.75);
    }

    button {
      color: rgba(127,255,255,0.75);
      background: transparent;
      outline: 1px solid rgba(127,255,255,0.75);
      border: 0px;
      padding: 5px 10px;
      cursor: pointer;
    }

    button:hover {
      background-color: rgba(0,255,255,0.5);
    }

    button:active {
      color: #000000;
      background-color: rgba(0,255,255,0.75);
    }
  </style>
  <div id="container"></div>
  <div id="menu">
    <button id="table">平面</button>
    <button id="sphere">球形</button>
    <button id="ring">圆环</button>
    <button id="helix">螺旋</button>
    <button id="grid">方块</button>
  </div>
`

console.log('container', container)

let camera: any
let scene: any
let renderer: any
let controls: any

const objects: any[] = []
const targets: any = { table: [], sphere: [], helix: [], grid: [], ring: [] }

init()
animate()

function handleClickObject(e: any, a: any, b: any) {
  console.log('e, a, b', e, a, b)
}

function init() {
  camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000)
  camera.position.z = 3200

  scene = new THREE.Scene()

  // table
  for (let i = 0; i < table.length; i++) {
    const element = document.createElement('div')
    element.className = 'item'
    element.style.backgroundColor =
      'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')'

    // element.addEventListener('click', (e) => {
    //   console.log('e', e)
    // })

    const ip = document.createElement('strong')
    ip.textContent = `${table[i].suffix}`
    element.appendChild(ip)

    // const symbol = document.createElement('div')
    // symbol.className = 'symbol'
    // symbol.textContent = table[i] as string
    // element.appendChild(symbol)

    const details = document.createElement('div')
    details.className = 'details'
    details.innerHTML = table[i].ip
    element.appendChild(details)

    const objectCSS = new CSS3DObject(element)
    objectCSS.position.x = Math.random() * 4000 - 2000
    objectCSS.position.y = Math.random() * 4000 - 2000
    objectCSS.position.z = Math.random() * 4000 - 2000

    element.addEventListener('pointerdown', (e) => {
      console.log(table[i].ip)
    })

    scene.add(objectCSS)

    objects.push(objectCSS)

    //

    const object = new THREE.Object3D()
    object.position.x = (i % 32) * 140 - 2100
    object.position.y = -Math.floor(i / 32) * 180 + 720

    console.log('object', object)

    targets.table.push(object)
  }

  // sphere

  const vector = new THREE.Vector3()

  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = Math.acos(-1 + (2 * i) / l)
    const theta = Math.sqrt(l * Math.PI) * phi

    if (i === 0) {
      console.log('phi, theta', phi, theta)
    }

    const object = new THREE.Object3D()

    object.position.setFromSphericalCoords(1200, phi, theta)

    vector.copy(object.position).multiplyScalar(2)

    object.lookAt(vector)

    targets.sphere.push(object)
  }

  // helix

  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = i * 0.175 + Math.PI
    const y = -(i * 8) + 720

    const object = new THREE.Object3D()

    object.position.setFromCylindricalCoords(900, theta, y)

    vector.x = object.position.x * 2
    vector.y = object.position.y
    vector.z = object.position.z * 2

    object.lookAt(vector)

    targets.helix.push(object)
  }

  // grid

  for (let i = 0; i < objects.length; i++) {
    const object = new THREE.Object3D()

    object.position.x = (i % 5) * 400 - 800
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800
    object.position.z = Math.floor(i / 25) * 1000 - 2000

    targets.grid.push(object)
  }

  // ring

  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = (i % 64) * 0.098 + Math.PI
    const y = Math.floor(i / 64) * -220 + 400
    const object = new THREE.Object3D()

    object.position.setFromCylindricalCoords(2000, theta, y)

    vector.x = object.position.x * 2
    vector.y = object.position.y
    vector.z = object.position.z * 2

    object.lookAt(vector)

    targets.ring.push(object)
  }

  //

  renderer = new CSS3DRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  const root = document.getElementById('container')
  root && root.appendChild(renderer.domElement)

  //

  controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 500
  controls.maxDistance = 6000
  controls.addEventListener('change', render)

  const buttonTable = document.getElementById('table')
  buttonTable &&
    buttonTable.addEventListener('click', function () {
      transform(targets.table, 2000)
    })

  const buttonSphere = document.getElementById('sphere')
  buttonSphere &&
    buttonSphere.addEventListener('click', function () {
      transform(targets.sphere, 2000)
    })

  const buttonHelix = document.getElementById('helix')
  buttonHelix &&
    buttonHelix.addEventListener('click', function () {
      transform(targets.helix, 2000)
    })

  const buttonRing = document.getElementById('ring')
  buttonRing &&
    buttonRing.addEventListener('click', function () {
      transform(targets.ring, 2000)
    })

  const buttonGrid = document.getElementById('grid')
  buttonGrid &&
    buttonGrid.addEventListener('click', function () {
      transform(targets.grid, 2000)
    })

  transform(targets.table, 2000)

  //

  window.addEventListener('resize', onWindowResize)
}

function transform(targets: any, duration: any) {
  TWEEN.removeAll()

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    const target = targets[i]

    new TWEEN.Tween(object.position)
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()

    new TWEEN.Tween(object.rotation)
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  TWEEN.update()

  controls.update()
}

function render() {
  renderer.render(scene, camera)
}
