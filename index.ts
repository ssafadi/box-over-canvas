import { map, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

// Import stylesheets
import './style.css';


let canvas: HTMLCanvasElement = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx: CanvasRenderingContext2D = canvas.getContext("2d", {antialias: true});
let popup = document.getElementById('popup');
let vline = document.getElementById('vline');
vline.style.height = ctx.canvas.height+'px';

let $mousemove = fromEvent(canvas, 'mousemove').pipe(
  map(event => Object({x:event.layerX, y:event.layerY})));

$mousemove.subscribe(pos => {
  adjustPopup(pos);
  adjustLine(pos);

});

let $mouseleave = fromEvent(canvas, 'mouseleave')

$mouseleave.subscribe(event => {
  popup.hidden = true;
  vline.hidden = true;
  
});

let $mouseenter = fromEvent(canvas, 'mouseenter')

$mouseenter.subscribe(event => {
  popup.hidden = false;
  vline.hidden = false;
  });

function adjustPopup(pos){
  popup.innerHTML = (pos.x + ", " + pos.y)
  popup.style.left = pos.x +'px';
  popup.style.top = pos.y +'px';
}

function adjustLine(pos){
  vline.style.left = pos.x +'px';
  vline.style.top = 0 +'px';
}

function drawGrid(){ 
  let grid_size = 25;
  let x_axis_distance_grid_lines = 5;
  let y_axis_distance_grid_lines = 5;
  let x_axis_starting_point = { number: 1, suffix: '\u03a0' };
  let y_axis_starting_point = { number: 1, suffix: '' };

  let canvas_width = canvas.width;
  let canvas_height = canvas.height;

  let num_lines_x = Math.floor(canvas_height/grid_size);
  let num_lines_y = Math.floor(canvas_width/grid_size);

  ctx.strokeStyle = "#e9e9e9"
  // Draw grid lines along X-axis
  for(let i=0; i<=num_lines_x; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1;

      if(i == num_lines_x) {
          ctx.moveTo(0, grid_size*i);
          ctx.lineTo(canvas_width, grid_size*i);
      }
      else {
          ctx.moveTo(0, grid_size*i+0.5);
          ctx.lineTo(canvas_width, grid_size*i+0.5);
      }
      ctx.stroke();
  }

  // Draw grid lines along Y-axis
  for(let i=0; i<=num_lines_y; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      
      if(i == num_lines_y) {
          ctx.moveTo(grid_size*i, 0);
          ctx.lineTo(grid_size*i, canvas_height);
      }
      else {
          ctx.moveTo(grid_size*i+0.5, 0);
          ctx.lineTo(grid_size*i+0.5, canvas_height);
      }
      ctx.stroke();
  }

  ctx.resetTransform()
}

drawGrid()

// finds the distance between points
function DBP(x1,y1,x2,y2) {
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

// finds the angle of (x,y) on a plane from the origin
function getAngle(x,y) { return Math.atan(y/(x==0?0.01:x))+(x<0?Math.PI:0); }

// line without aliasing
function drawLineNoAliasing(ctx, sx, sy, tx, ty) {
    var dist = DBP(sx,sy,tx,ty); // length of line
    var ang = getAngle(tx-sx,ty-sy); // angle of line
    for(var i=0;i<dist;i++) {
        // for each point along the line
        ctx.fillRect(Math.round(sx + Math.cos(ang)*i), 
        // round for perfect pixels thus no aliasing
        // fill in one pixel, 1x1
        Math.round(sy + Math.sin(ang)*i), 1,1); 
    }
}


var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
ctx.strokeStyle = "black"
function tick(){
  x2++;
  y2 = Math.random() * 100;
  drawLineNoAliasing(ctx, x1*3, y1 + 100, x2*3, y2 + 100);
  ctx.moveTo(x1*3, y1+300);
  ctx.lineTo(x2*3, y2+300);
  ctx.stroke()
  x1=x2;
  y1=y2;
  if (x1*3>canvas.width) {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    ctx.strokeStyle = "black"

    x1=0;
    x2=0;
  };
  requestAnimationFrame(() => tick())
}

tick()