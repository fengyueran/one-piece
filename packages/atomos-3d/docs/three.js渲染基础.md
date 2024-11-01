# Three.js 渲染基础

## Three.js、WebGL、OpenGL、Canvas 2D 的关系

Three.js、WebGL、 OpenGL 和 Canvas 2D 之间的关系可以通过它们在图形渲染领域的层次和功能来理解。他们各自扮演着不同的角色，又相互支持，共同构成了现代 Web 和应用程序图形渲染的基础。

- OpenGL

  OpenGL(Open Graphics Library)是一个跨平台的图形 API，由 Khronos Group 开发。它定义了一套函数，允许开发者在程序中进行 2D 和 3D 图形渲染。OpenGL 是在高性能计算和精细图形控制领域广泛使用的**底层技术**，支持多种操作系统和设备。

- WebGL

  WebGL(Web Graphics Library)是一个为**网页**提供绘制 3D 图形的 API，它**基于 OpenGL ES**(Embedded Systems，一种为嵌入式系统，如手机和平板电脑设计的 **OpenGL 子集**)。WebGL **直接在浏览器中运行**，无需任何插件，允许开发者使用 HTML5 的 `<canvas>` 元素来渲染图形。通过使用 JavaScript 与 WebGL API 交互，开发者可以在网页中创建和控制复杂的 3D 环境。

- Three.js

  Three.js 是一个高级的 JavaScript 库，旨在通过简化的 API 使 3D 图形的创建变得更加容易。它**建立在 WebGL 之上**，提供了一组丰富的功能，如摄像机、光源、阴影、材质、纹理等，以方便开发者在浏览器中构建和渲染 3D 场景。Three.js 通过抽象 WebGL 的复杂性，使开发者无需深入了解 WebGL 的底层细节，就可以实现复杂的 3D 效果。

- Canvas 2D

  Canvas 2D 是 HTML5 提供的一个用于绘制 **2D** 图形的 API。它允许开发者在 `<canvas>` 元素上通过 JavaScript 绘制线条、形状、文本、图像和简单的动画。

![](https://blog-bed.oss-cn-beijing.aliyuncs.com/81.threejs3D%E6%B8%B2%E6%9F%93%E5%9F%BA%E7%A1%80/three.js.webp)

### 关系总结

- OpenGL 是底层的图形渲染**标准**，提供了广泛的接口和功能，用于各种计算设备上的图形渲染。
- WebGL 是基于 OpenGL ES 的**网页标准**，允许在不安装额外软件的情况下在浏览器中进行 3D 渲染。
- Three.js 是**建立在 WebGL 之上**的库，提供了易于使用的接口和工具，使得在网页中进行 3D 渲染变得更简单和直观。
- Canvas 2D 是一个用于 2D 图形绘制的简单 API，适合不需要复杂图形计算的应用。

开发者可以根据自己的需要选择使用适当的工具和 API，无论是进行低级的图形操作还是快速开发富有视觉效果的 3D 应用。

## three.js 渲染基本要素

### [场景(Scene)](https://threejs.org/docs/#api/zh/scenes/Scene)

场景是一个容器，需要渲染的物体都要添加到场景中。可以把场景当作一个空的摄影棚，摄影棚里可以放置拍摄相关的物体，比如模特、相机、灯光等。
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/scene.png)

### [相机(Camera)](https://threejs.org/docs/?q=came#api/zh/cameras/Camera)

相机用来确定观察的位置、方向、角度，相机(类似与眼睛)看到的内容就是最终呈现在屏幕上的内容。试想一下，当我们在摄影棚调整相机，随着相机位置、方向、角度的变化所看到的画面是不一样的。

#### 正交投影相机

正交投影相机(Orthographic Camera)定义了一个长方体的空间，由相机的上、下、左、右、近、远六个裁剪面决定，在长方体内的物体会被渲染，在长方体外的会被裁剪掉。

正交投影相机的主要特点是能够让**近处、远处的物体大小尺寸保持一致**，常适用于工程制图、建模软件等。

<!-- ![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/orthographic-projection.png) -->

```js
//width、height 定义了长方体空间的宽度和高度
const width = 100;
const height = 180;
const left = -width / 2; // 左截面的位置
const right = width / 2; // 右截面的位置
const top = height / 2; // 上截面的位置
const bottom = -height / 2; // 下截面的位置
const near = 0.1; // 近截面的位置
const far = 100; // 远截面的位置

const camera = new THREE.OrthographicCamera(
  left,
  right,
  top,
  bottom,
  near,
  far
);
```

