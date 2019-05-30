'use strict'

let maxWH = 300;                                            //largura e altura da caixa em px
let maxVec = 2                                              //maximo de vetores
let canvas = document.getElementById('cv')                  //canvas
let btnZero = document.getElementById('zera')               //botão que zera
let btnClear = document.getElementById('limpa')             //botão que limpa
let ctx = canvas.getContext('2d')                           //contexto
let centerX = canvas.clientWidth / 2                        //centro em x
let centerY = canvas.clientHeight / 2                       //centro em y
let padding = (canvas.clientWidth - maxWH) / 2              //distancia das bordas ao quadrado
let min = centerX - (maxWH / 2)                             //distancia minima
let max = centerX + (maxWH / 2)                             //distancia maxima
let oct = 0                                                 //octante
let vectors = []                                            //guarda os vetores

canvas.addEventListener('mousemove', drawToMouse)
canvas.addEventListener('click', click)
btnZero.addEventListener('click', zero)
btnClear.addEventListener('click', clearCanvas)

ctx.fillStyle = 'black'
drawGrid()

function click(e){
    if (vectors.length >= maxVec) return
    else{
        let n = normalizeXY(e.clientX, e.clientY, padding, maxWH)
        let r = restoreXY(n.x, n.y, padding, maxWH)

        ctx.beginPath();
		ctx.arc(r.x, r.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        vectors.push({x: r.x, y: r.y, o: oct})
    }
}

function drawVectors(){
    if (!vectors.length) return
    else{
        for (let i = 0; i < vectors.length; i++){
            ctx.beginPath();
            ctx.arc(vectors[i].x, vectors[i].y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(vectors[i].x, vectors[i].y)
            ctx.stroke()
        }
    }
}

function normalizeXY(_x, _y){
    let x = _x
    let y = _y

    x = (x - padding) / maxWH
    if (x < 0) x = 0
    if (x > 1) x = 1
    
    y = (y - padding) / maxWH
    if (y < 0) y = 0
    if (y > 1) y = 1

    return {x: x, y: y}
}

function restoreXY(_x, _y){
    let x = _x
    let y = _y

    x = x * maxWH + padding
    y = y * maxWH + padding

    return {x: x, y: y}
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath()
}

function drawToMouse(e){
    redraw()

    let n = normalizeXY(e.clientX, e.clientY, padding, maxWH)
    let r = restoreXY(n.x, n.y, padding, maxWH)

    let cx = n.x * 2 - 1  //normaliza no intervalo -1, 1
    let cy = 1 - n.y * 2  //normaliza no intervalo 1, -1

    if (cx > 0 && cy > 0 && cx > cy)    oct = 1
    if (cx > 0 && cy > 0 && cx < cy)    oct = 2
    if (cx < 0 && cy > 0 && -cx < cy)   oct = 3
    if (cx < 0 && cy > 0 && -cx > cy)   oct = 4
    if (cx < 0 && cy < 0 && cx < cy)    oct = 5
    if (cx < 0 && cy < 0 && cx > cy)    oct = 6
    if (cx > 0 && cy < 0 && cx < -cy)   oct = 7
    if (cx > 0 && cy < 0 && cx > -cy)   oct = 8

    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(r.x, r.y)
    ctx.stroke()

    drawAngle(r.x, r.y, oct, (oct % 2 === 0))
}

function zero(){
    if (vectors.length < maxVec) vectors.push({x: max, y: centerY, oct: 0})
    drawAngle(max, centerY, 0, true)
    redraw()
}

function drawAngle(x, y, oct, comp){
    ctx.strokeStyle = 'red'

    if (oct === 0){
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
    }
    if (oct === 1){
        if (!comp){
            ctx.beginPath()
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, y)
        }
        else{
            ctx.beginPath()
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, min)
        }
    }
    if (oct > 1) {
        drawAngle(x, y, 1, true)

        if (comp){
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
    if (oct > 2) {
        drawAngle(x, y, 2, false)

        if (!comp){
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
    if (oct > 3) {
        drawAngle(x, y, 3, true)

        if (comp) {
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
    if (oct > 4) {
        drawAngle(x, y, 4, true)

        if (!comp) {
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
    if (oct > 5) {
        drawAngle(x, y, 5, true)

        if (comp) {
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
    if (oct > 6) {
        drawAngle(x, y, 6, true)

        if (!comp) {
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
    if (oct > 7) {
        drawAngle(x, y, 7, true)

        if (comp) {
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
    drawVectors()
}