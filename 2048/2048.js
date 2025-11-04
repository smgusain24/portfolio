const grid = document.getElementById("grid");
const restartBtn = document.getElementById("restart");
let cells = [];
let board = [];

function init() {
  grid.innerHTML = "";
  cells = [];
  board = Array(4).fill().map(()=>Array(4).fill(0));

  for(let i=0;i<16;i++){
    const cell=document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
    cells.push(cell);
  }
  addTile();
  addTile();
  update();
}

function addTile() {
  const empty=[];
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(board[r][c]===0) empty.push({r,c});
    }
  }
  if(empty.length===0) return;
  const {r,c}=empty[Math.floor(Math.random()*empty.length)];
  board[r][c]=Math.random()<0.9?2:4;
}

function update() {
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const value=board[r][c];
      const cell=cells[r*4+c];
      cell.textContent=value===0?"":value;
      cell.style.background=getColor(value);
    }
  }
}

function getColor(value){
  const colors={
    0:"#111",2:"#1a1a1a",4:"#2a2a2a",8:"#00ff99",
    16:"#40ffb3",32:"#66ffcc",64:"#b266ff",
    128:"#d699ff",256:"#e6ccff",512:"#f2e6ff",
    1024:"#ffe6ff",2048:"#ffffcc"
  };
  return colors[value]||"#555";
}

function slide(row){
  row=row.filter(v=>v);
  for(let i=0;i<row.length-1;i++){
    if(row[i]===row[i+1]){
      row[i]*=2;
      row[i+1]=0;
    }
  }
  row=row.filter(v=>v);
  while(row.length<4) row.push(0);
  return row;
}

function rotate(board){
  const newBoard=Array(4).fill().map(()=>Array(4).fill(0));
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      newBoard[r][c]=board[4-c-1][r];
    }
  }
  return newBoard;
}

function moveLeft(){
  let moved=false;
  for(let r=0;r<4;r++){
    const newRow=slide(board[r]);
    if(newRow.toString()!==board[r].toString()) moved=true;
    board[r]=newRow;
  }
  if(moved) addTile();
  update();
}

function moveRight(){
  board=board.map(r=>r.reverse());
  moveLeft();
  board=board.map(r=>r.reverse());
}

function moveUp(){
  board=rotate(board);
  moveRight();
  board=rotate(rotate(rotate(board)));
}

function moveDown(){
  board=rotate(board);
  moveLeft();
  board=rotate(rotate(rotate(board)));
}

document.addEventListener("keydown",e=>{
  switch(e.key){
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

restartBtn.addEventListener("click",init);
init();