![](https://blog-bed.oss-cn-beijing.aliyuncs.com/81.threejs3D%E6%B8%B2%E6%9F%93%E5%9F%BA%E7%A1%80/orthographic-camera.webp)

#### 透视投影相机

透视投影相机(Perspective Camera)与正交相机不同，透视相机**模拟了人眼**观察物体的方式，使得离相机越近的物体看起来越大，离相机越远的物体看起来越小。

![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/perspective-road.png)

```js
const width = window.innerWidth;
const height = window.innerHeight;
const fov = 75; // 像机视锥体垂直视野角度
const aspect = width / height; //摄像机视锥体长宽比
const near = 0.1; // 摄像机视锥体近平面
const far = 1000; // 摄像机视锥体远平面
//通过这4个参数，可以画出一个视锥体
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

![](https://blog-bed.oss-cn-beijing.aliyuncs.com/81.threejs3D%E6%B8%B2%E6%9F%93%E5%9F%BA%E7%A1%80/perspective-camera.webp)

<!-- 视椎体示意图:
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/perspective-projection.png) -->

正交投影 vs 透视投影:
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/per-vs-orth.png)

### 光(Light)

和真实世界一样没有光是看不到任何物体的，因此需要向场景中添加光源。为了和真实世界更加贴近，Threejs 支持模拟不同光源，展现不同光照效果，有点光源、平行光、聚光灯、环境光等。 不同的光与物体反射能够得到不同的效果。
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/light.png)

- 平行光

  平行光即光线是相互平行的光，平行光具有方向性，可以看作是无限远处(比如太阳)发出的光。平行光只需要一个方向和一个颜色就能定义。

- 点光源

  点光源是从一个点向周围所有方向发出的光，就像灯泡、火焰等，用光源的位置和颜色来定义。

- 环境光

  环境光(间接光)指那些经光源(点光源和平行光)发出后，被墙壁或物体多次反射，然后照到物体上的光。环境光从各个角度照射物体，其强度都是一致的，只需要用颜色来定义。

- 聚光灯

  光线从一个点出发沿着圆椎体，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大，类似手电筒产生的光源。

### 渲染器(Renderer)

Three.js 中的渲染器是用于将 3D **场景**绘制到网页中的关键元素。它负责从场景中获取对象的几何信息、材质、光照等元素，并将其转换为能够在显示设备上呈现的二维图像。Three.js 提供了多种渲染器，其中最常用的渲染器是 WebGLRenderer。下面是几种常见的渲染器及其特点。

#### WebGLRenderer

WebGLRenderer 是 Three.js 中**最常用**的渲染器，它基于 WebGL（Web Graphics Library），能够充分利用 GPU 的强大计算能力，以高效渲染 3D 场景。WebGLRenderer 适合用于现代浏览器中的复杂 3D 场景，并支持光影效果、材质、多重采样抗锯齿等高级功能。

特点：

- 高性能：利用 GPU 的硬件加速来处理复杂的几何体和效果。
- 跨平台：在支持 WebGL 的所有设备和浏览器中运行，包括移动设备。
- 可定制：支持通过着色器自定义渲染效果。
- 渲染模式：可以通过 shadowMap 属性支持阴影渲染。
- 抗锯齿：可以通过 antialias 属性开启抗锯齿。

```js
// 创建 WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

#### CanvasRenderer

CanvasRenderer 是基于 HTML5 Canvas 技术的渲染器。相比 WebGLRenderer，CanvasRenderer 的性能较低，因为它不使用 GPU 进行渲染，只依赖 CPU。它通常用作不支持 WebGL 的浏览器的备选方案。

特点：

- 兼容性强：可以在不支持 WebGL 的环境下使用。
- 性能较低：由于只使用 CPU，无法提供与 WebGL 同级别的渲染效果。
- 不支持高级效果：例如复杂的光照和阴影效果无法实现。

```js
// 创建 CanvasRenderer
const renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

应用场景：
CanvasRenderer 的应用场景主要集中在：

- 旧设备或不支持 WebGL 的环境。
- 简单的几何图形渲染，无需复杂光照和材质。
- 作为 WebGLRenderer 的降级方案，确保兼容性。
- 低性能或低功耗需求的应用。

#### SVGRenderer

SVGRenderer 基于 SVG（可缩放矢量图形）技术渲染 3D 场景。它将 Three.js 中的 3D 对象转化为矢量图形并输出为 SVG 格式。由于 SVG 本身是基于矢量的，因此放大或缩小不会失真，但它只适合渲染简单的场景，不适合复杂的 3D 渲染需求。

特点：

- 可缩放矢量图形：在放大时不会失去清晰度，非常适合用于生成图表或不需要动态交互的静态内容。
- 性能较低：适合渲染简单的几何图形，复杂的场景和效果不适用。
- 不支持高级效果：不支持阴影和复杂的光照。

应用场景：

- 需要高分辨率的矢量图输出。
- 低性能设备或不支持 WebGL 的浏览器。
- 技术文档或演示中需要简单几何图形的可视化。
- 2D 或非常简单的 3D 场景，尤其是在需要保持可编辑性的情况下。

```js
// 创建 SVGRenderer，它输出的 3D 场景将以矢量图形的形式呈现，可以在浏览器中无损放大。
const renderer = new THREE.SVGRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

#### CSS3DRenderer

使用 CSS3D 技术渲染 3D DOM 元素，可以在网页中嵌入 3D HTML 内容，如视频、图片等。这种渲染器能够与 WebGLRenderer 同时使用，从而将 DOM 元素与 WebGL 场景无缝集成。

```js
const scene = new THREE.Scene();

// 创建 CSS3DRenderer
const renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建一个 HTML 元素作为 3D 对象
const element = document.createElement('div');
element.className = 'css3d-box';
element.innerHTML = 'Hello, 3D World!';

// 将 HTML 元素转换为 Three.js 对象
const css3dObject = new THREE.CSS3DObject(element);
css3dObject.position.set(0, 0, 0); // 设置对象的初始位置
scene.add(css3dObject);
```

应用场景：
CSS3DRenderer 的应用场景主要集中在需要在 3D 空间中嵌入或操纵 HTML/CSS 元素的场合，适合以下情况：

- 需要混合使用 3D 渲染与传统 HTML/CSS 内容（如 UI、文本、图表）。
- 需要 3D 场景中的交互式或动态 HTML 内容（如按钮、表单、信息标签）。
- 构建 3D 交互式界面或展示项目，如虚拟展览、数据可视化、翻页效果等。

#### 渲染循环

上述的渲染器需要在**动画循环中执行**，动画循环通常使用 requestAnimationFrame() 来实现。

```js
function animate() {
  //每一帧重绘(屏幕刷新)之前调用指定的回调函数，这里是animate
  requestAnimationFrame(animate);

  // 旋转立方体
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // 渲染场景
  renderer.render(scene, camera);
}

animate();
```

requestAnimationFrame() 是一个由浏览器提供的原生 API，它会将指定的回调函数(如 animate() 函数)放入下一次屏幕重绘之前的队列中。这意味着：

- 浏览器每次准备绘制一帧时(绘制前)，都会先执行这个回调函数。
- 这个函数的执行频率通常与显示器的刷新率一致（例如 60Hz 显示器每秒大约 60 帧），但如果刷新率不同或者计算量太大，实际帧率可能会变低。

requestAnimationFrame() 的优点：

- 平滑动画

  由于 requestAnimationFrame() 自动与显示器的刷新率同步，它确保了动画的平滑度。如果动画更新与重绘不同步，例如使用 setInterval()，如果你设定的时间间隔小于浏览器的帧间隔时间，就会执行多次计算(更新 cube 旋转角度)，但这些计算并不会立即反映在屏幕上，或者 setInterval() 间隔时间大于浏览器的帧间隔时间，浏览器来不及在每次绘制时都更新动画(这个时候 cube 旋转角度还未更新)，导致动画卡顿或跳帧。

- 节能效率

  如果页面在后台或不可见，浏览器会自动降低 requestAnimationFrame() 的调用频率，节省系统资源。

- 更适合动画的精确控制

  与 setTimeout() 和 setInterval() 相比，requestAnimationFrame() 更适合动画开发，因为它避免了不必要的资源消耗，并且能更好地协调帧之间的渲染时间。

上述的 animate() 创建了一个无限循环的动画更新机制，每次调用 animate() 时，立方体的旋转角度增加一些，调用 renderer.render() 会将更新后的场景渲染出来，显示旋转后的立方体，从而产生一个平滑的旋转动画。

### 物体

#### 几何体(Geometry)

在计算机世界中，图形的绘制都是通过点（顶点）来完成的，两个点构成一条线，三个点(不在一条线)构成一个三角面， 更复杂的图形通常也是三角面(面渲染)组合而成。
这些点、线、面就构成了物体的几何体，也就是说几何体决定了物体的**形状**。每个几何体由顶点和面组成：

- 顶点(Vertices): 几何体的点，它们用来定义物体的轮廓。
- 面(Faces): 由顶点组成的三角形，定义了物体的表面。

Three.js 提供了多种几何体，例如 BoxGeometry、SphereGeometry、PlaneGeometry 等等。

![](https://blog-bed.oss-cn-beijing.aliyuncs.com/81.threejs3D%E6%B8%B2%E6%9F%93%E5%9F%BA%E7%A1%80/shape.webp)

用户还可以通过自定义几何体创建更复杂的形状，比如著名的斯坦福兔子，由 69451 个三角形组成，当顶点越多，三角面越多，兔子的形状就更细腻真实。
![](https://blog-bed.oss-cn-beijing.aliyuncs.com/81.threejs3D%E6%B8%B2%E6%9F%93%E5%9F%BA%E7%A1%80/stanford-bunny.webp)

#### 材质(Material)

材质决定了物体的外观和表面属性(比如金属和木头，它们的质感是不一样的)，它定义了物体如何反射光、显示颜色、透明度等特性。Three.js 提供了不同种类的材质，例如：

- MeshBasicMaterial

  不受光照影响的基础材质。

- MeshLambertMaterial

  基于光照的漫反射材质，适合非反光物体。

- MeshPhongMaterial

  支持高光反射，适合有光泽的物体。

- MeshStandardMaterial 和 MeshPhysicalMaterial

  物理基础渲染(PBR)材质，用于更真实的光照效果。

#### 网格模型(Mesh)

Mesh 是一个三维物体，它由**几何体**和**材质**组成，并可以通过变换（旋转、缩放、平移）进行操作。

```js
const geometry = new THREE.BoxGeometry(1, 1, 1); //几何体
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); //材质
const cube = new THREE.Mesh(geometry, material); //立方体
```

有了以上这些元素后，我们就能够进行基础地渲染了，下面是一个简单的例子:

```js
// 创建场景
const scene = new THREE.Scene();

// 创建相机 (透视相机)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// 创建 WebGLRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建一个立方体几何体
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 使用 Phong 材质支持光照
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// 动画函数
function animate() {
  requestAnimationFrame(animate);

  // 旋转立方体
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // 渲染场景
  renderer.render(scene, camera);
}

animate();
```

### 坐标系

### 渲染方法

### 渲染流水线

Three.js 是一个建立在 WebGL 之上的高级 JavaScript 库，虽然它对开发者隐藏了许多底层细节，但在其背后，Three.js 实际上也是依赖 WebGL 来执行图形渲染的。因此，Three.js 的渲染过程基本上遵循与 OpenGL 相似的渲染管线。以下是 Three.js 如何通过 WebGL 实现这些管线步骤的说明：

1. 顶点处理阶段（Vertex Processing）

   • 顶点着色器（Vertex Shader）：
   • 在 Three.js 中，顶点着色器是通过材质（Materials）来隐式定义的。Three.js 提供了许多内置的材质类型（如 MeshBasicMaterial、MeshStandardMaterial），它们使用了内置的顶点着色器。开发者也可以通过自定义着色器材质（ShaderMaterial）来编写自己的顶点着色器。
   • 顶点着色器在 Three.js 中处理顶点的位置变换（例如应用模型、视图和投影矩阵），以及计算顶点的法线等数据。

2. 图元装配阶段（Primitive Assembly）

   • 几何图元的构建：
   • Three.js 通过几何体（Geometry）对象来定义顶点数据。几何体可以是预定义的形状（如立方体、球体等）或自定义的顶点集合。Three.js 将这些顶点数据传递给 WebGL，WebGL 会将顶点组成图元（如三角形、线条等）。
   • Three.js 自动处理顶点之间的连接和图元的生成，无需开发者手动进行这一过程。

3. 几何着色器（Geometry Shader）

   • 几何着色器（可选）：
   • Three.js 本身不直接支持几何着色器，因为它的目标是简化 3D 渲染。如果需要使用几何着色器，开发者需要直接编写 WebGL 代码，或使用 WebGL 扩展功能进行处理。

4. 光栅化阶段（Rasterization）

   • 光栅化处理：
   • 在 Three.js 中，光栅化过程是由 WebGL 完成的。几何图元经过光栅化被转换为片元（Fragments）。Three.js 将顶点数据发送到 GPU，并由 WebGL 执行光栅化。
   • 光栅化阶段也是自动处理的，开发者通常不需要手动控制这个过程。

5. 片元着色器（Fragment Shader）

   • 片元着色器：
   • 与顶点着色器类似，Three.js 中的片元着色器也通过材质来定义。内置材质会使用默认的片元着色器，处理颜色、纹理采样和光照计算等。
   • 如果需要自定义片元着色器，可以使用 ShaderMaterial 自行编写，Three.js 会将这些着色器与场景中的几何体关联起来。

6. 后处理与输出阶段

   • 深度测试与模板测试：
   • Three.js 支持深度测试，通过设置材质的 depthTest 属性，开发者可以控制片元是否通过深度测试。
   • 模板测试在 Three.js 中不常见，通常直接使用 WebGL 来实现。
   • 混合（Blending）：
   • Three.js 支持各种混合模式，通常用于处理透明物体。开发者可以通过设置材质的 blending 属性来定义混合行为。
   • 帧缓冲和多重采样：
   • Three.js 可以利用 WebGL 帧缓冲对象来执行离屏渲染，或者实现后期处理效果。抗锯齿（多重采样）也是通过 WebGL 的设置来处理的。

7. 渲染到屏幕

   • 最终输出：
   • 最终的渲染结果会由 Three.js 的渲染器（WebGLRenderer）输出到 <canvas> 元素，显示在屏幕上。Three.js 负责管理 WebGL 的渲染上下文，并处理所有与 WebGL API 交互的细节。

#### 坐标变换

这些步骤将 3D 场景中的顶点从对象空间转换为屏幕空间，并且在过程中进行了归一化处理。整个过程通常在顶点着色器中完成。

1. 模型变换（Model Transformation）

   • 作用：将顶点从对象空间（Object Space）转换到世界空间（World Space）。
   • 矩阵：模型矩阵（Model Matrix）。
   • 变换：worldPosition = modelMatrix \* localPosition
   • 解释：这个步骤应用了对象的平移、旋转和缩放，将顶点从局部坐标系变换到全局的世界坐标系。

2. 视图变换（View Transformation）

   • 作用：将顶点从世界空间转换到相机空间（View Space，也称为眼空间）。
   • 矩阵：视图矩阵（View Matrix）。
   • 变换：viewPosition = viewMatrix \* worldPosition
   • 解释：视图矩阵将世界坐标系下的顶点位置转换到相机的视角中，确定物体相对于摄像机的位置。

3. 投影变换（Projection Transformation）

   • 作用：将顶点从相机空间转换到裁剪空间（Clip Space），这是一个包含归一化步骤的关键过程。
   • 矩阵：投影矩阵（Projection Matrix）。
   • 变换：clipPosition = projectionMatrix \* viewPosition
   • 解释：投影矩阵将顶点从相机空间映射到一个标准化的裁剪空间。这一步将 3D 坐标压缩到一个立方体内，其中 x, y, z 坐标会在 [-1, 1] 的范围内。
   • 归一化：在这一步，顶点的齐次坐标 (x, y, z, w) 通过 w 分量进行归一化，即 normalizedCoords = clipPosition.xyz / clipPosition.w。结果是标准化设备坐标（NDC），其范围是 [-1, 1]。

4. 视口变换（Viewport Transformation）

   • 作用：将标准化设备坐标（NDC）转换到屏幕空间（Screen Space）。
   • 矩阵：视口变换不使用显式矩阵，而是直接映射 NDC 到屏幕坐标。
   • 变换：
   • x = (NDC.x + 1) _ width / 2
   • y = (NDC.y + 1) _ height / 2
   • z = (NDC.z + 1) / 2
   • 解释：标准化设备坐标被映射到实际的屏幕像素坐标，定义了最终的渲染位置。x 和 y 坐标确定像素位置，z 坐标则用作深度缓冲。

总结

包含归一化的坐标变换步骤依次是模型变换、视图变换、投影变换（包括归一化），以及最后的视口变换。归一化的关键步骤发生在投影变换之后，将顶点坐标从齐次裁剪坐标（Clip Coordinates）转换为标准化设备坐标（NDC），并最终映射到屏幕空间用于实际渲染。
