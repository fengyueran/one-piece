// addColorAttribute
// const CANVAS_WIDTH = 512;
// const CANVAS_HEIGHT = 1;

// export const createColorData = async colors => {
//   const canvasId2 = 'canvas2';
//   Taro.createSelectorQuery()
//     .select('#' + canvasId2)
//     .node()
//     .exec(res => {
//       const canvas = res[0].node;
//       canvas.width = CANVAS_WIDTH;
//       canvas.height = CANVAS_HEIGHT;
//       const ctx = canvas.getContext('2d');
//       const linearGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
//       colors.forEach((color, index) => {
//         linearGradient.addColorStop(index / (colors.length - 1), color);
//       });
//       ctx.fillStyle = linearGradient;
//       ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * 20);

//       const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

//       return new Uint8Array(imageData.data);
//     });

//   // const canvas = document.createElement('canvas');
// };

const distanceToSquared = (point1, point2) =>
  (point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2 + (point1[2] - point2[2]) ** 2;

const partition = (positionArray, positionCount, positionItemSize, level) => {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < positionCount; i++) {
    const x = positionArray[positionItemSize * i + 0];
    const y = positionArray[positionItemSize * i + 1];
    const z = positionArray[positionItemSize * i + 2];

    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (z < minZ) {
      minZ = z;
    }
    if (z > maxZ) {
      maxZ = z;
    }
  }

  const cells = [];
  const stepX = (maxX - minX) / level;
  const stepY = (maxY - minY) / level;
  const stepZ = (maxZ - minZ) / level;

  const toleranceX = stepX / level / 2;
  const toleranceY = stepY / level / 2;
  const toleranceZ = stepZ / level / 2;

  for (let ii = minX; ii < maxX; ii += stepX) {
    for (let jj = minY; jj < maxY; jj += stepY) {
      for (let kk = minZ; kk < maxZ; kk += stepZ) {
        const cell = {
          index: [ii, jj, kk],
          size: [stepX, stepY, stepZ],
          center: [ii + stepX / 2, jj + stepY / 2, kk + stepZ / 2],
          cldata: [],
        };
        cells.push(cell);
      }
    }
  }

  const getCell = (pos) => {
    for (let i = 0; i < cells.length; i += 1) {
      const cell = cells[i];
      if (
        cell.index[0] <= pos[0] &&
        pos[0] <= cell.index[0] + cell.size[0] &&
        cell.index[1] <= pos[1] &&
        pos[1] <= cell.index[1] + cell.size[1] &&
        cell.index[2] <= pos[2] &&
        pos[2] <= cell.index[2] + cell.size[2]
      ) {
        return cell;
      }
    }
  };

  const testInCell = (pos, cell) =>
    // 因为 createPlyColorBuffer 使用半径 6 * (item.radius ** 2) 作为判断调，存在误差范围
    cell.index[0] - toleranceX <= pos[0] &&
    pos[0] <= cell.index[0] + cell.size[0] + toleranceX &&
    cell.index[1] - toleranceY <= pos[1] &&
    pos[1] <= cell.index[1] + cell.size[1] + toleranceY &&
    cell.index[2] - toleranceZ <= pos[2] &&
    pos[2] <= cell.index[2] + cell.size[2] + toleranceZ;

  const addCldata = (cldata) => {
    for (const cell of cells) {
      for (const item of cldata) {
        if (testInCell(item.position, cell)) {
          cell.cldata.push(item);
        }
      }
    }
  };

  return { getCell, addCldata };
};

function createFFRArrayBuffer(positionArray, cldata) {
  const positionItemSize = 3;

  const positionCount = positionArray.length / positionItemSize;

  const partitionCells = partition(positionArray, positionCount, positionItemSize, 4); // 多次测试 4 是最快的
  partitionCells.addCldata(cldata);

  const ffrArray = new Float32Array(positionCount);
  for (let i = 0; i < positionCount; i++) {
    const startIndex = i * positionItemSize;
    const point1 = [
      positionArray[startIndex],
      positionArray[startIndex + 1],
      positionArray[startIndex + 2],
    ];

    let ffr = 0;

    const cell = partitionCells.getCell(point1);
    if (cell) {
      let minSqrDist = 25;

      for (let j = 0; j < cell.cldata.length; j += 1) {
        const item = cell.cldata[j];
        const point2 = item.position;

        const dist2 = distanceToSquared(point1, point2);
        if (dist2 < minSqrDist && dist2 <= 8 * item.radius ** 2) {
          ffr = (1 - item.ffr) * 2;

          minSqrDist = dist2;
        }
      }
    }
    ffrArray[i] = ffr;
  }
  return ffrArray;
}

export default createFFRArrayBuffer;
