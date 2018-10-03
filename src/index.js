const { Canvas, Image } = require('canvas')

module.exports = (buffer, quality = 20) => {
  if (!(buffer instanceof Buffer)) throw new TypeError('You must provide a valid buffer.')
  const img = new Image()
  img.src = buffer
  const canvas = new Canvas(img.width, img.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const { data: pixels } = ctx.getImageData(0, 0, img.width, img.height)
  const pixelCount = img.width * img.height
  var pixelArray = []
  for (var i = 0, offset; i < pixelCount; i = i + quality) {
    offset = i * 4
    const obj = { r: pixels[offset + 0], g: pixels[offset + 1], b: pixels[offset + 2], a: pixels[offset + 3] }
    const found = pixelArray.find(e => e.r === obj.r && e.g === obj.g && e.b === obj.b && e.a === obj.a)
    if (found) found.count++
    else pixelArray.push({ count: 1, ...obj })
  }
  return pixelArray.sort((a, b) => a.count > b.count ? -1 : 1).slice(0, 3)
}
