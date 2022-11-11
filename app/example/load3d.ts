import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const container = document.querySelector('#root') as HTMLDivElement
const { width, height } = container.getBoundingClientRect()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

camera.position.z = 2

const controls = new TrackballControls(camera, renderer.domElement)
controls.minDistance = 1
controls.maxDistance = 10
controls.addEventListener('change', render)

const loader = new GLTFLoader()

loader.load(
  '/threejs-example/app/assets/a_windy_day/scene.gltf',
  function (gltf) {
    // 需要压缩
    scene.add(gltf.scene)
  },
  undefined,
  function (error) {
    console.error(error)
  }
)

function animate() {
  requestAnimationFrame(animate)

  controls.update()
  // renderer.render(scene, camera)
}

function render() {
  renderer.render(scene, camera)
}

animate()
