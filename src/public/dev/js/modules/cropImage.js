const Jimp = require('jimp')

const crop = (imageFile, aspectRatio, newSize) => {
  return new Promise((resolve) => {
    // Lee la imágen
    Jimp.read(imageFile)
      .then(img => {
        // Define las propiedadesde la imagen
        let image = {}
        image.width = img.getWidth()
        image.height = img.getHeight()
        image.aspectRatio = image.width / image.height
        image.outputWidth = image.width
        image.outputHeight = image.height

        /* Si es mayor que nuestro aspectRatio
          Asigna el ancho y alto de la imagen */
        if (image.aspectRatio > aspectRatio) {
          image.outputWidth = image.height * aspectRatio
        } else if(image.aspectRatio < aspectRatio) {
          image.outputHeight = image.width / aspectRatio
        }
        // Calcula la posición a recortar la imágen
        image.x = (image.width - image.outputWidth) * .5
        image.y = (image.height - image.outputHeight) * .5
        // Recorta la imágen
        img.crop(image.x, image.y, image.outputWidth, image.outputHeight)
        // Redimenciona la imágen
        img.resize(170,170)
        // Comprime la imagen
        img.quality(70)
        // Obtiene el URI en base64
        img.getBase64(Jimp.AUTO, (err,res) => resolve(res))

      })

  })
}

module.exports = crop