'use strict'

let canvas = document.getElementById('cv')
let ctx = canvas.getContext('2d')
let centerX = canvas.clientWidth / 2
let centerY = canvas.clientHeight / 2
let maxWH = 300;
let padding = (canvas.clientWidth - maxWH) / 2
let min = centerX - (maxWH / 2)
let max = centerX + (maxWH / 2)
let q = 0

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

    let c = teste2 * 2 - 1  //intervalo -1, 1
    let d = 1 - teste * 2   //intervalo 1, -1

    if (c > 0 && d > 0 && c > d) q = 1
    if (c > 0 && d > 0 && c < d) q = 2
    if (c < 0 && d > 0 && -c < d) q = 3
    if (c < 0 && d > 0 && -c > d) q = 4
    if (c < 0 && d < 0 && c < d) q = 5
    if (c < 0 && d < 0 && c > d) q = 6
    if (c > 0 && d < 0 && c < -d) q = 7
    if (c > 0 && d < 0 && c > -d) q = 8

    drawAngle(teste2 * maxWH + padding, teste * maxWH + padding, q, (q % 2 === 0))
}

function drawAngle(x, y, q, c){
    ctx.strokeStyle = 'red'

    if (q === 1){
        if (!c){
            ctx.beginPath()
            ctx.moveTo(400, centerY)
            ctx.lineTo(400, y)
        }
        else{
            ctx.beginPath()
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, min)
        }
    }
    if (q > 1) {
        drawAngle(x, y, 1, true)

        if (c){
            ctx.beginPath()
            ctx.moveTo(max, min)
            ctx.lineTo(x, min)
        }
        else{
            ctx.beginPath()
            ctx.moveTo(max, min)
            ctx.lineTo(centerX, min)
        }
    }
    if (q > 2) {
        drawAngle(x, y, 2, false)

        if (!c){
            ctx.beginPath()
            ctx.moveTo(max, min)
            ctx.lineTo(x, min)
        }
        else{
            ctx.beginPath()
            ctx.moveTo(centerX, min)
            ctx.lineTo(min, min)
        }
    }
    if (q > 3) {
        drawAngle(x, y, 3, true)

        if (c) {
            ctx.beginPath()
            ctx.moveTo(min, min)
            ctx.lineTo(min, y)
        }
        else {
            ctx.beginPath()
            ctx.moveTo(min, min)
            ctx.lineTo(min, centerY)
        }
    }
    if (q > 4) {
        drawAngle(x, y, 4, true)

        if (!c) {
            ctx.beginPath()
            ctx.moveTo(min, centerY)
            ctx.lineTo(min, y)
        }
        else {
            ctx.beginPath()
            ctx.moveTo(min, centerY)
            ctx.lineTo(min, max)
        }
    }
    if (q > 5) {
        drawAngle(x, y, 5, true)

        if (c) {
            ctx.beginPath()
            ctx.moveTo(min, max)
            ctx.lineTo(x, max)
        }
        else {
            ctx.beginPath()
            ctx.moveTo(min, max)
            ctx.lineTo(centerX, max)
        }
    }
    if (q > 6) {
        drawAngle(x, y, 6, true)

        if (!c) {
            ctx.beginPath()
            ctx.moveTo(centerX, max)
            ctx.lineTo(x, max)
        }
        else {
            ctx.beginPath()
            ctx.moveTo(centerX, max)
            ctx.lineTo(max, max)
        }
    }
    if (q > 7) {
        drawAngle(x, y, 7, true)

        if (c) {
            ctx.beginPath()
            ctx.moveTo(max, max)
            ctx.lineTo(max, y)
        }
    }

    ctx.stroke()
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