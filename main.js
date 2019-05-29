'use strict'

let canvas = document.getElementById('cv')
let ctx = canvas.getContext('2d')
let centerX = canvas.clientWidth / 2
let centerY = canvas.clientHeight / 2
let maxWH = 300;

canvas.addEventListener('mousemove', drawToMouse)
ctx.fillStyle = 'black'

drawGrid()

function clearCanvas(){									//limpa o canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
}

function drawToMouse(e){
    redraw()


    let y = e.clientY
    let x = e.clientX

    if (e.clientY < centerY) y = centerY - y

    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()



    /* if (y < 100) y = 100
    if (y > 400) y = 400

    if (x < 100) x = 100
    if (x > 400) x = 400 */


    console.log('y', y)
    //console.log('x', x)

    drawAngle(x, y)
}

function drawAngle(x, y){
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(400, centerY)
    ctx.lineTo(400, y)
    ctx.stroke()
    ctx.strokeStyle = '#ccc'
}

function drawGrid(){
    let min = centerX - (maxWH / 2)
    let max = centerX + (maxWH / 2)

    ctx.strokeStyle = '#ccc'
    ctx.beginPath();
    ctx.moveTo(min, min)
    ctx.lineTo(max, min)
    ctx.lineTo(max, max)
    ctx.lineTo(min, max)
    ctx.lineTo(min, min)
    ctx.moveTo(min - 20, centerY)
    ctx.lineTo(max + 20, centerY)
    ctx.moveTo(centerX, min - 20)
    ctx.lineTo(centerX, max + 20)
    ctx.stroke()
}

function redraw(){
    clearCanvas()
    drawGrid()
}