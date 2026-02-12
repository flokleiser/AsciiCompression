let img
let asciiDiv
let useColor = true
let scaleFactor = 8
const density = "Ñ@#W$9876543210?!abc;:+=-,._ "

let originalImg

function preload() {
    // originalImg = loadImage("./assets/toni.jpg")
    originalImg = loadImage("assets/toni.jpg")
}

function setup() {
    noCanvas()

    img = originalImg.get()
    img.loadPixels()

    const fontSize = 8
    const lineHeight = 0.8
    const targetHeight = windowHeight * 0.95

    const renderedCharHeight = fontSize * lineHeight
    const neededImageHeight = targetHeight * scaleFactor / renderedCharHeight

    const ratio = neededImageHeight / img.height
    img.resize(floor(img.width * ratio), floor(img.height * ratio))

    asciiDiv = createDiv()
    asciiDiv.style("font-family", "monospace")
    asciiDiv.style("white-space", "pre")
    asciiDiv.style("line-height", lineHeight + "em")
    asciiDiv.style("font-size", fontSize + "px")

    document.body.style.margin = "0"
    document.body.style.display = "flex"
    document.body.style.justifyContent = "center"
    document.body.style.alignItems = "center"
    document.body.style.height = "100vh"
    document.body.style.background = "black"

    convertImage()
}


function keyPressed() {
    if (key === "c" || key === "C") {
        useColor = !useColor
        convertImage()
    }
    if (keyCode === UP_ARROW) {
        scaleFactor = max(2, scaleFactor - 1)
        convertImage()
        console.log("up")
    }

    if (keyCode === DOWN_ARROW) {
        scaleFactor++
        convertImage()
        console.log("down")
    }
}

function windowResized() {
    setup()
}

function convertImage() {
    // img.loadPixels()
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

