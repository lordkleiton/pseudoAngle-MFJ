'use strict'

let canvas = document.getElementById('cv')
let ctx = canvas.getContext('2d')
let centerX = canvas.clientWidth / 2
let centerY = canvas.clientHeight / 2
let maxWH = 300;
let padding = (canvas.clientWidth - maxWH) / 2
let min = centerX - (maxWH / 2)
let max = centerX + (maxWH / 2)

canvas.addEventListener('mousemove', drawToMouse)
ctx.fillStyle = 'black'

drawGrid()

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
}

function drawToMouse(e){
    redraw()

    let y = e.clientY
    let x = e.clientX

    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()

    let teste = (y - padding) / maxWH
    if (teste < 0) teste = 0
    if (teste > 1) teste = 1

    let teste2 = (x - padding) / maxWH
    if (teste2 < 0) teste2 = 0
    if (teste2 > 1) teste2 = 1

    let ax = (teste2 > 0.5) ? 'positivo' : 'negativo'
    let ay = (teste < 0.5) ? 'positivo' : 'negativo'    

    let c = teste2 * 2 - 1
    let d = 1 - teste * 2

    console.log('x: ', c, 'y: ', d)

    drawAngle(teste2 * maxWH + padding, teste * maxWH + padding)
}

function drawAngle(x, y){
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(400, centerY)
    ctx.lineTo(400, y)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.strokeStyle = '#ccc'
}

function drawGrid(){
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