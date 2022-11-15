import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'

/*
 * 立方体和线条
 */

const container = document.querySelector('#root') as HTMLDivElement
const { width, height } = container.getBoundingClientRect()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
container.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

//create a blue LineBasicMaterial
const material2 = new THREE.LineBasicMaterial({ color: 0xff0000 })

const points = []
points.push(new THREE.Vector3(-3, 0, 0))
points.push(new THREE.Vector3(-3, 3, 0))
points.push(new THREE.Vector3(3, 3, 0))

const geometry2 = new THREE.BufferGeometry().setFromPoints(points)

const line = new THREE.Line(geometry2, material2)

scene.add(line)

camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
