const player = document.querySelector('.player');

const sizeBtn = document.querySelector('#sizeBtn');
const table = document.querySelector('table');

let size = parseInt(sizeBtn.options[sizeBtn.selectedIndex].value);

let row = size;
let col = row;
const gridSize = 20;

// 绘制迷宫
let [startX, startY] = [1, 0];
let [endX, endY] = [2 * col - 1, 2 * col];
let maze = new Maze(row, col, [startX, startY], [endX, endY]);
maze.generate();

let mazeDataArray = maze.mazeDataArray;
maze.drawDom();

player.style.top = gridSize * startX + 'px';
player.style.left = gridSize * startY + 'px';

// 监听size改变事件
sizeBtn.addEventListener('change', function (e) {
  this.blur(); // 控制下拉框失去焦点，防止切换下拉选项
  maze = null; // 置空
  table.innerHTML = null;

  size = parseInt(sizeBtn.options[sizeBtn.selectedIndex].value);
  [row, col] = [size, size];

  [endX, endY] = [2 * col - 1, 2 * col];
  maze = new Maze(row, col, [startX, startY], [endX, endY]);
  maze.generate();
  mazeDataArray = maze.mazeDataArray;
  maze.drawDom();

  player.style.top = gridSize * startX + 'px';
  player.style.left = gridSize * startY + 'px';
});

const keys = [];
document.addEventListener('keydown', e => {
  // 正则匹配 ，不区分大小写，若keys里面没有该按键，则追加
  if (e.key.match(/^Arrow/i)) {
    !keys.includes(e.key) && keys.push(e.key);
  }
});
document.addEventListener('keyup', e => {
  keys.splice(keys.indexOf(e.key), 1);
});

const running = () => {
  if (keys.length > 0) {
    let step = 1;
    let [x, y] = [0, 0];
    let [left, right, top, bottom] = [player.offsetLeft, player.offsetLeft + gridSize, player.offsetTop, player.offsetTop + gridSize]; // player各边位置

    switch (keys[keys.length - 1]) {
      case 'ArrowUp':
        [x, y] = maze.getXY(top - step, left + gridSize / 2);
        if (mazeDataArray[x][y] && mazeDataArray[x][y].value) {
          player.style.top = player.offsetTop - step + 'px';
        }
        break;
      case 'ArrowDown':
        [x, y] = maze.getXY(bottom + step, left + gridSize / 2);
        if (mazeDataArray[x][y] && mazeDataArray[x][y].value) {
          player.style.top = player.offsetTop + step + 'px';
        }
        break;
      case 'ArrowLeft':
        [x, y] = maze.getXY(top + gridSize / 2, left - step);
        if (mazeDataArray[x][y] && mazeDataArray[x][y].value) {
          player.style.left = player.offsetLeft - step + 'px';
        }
        break;
      case 'ArrowRight':
        [x, y] = maze.getXY(top + gridSize / 2, right + step);
        if (mazeDataArray[x][y] && mazeDataArray[x][y].value) {
          player.style.left = player.offsetLeft + step + 'px';
        }
        break;
    }
  }
  requestAnimationFrame(running);
};

running();
