# Three.js 渲染基础

## Three.js、WebGL、OpenGL、Canvas 2D 的关系

Three.js、WebGL、 OpenGL 和 Canvas 2D 之间的关系可以通过它们在图形渲染领域的层次和功能来理解。他们各自扮演着不同的角色，又相互支持，共同构成了现代 Web 和应用程序图形渲染的基础。

- OpenGL

  OpenGL(Open Graphics Library)是一个跨平台的图形 API，由 Khronos Group 开发。它定义了一套函数，允许开发者在程序中进行 2D 和 3D 图形渲染。OpenGL 是在高性能计算和精细图形控制领域广泛使用的底层技术，支持多种操作系统和设备。

- WebGL

  WebGL(Web Graphics Library)是一个为**网页**提供绘制 3D 图形的 API，它基于 OpenGL ES(Embedded Systems，一种为嵌入式系统，如手机和平板电脑设计的 **OpenGL 子集**)。WebGL 直接在浏览器中运行，无需任何插件，允许开发者使用 HTML5 的 `<canvas>` 元素来渲染图形。通过使用 JavaScript 与 WebGL API 交互，开发者可以在网页中创建和控制复杂的 3D 环境。

- Three.js

  Three.js 是一个高级的 JavaScript 库，旨在通过简化的 API 使 3D 图形的创建变得更加容易。它**建立在 WebGL 之上**，提供了一组丰富的功能，如摄像机、光源、阴影、材质、纹理等，以方便开发者在浏览器中构建和渲染 3D 场景。Three.js 通过抽象 WebGL 的复杂性，使开发者无需深入了解 WebGL 的底层细节，就可以实现复杂的 3D 效果。

- Canvas 2D

  Canvas 2D 是 HTML5 提供的一个用于绘制 **2D** 图形的 API。它允许开发者在 `<canvas>` 元素上通过 JavaScript 绘制线条、形状、文本、图像和简单的动画。

![](https://blog-bed.oss-cn-beijing.aliyuncs.com/81.threejs3D%E6%B8%B2%E6%9F%93%E5%9F%BA%E7%A1%80/three.js.webp)

### 关系总结

- OpenGL 是底层的图形渲染**标准**，提供了广泛的接口和功能，用于各种计算设备上的图形渲染。
- WebGL 是基于 OpenGL ES 的**网页标准**，允许在不安装额外软件的情况下在浏览器中进行 3D 渲染。
- Three.js 是建立在 WebGL 之上的库，提供了易于使用的接口和工具，使得在网页中进行 3D 渲染变得更简单和直观。
- Canvas 2D 是一个用于 2D 图形绘制的简单 API，适合不需要复杂图形计算的应用。

通过这种层次化的关系，开发者可以根据自己的需要选择使用适当的工具和 API，无论是进行低级的图形操作还是快速开发富有视觉效果的 3D 应用。

## three.js 渲染基本要素

### [场景(Scene)](https://threejs.org/docs/#api/zh/scenes/Scene)

场景是一个容器，需要渲染的物体都要添加到场景中。可以把场景当作一个空的摄影棚，摄影棚里可以放置拍摄相关的东西，比如模特、相机、灯光等各种物体。
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/scene.png)

### [相机(Camera)](https://threejs.org/docs/?q=came#api/zh/cameras/Camera)

相机用来确定观察的位置、方向、角度，相机(类似与眼睛)看到的内容就是最终呈现在屏幕上的内容。试想一下，当我们在摄影棚调整相机，随着相机位置、方向、角度的变化所看到的画面是不一样的。

#### 正交投影相机

正交投影相机(Orthographic Camera)定义了一个长方体的空间，由相机的左、右、上、下、近、远六个裁剪面决定，在长方体内的物体会被渲染，在长方体外的会被裁剪掉。

正交投影相机的主要特点是能够让**近处、远处的物体大小尺寸保持一致**，常适用于工程制图、建模软件等。
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/orthographic-projection.png)

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

#### 透视投影相机

透视投影相机(Perspective Camera)是 Three.js 中最常用的相机类型之一，与正交相机不同，透视相机**模拟了人眼**观察物体的方式，使得离相机越近的物体看起来越大，离相机越远的物体看起来越小。

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

![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/perspective-road.png)

视椎体示意图:
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/perspective-projection.png)

正交投影 vs 透视投影:
![](http://blog-bed.oss-cn-beijing.aliyuncs.com/80.%E5%AE%9E%E7%8E%B0dicom-viewer/per-vs-orth.png)

#### 渲染器（renderer）

#### 光(Light)

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

#### 渲染器

#### 网格模型

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
