import * as THREE from 'three'

import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'

/*
 * 可拖动的立方体
 */

const container = document.querySelector('#root') as HTMLDivElement
const { width, height } = container.getBoundingClientRect()

/**
 * 创建场景对象Scene
 */
const scene = new THREE.Scene()

/**
 * 创建网格模型
 */
// 创建一个球体几何对象
// const geometry = new THREE.SphereGeometry(60, 40, 40)

// 创建一个立方体几何对象Geometry
const geometry = new THREE.BoxGeometry(100, 100, 100)

// 材质对象Material
// color	材质颜色，比如蓝色0x0000ff
// wireframe	将几何图形渲染为线框。 默认值为false
// opacity	透明度设置，0表示完全透明，1表示完全不透明
// transparent	是否开启透明，默认false
const material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  opacity: 0.7,
  // wireframe: true,
  transparent: true,
})

var sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  specular: 0x4488ee,
  shininess: 12,
})

const mesh = new THREE.Mesh(geometry, sphereMaterial) //网格模型对象Mesh
scene.add(mesh) //网格模型添加到场景中

/**
 * 光源设置
 */
//点光源
const point = new THREE.PointLight(0xffffff)
point.position.set(400, 200, 300) //点光源位置
scene.add(point) //点光源添加到场景中

//环境光
const ambient = new THREE.AmbientLight(0x444444)
scene.add(ambient)
// console.log(scene)
// console.log(scene.children)

/**
 * 相机设置
 */
const k = width / height //窗口宽高比
const s = 200 //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
camera.position.set(200, 300, 200) //设置相机位置
camera.lookAt(scene.position) //设置相机方向(指向的场景对象)
/**
 * 创建渲染器对象
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height) //设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1) //设置背景颜色

container.appendChild(renderer.domElement) //body元素中插入canvas对象

//执行渲染操作   指定场景、相机作为参数
renderer.render(scene, camera)

function render() {
  renderer.render(scene, camera) //执行渲染操作
}
render()

const controls = new OrbitControls(camera, renderer.domElement) //创建控件对象
controls.addEventListener('change', render) //监听鼠标、键盘事件
