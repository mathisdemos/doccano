class ImgParser {
  matchMetaAndImages(meta, images) {
    const imgCpy = JSON.parse(JSON.stringify(images))
    const unmatchedImages = []
    meta.forEach((entry) => {
      const id = this.generateFileId(entry.fileName)
      const fileMeta = entry.meta || {}
      const fileLabel = entry.labels || null

      if (imgCpy[id]) {
        imgCpy[id].meta = { ...imgCpy[id].meta, ...fileMeta }
        if (fileLabel !== null) imgCpy[id].labels = fileLabel
      } else {
        unmatchedImages.push(entry.fileName)
      }
    })
    return {
      images: imgCpy,
      unmatchedImages: unmatchedImages
    }
  }

  readImageMeta(file) {
    const reader = new FileReader()
    reader.readAsText(file)
    return new Promise((resolve) => {
      reader.onload = (e) => {
        resolve(JSON.parse(e.target.result))
      }
    })
  }

  async readImages(images) {
    const transformedImages = images.map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      const name = this.generateFileId(file.name)
      const imgObj = {
        meta: {
          id: name,
          fileName: file.name,
          __size: file.size
        },
        text: null
      }
      return new Promise((resolve) => {
        reader.onload = (e) => {
          imgObj.text = e.target.result
          resolve(imgObj)
        }
      })
    })
    const imageObject = await Promise.all(transformedImages)
    return imageObject.reduce((acc, img) => {
      acc[img.meta.id] = img
      return acc
    }, {})
  }

  generateFileId(fileName) {
    let name = fileName.replace(/\s|\./g, '$') // remove whitespace and dots
    name = 'id' + name // prefix with id to avoid leading digits
    return name
  }
}

export default new ImgParser()
