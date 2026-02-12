let img
let asciiDiv
let useColor = true
let scaleFactor = 8
const density = "Ñ@#W$9876543210?!abc;:+=-,._ "

function preload() {
    img = loadImage("../assets/toni.jpg")
}

function setup() {
    noCanvas()
    asciiDiv = createDiv()
    asciiDiv.style("font-family", "monospace")
    asciiDiv.style("white-space", "pre")
    asciiDiv.style("line-height", "0.8em")
    asciiDiv.style("font-size", "8px")
    convertImage()
}

function keyPressed() {
    if (key === "c" || key === "C") {
        useColor = !useColor
        convertImage()
    }
    if (key === "+") {
        scaleFactor = max(2, scaleFactor - 1)
        convertImage()
    }
    if (key === "-") {
        scaleFactor++
        convertImage()
    }
}

function convertImage() {
    img.loadPixels()
    let asciiStr = ""

    for (let y = 0; y < img.height; y += scaleFactor) {
        for (let x = 0; x < img.width; x += scaleFactor) {
            const i = (y * img.width + x) * 4
            const r = img.pixels[i]
            const g = img.pixels[i + 1]
            const b = img.pixels[i + 2]

            const brightness = (r + g + b) / 3
            const charIndex = floor(map(brightness, 0, 255, density.length - 1, 0))
            const char = density.charAt(charIndex)

            if (useColor) {
                asciiStr += `<span style="color: rgb(${r},${g},${b})">${char}</span>`
            } else {
                asciiStr += char
            }
        }
        asciiStr += "\n"
    }

    asciiDiv.html(asciiStr)
}

// function keyTyped() {
//     if (key === 's') {
//         saveCanvas('myCanvas', 'jpg');
//         print("saving image");
//     }
//     return false;
// }
