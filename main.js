'use strict'

let maxWH = 300;                                            //largura e altura da caixa em px
let maxVec = 2                                              //maximo de vetores
let canvas = document.getElementById('cv')                  //canvas
let btnZero = document.getElementById('zera')               //botão que zera
let btnClear = document.getElementById('limpa')             //botão que limpa
let btnVector = document.getElementById('vetor')             //botão que limpa
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
btnVector.addEventListener('click', drawToVector)

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

        let o = octant(n.x, n.y)
        
        vectors.push({x: r.x, y: r.y, o: o})
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

function normalizeXY(_x, _y, _padding, _maxWH){
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

function restoreXY(_x, _y, _padding, _maxWH){
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

function normalizeInterval(x, y){
    return {x: x * 2 - 1, y: 1 - y * 2}
}

function octant(x, y){
    let n = normalizeInterval(x, y)
    let cx = n.x
    let cy = n.y

    if (cx > 0 && cy > 0 && cx > cy)    return 1
    if (cx > 0 && cy > 0 && cx < cy)    return 2
    if (cx < 0 && cy > 0 && -cx < cy)   return 3
    if (cx < 0 && cy > 0 && -cx > cy)   return 4
    if (cx < 0 && cy < 0 && cx < cy)    return 5
    if (cx < 0 && cy < 0 && cx > cy)    return 6
    if (cx > 0 && cy < 0 && cx < -cy)   return 7
    if (cx > 0 && cy < 0 && cx > -cy)   return 8
    return 0
}

function drawToAngles(v, p){
    if (v.length < 2 || v.length > 2) return 1

    let equal = v[0].o === v[1].o
    let from = (!equal && (v[0].o < v[1].o)) ? 0 : 1
    let to = (!equal && (v[0].o > v[1].o)) ? 0 : 1

    let n1 = normalizeXY(v[0].x, v[0].y)
    let n2 = normalizeXY(v[1].x, v[1].y)

    n1 = normalizeInterval(n1.x, n1.y)
    n2 = normalizeInterval(n2.x, n2.y)
}

function drawToVector(){
    if (!vectors.length) return 1

    redraw()

    if (vectors.length === 1){
        drawAngle(vectors[0].x, vectors[0].y, vectors[0].o, (vectors[0].o % 2 === 0), 'red')
    }
    else {
        drawToAngles(vectors, 20)
    }

    return 0
}

function drawToMouse(e){
    redraw()

    let n = normalizeXY(e.clientX, e.clientY, padding, maxWH)
    let r = restoreXY(n.x, n.y, padding, maxWH)
    let o = octant(n.x, n.y)

    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(r.x, r.y)
    ctx.stroke()

    drawAngle(r.x, r.y, o, (o % 2 === 0), 'red')
}

function zero(){
    if (vectors.length < maxVec) vectors.push({x: centerX, y: centerY, oct: 0})
    drawAngle(centerX, centerY, 0, true, 'red')
    redraw()
}

function drawAngle(x, y, oct, comp, color){
    ctx.strokeStyle = color
    ctx.beginPath()

    if (oct === 0){
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
    }
    if (oct === 1){
        if (!comp){
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, y)
        }
        else{
            ctx.moveTo(max, centerY)
            ctx.lineTo(max, min)
        }
    }
    if (oct > 1) {
        drawAngle(x, y, 1, true, 'color')

        if (comp){
            ctx.moveTo(max, min)
            ctx.lineTo(x, min)
        }
        else{
            ctx.moveTo(max, min)
            ctx.lineTo(centerX, min)
        }
    }
    if (oct > 2) {
        drawAngle(x, y, 2, false, 'color')

        if (!comp){
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
        drawAngle(x, y, 3, true, 'color')

        if (comp) {
            ctx.moveTo(min, min)
            ctx.lineTo(min, y)
        }
        else {
            ctx.moveTo(min, min)
            ctx.lineTo(min, centerY)
        }
    }
    if (oct > 4) {
        drawAngle(x, y, 4, true, 'color')

        if (!comp) {
            ctx.moveTo(min, centerY)
            ctx.lineTo(min, y)
        }
        else {
            ctx.moveTo(min, centerY)
            ctx.lineTo(min, max)
        }
    }
    if (oct > 5) {
        drawAngle(x, y, 5, true, 'color')

        if (comp) {
            ctx.moveTo(min, max)
            ctx.lineTo(x, max)
        }
        else {
            ctx.moveTo(min, max)
            ctx.lineTo(centerX, max)
        }
    }
    if (oct > 6) {
        drawAngle(x, y, 6, true, 'color')

        if (!comp) {
            ctx.moveTo(centerX, max)
            ctx.lineTo(x, max)
        }
        else {
            ctx.moveTo(centerX, max)
            ctx.lineTo(max, max)
        }
    }
    if (oct > 7) {
        drawAngle(x, y, 7, true, 'color')

        if (comp) {
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