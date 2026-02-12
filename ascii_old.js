let img
let asciiDiv
let useColor = true
let scaleFactor = 8
let fontSize = 8
const density = "Ñ@#W$9876543210?!abc;:+=-,._ "
let asciiCharCount = 0;
let estimatedTextSize = 0;
let lastSavedSize = 0;
let showOriginal = false;
let originalImg
let lineHeight = 0.8

function preload() {
    // idk if this fixes it or not
    // originalImg = loadImage("./toni.jpg")
    originalImg = loadImage("./toni.jpg", img => {
        img.canvas.getContext('2d', { willReadFrequently: true })
    })
}

function setup() {
    noCanvas()

    img = originalImg.get()

    img.loadPixels()

    resizeImageForFontSize()

    imageDiv = createDiv()
    imageDiv.style("position", "absolute")
    imageDiv.style("pointer-events", "none")
    let imgEl = createImg("./toni.jpg")
    imgEl.parent(imageDiv)
    imgEl.style("display", "block")
    imgEl.id("original-image")
    updateImageDivPosition()
    imageDiv.hide()


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

    controlsDiv = createDiv(`
        C: Toggle Color<br>
        ↑/↓: Change Detail<br>
        F/B: Font Size<br>
        O: Toggle Original<br>
    `);

    controlsDiv.style("position", "absolute");
    controlsDiv.style("top", "10px");
    controlsDiv.style("left", "10px");
    controlsDiv.style("color", "white");
    controlsDiv.style("font-family", "monospace");
    controlsDiv.style("font-size", "14px");
    controlsDiv.style("background", "rgba(0,0,0,0.8)");
    controlsDiv.style("padding", "6px 10px");
    controlsDiv.style("border-radius", "6px");
    controlsDiv.style("user-select", "none");

    convertImage()
}


function updateImageDivPosition() {
    if (!asciiDiv || !asciiDiv.elt) return
    const asciiRect = asciiDiv.elt.getBoundingClientRect()
    imageDiv.position(asciiRect.left, asciiRect.top)
    const imgEl = document.getElementById("original-image")
    if (imgEl) {
        imgEl.style.width = asciiRect.width + "px"
        imgEl.style.height = asciiRect.height + "px"
    }
}


function resizeImageForFontSize() {
    img = originalImg.get()
    img.loadPixels()

    const targetHeight = windowHeight * 0.95
    const renderedCharHeight = fontSize * lineHeight
    const neededImageHeight = targetHeight * scaleFactor / renderedCharHeight
    const ratio = neededImageHeight / img.height
    img.resize(floor(img.width * ratio), floor(img.height * ratio))
}

function keyPressed() {
    if (key === "c" || key === "C") {
        useColor = !useColor
        convertImage()
    }
    if (keyCode === UP_ARROW) {
        scaleFactor = max(2, scaleFactor - 1)
        convertImage()
    }
    if (keyCode === DOWN_ARROW) {
        scaleFactor++
        convertImage()
    }
    if (key === 'f' || key === 'F') {
        fontSize = min(fontSize + 1, 30)
        asciiDiv.style("font-size", fontSize + "px")
        resizeImageForFontSize()
        convertImage()
    }
    if (key === 'b' || key === 'B') {
        fontSize = max(fontSize - 1, 4)
        asciiDiv.style("font-size", fontSize + "px")
        resizeImageForFontSize()
        convertImage()
    }
    if (key === 'o' || key === 'O') {
        showOriginal = !showOriginal
        if (showOriginal) {
            imageDiv.show()
        } else {
            imageDiv.hide()
        }
    }
}

function windowResized() {
    setup()
}

function convertImage() {
    const parts = []

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
                parts.push(`<span style="color:rgb(${r},${g},${b})">${char}</span>`)
            } else {
                parts.push(char)
            }
        }
        parts.push("\n")
    }

    asciiDiv.html(parts.join(''))
    setTimeout(updateImageDivPosition, 10)
}

