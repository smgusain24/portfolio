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

  function init() {
    grid.innerHTML = "";
    cells = [];
    board = Array(4).fill().map(() => Array(4).fill(0));

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
    if (!empty.length) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function update() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c];
        const cell = cells[r * 4 + c];
        cell.textContent = val === 0 ? "" : val;
        cell.style.background = getColor(val);
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
    row = row.filter(v => v);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    row = row.filter(v => v);
    while (row.length < 4) row.push(0);
    return row;
  }

  function rotate(b) {
    const n = 4;
    const res = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        res[r][c] = b[n - c - 1][r];
      }
    }
    return res;
  }

  function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      const newRow = slide(board[r]);
      if (newRow.toString() !== board[r].toString()) moved = true;
      board[r] = newRow;
    }
    if (moved) {
      addTile();
      update();
    }
  }

  function moveRight() {
    board = board.map(r => r.reverse());
    moveLeft();
    board = board.map(r => r.reverse());
  }

  function moveUp() {
    board = rotate(board);
    moveRight();
    board = rotate(rotate(rotate(board)));
  }

  function moveDown() {
    board = rotate(board);
    moveLeft();
    board = rotate(rotate(rotate(board)));
  }

  /* ------------------- INPUT HANDLING ------------------- */
  let locked = false;

  function handleMove(fn) {
    if (locked) return;
    locked = true;
    fn();
    setTimeout(() => locked = false, 120);
  }

  document.addEventListener("keydown", e => {
    switch (e.key) {
      case "ArrowLeft": handleMove(moveLeft); break;
      case "ArrowRight": handleMove(moveRight); break;
      case "ArrowUp": handleMove(moveUp); break;
      case "ArrowDown": handleMove(moveDown); break;
    }
  });

  /* --- Swipe for mobile --- */
  grid.addEventListener("touchstart", e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  grid.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < 30) return; // ignore tiny swipes
    if (absX > absY) {
      if (dx > 0) handleMove(moveRight);
      else handleMove(moveLeft);
    } else {
      if (dy > 0) handleMove(moveDown);
      else handleMove(moveUp);
    }
  }, { passive: true });

  restartBtn.addEventListener("click", init);
  init();

});


