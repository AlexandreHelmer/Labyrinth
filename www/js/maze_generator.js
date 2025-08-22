/* === GENERATION LABYRINTHE : Hunt-and-Kill === */
function generateMaze(cols,rows, CONFIG){
  const grid = Array.from({length:rows},()=>Array(cols).fill(1));
  const isCell = (x,y)=> (x>0 && y>0 && x<cols-1 && y<rows-1 && (x%2===1) && (y%2===1));
  const cellNeighbors = (x,y)=>{
    const res=[];
    if(y-2>0)   res.push([x, y-2, 0,-1]);
    if(y+2<rows-1) res.push([x, y+2, 0, 1]);
    if(x-2>0)   res.push([x-2, y,-1, 0]);
    if(x+2<cols-1) res.push([x+2, y, 1, 0]);
    return res;
  };
  const visited = Array.from({length:rows},()=>Array(cols).fill(false));
  let cx = 1 + 2*Math.floor(Math.random()*((cols-1)/2));
  let cy = 1 + 2*Math.floor(Math.random()*((rows-1)/2));
  visited[cy][cx]=true; grid[cy][cx]=0;

  function kill(x,y){
    while(true){
      const neigh = cellNeighbors(x,y).filter(([nx,ny])=>!visited[ny][nx]);
      if(neigh.length===0) return [x,y];
      const [nx,ny,dx,dy] = neigh[(Math.random()*neigh.length)|0];
      grid[y+dy][x+dx]=0; grid[ny][nx]=0;
      visited[ny][nx]=true;
      x=nx; y=ny;
    }
  }
  function hunt(){
    for(let y=1;y<rows-1;y+=2){
      for(let x=1;x<cols-1;x+=2){
        if(!visited[y][x]){
          const neigh = cellNeighbors(x,y).filter(([nx,ny])=>visited[ny][nx]);
          if(neigh.length){
            const [nx,ny,dx,dy] = neigh[(Math.random()*neigh.length)|0];
            grid[y+dy][x+dx]=0; grid[y][x]=0;
            visited[y][x]=true;
            return [x,y];
          }
        }
      }
    }
    return null;
  }
  let current = [cx,cy];
  while(true){
    current = kill(current[0], current[1]);
    const h = hunt();
    if(!h) break;
    current = h;
  }
  
  addRandomObjects(grid, cols, rows)
  // entrée/sortie
  grid[CONFIG.positions.start.y][CONFIG.positions.start.x]=0;
  grid[1][1]=0;
  const exitY = rows - CONFIG.positions.endOffset.y;
  const exitX = cols - 1;
  grid[exitY][exitX]=0;
  grid[exitY][exitX-1]=0;
  return grid;
}


function pathClear(maze,x1,y1,x2,y2){
  if(x1===x2){
    const step=Math.sign(y2-y1);
    for(let y=y1+step;y!==y2+step;y+=step) if(maze[y][x1]!==0) return false;
  } else if(y1===y2){
    const step=Math.sign(x2-x1);
    for(let x=x1+step;x!==x2+step;x+=step) if(maze[y1][x]!==0) return false;
  } else return false;
  return true;
}


BLOCKING_PROBABILITY=0.15
function addRandomObjects(grid, cols, rows) {
  for (let y=0; y<rows; y++) {
    for (let x=0; x<cols; x++) {
    
      if (grid[y][x] === 1) {
        // mur ou encombrant
        const isCorridor = 
          (grid[y]?.[x-1]===0 && grid[y]?.[x+1]===0) ||
          (grid[y-1]?.[x]===0 && grid[y+1]?.[x]===0);

        if (isCorridor && Math.random() < BLOCKING_PROBABILITY) {
          grid[y][x] = 2
        }
      }
    }
  }
}