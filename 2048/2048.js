document.addEventListener("DOMContentLoaded", () => {
  /* ---------- typing animation ---------- */
  const elements = document.querySelectorAll(".typewriter");
  elements.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = "";
    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    el.appendChild(cursor);

    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(type, 80);
      } else cursor.classList.add("blink");
    };
    type();
  });

  const grid = document.getElementById("grid");
  const restartBtn = document.getElementById("restart");
  if (!grid) return;

  let cells = [];
  let board = [];
  let touchStartX = 0;
  let touchStartY = 0;
  let locked = false;

  function init() {
    grid.innerHTML = "";
    cells = [];
    board = Array(4).fill().map(() => Array(4).fill(0));
    locked = false;

    for (let i = 0; i < 16; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
      cells.push(cell);
    }
    addTile();
    addTile();
    update();
  }

  function addTile() {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) empty.push({ r, c });
      }
    }
    if (!empty.length) return false;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  function update() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c];
        const cell = cells[r * 4 + c];
        cell.textContent = val === 0 ? "" : val;
        cell.style.background = getColor(val);
        
        if (val === 0) {
          cell.style.transform = "scale(0.95)";
        } else {
          cell.style.transform = "scale(1)";
        }
      }
    }
  }

  function getColor(v) {
    const colors = {
      0: "#111", 2: "#1a1a1a", 4: "#2a2a2a", 8: "#00ff99",
      16: "#40ffb3", 32: "#66ffcc", 64: "#b266ff",
      128: "#d699ff", 256: "#e6ccff", 512: "#f2e6ff",
      1024: "#ffe6ff", 2048: "#ffffcc"
    };
    return colors[v] || "#555";
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr.splice(i + 1, 1);
      }
    }
    
    while (arr.length < 4) {
      arr.push(0);
    }
    
    return arr;
  }

  function copyBoard(b) {
    return b.map(row => [...row]);
  }

  function boardsEqual(b1, b2) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b1[r][c] !== b2[r][c]) return false;
      }
    }
    return true;
  }

  function rotate90Clockwise(b) {
    const n = 4;
    const result = Array(n).fill().map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[c][n - 1 - r] = b[r][c];
      }
    }
    return result;
  }

  function canMove(b) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return true;
      }
    }
    
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (b[r][c] === b[r][c + 1]) return true;
      }
    }
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === b[r + 1][c]) return true;
      }
    }
    
    return false;
  }

  function move(direction) {
    let newBoard = copyBoard(board);
    let rotations = 0;

    if (direction === 'up') {
      rotations = 1;
    } else if (direction === 'right') {
      rotations = 2;
    } else if (direction === 'down') {
      rotations = 3;
    }

    for (let i = 0; i < rotations; i++) {
      newBoard = rotate90Clockwise(newBoard);
    }

    let movedBoard = newBoard.map(row => slide(row));

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      movedBoard = rotate90Clockwise(movedBoard);
    }

    if (!boardsEqual(board, movedBoard)) {
      board = movedBoard;
      addTile();
      update();
      
      if (!canMove(board)) {
        setTimeout(() => {
          alert("Game Over! No more moves available.");
        }, 200);
      }
    }
  }

  function moveLeft() {
    move('left');
  }

  function moveRight() {
    move('right');
  }

  function moveUp() {
    move('up');
  }

  function moveDown() {
    move('down');
  }

  function handleMove(fn) {
    if (locked) return;
    locked = true;
    fn();
    setTimeout(() => locked = false, 150);
  }

  document.addEventListener("keydown", e => {
    switch (e.key) {
      case "ArrowLeft": 
        e.preventDefault();
        handleMove(moveLeft); 
        break;
      case "ArrowRight": 
        e.preventDefault();
        handleMove(moveRight); 
        break;
      case "ArrowUp": 
        e.preventDefault();
        handleMove(moveUp); 
        break;
      case "ArrowDown": 
        e.preventDefault();
        handleMove(moveDown); 
        break;
    }
  });

  grid.addEventListener("touchstart", e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  grid.addEventListener("touchmove", e => {
    e.preventDefault();
  }, { passive: false });

  grid.addEventListener("touchend", e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < 30) return;
    
    if (absX > absY) {
      if (dx > 0) handleMove(moveRight);
      else handleMove(moveLeft);
    } else {
      if (dy > 0) handleMove(moveDown);
      else handleMove(moveUp);
    }
  }, { passive: false });

  restartBtn.addEventListener("click", init);
  init();
});