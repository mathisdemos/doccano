/* eslint-disable no-unused-vars */
class IMGService {
  matchMetaAndImages(meta, images) {
    const unmatchedImages = []
    meta.forEach((entry) => {
      const id = this.generateFileId(entry.fileName)
      const fileMeta = entry.meta || {}
      const fileLabel = entry.label || null

      if (images[id]) {
        images[id].meta = { ...images[id].meta, ...fileMeta }
        if (fileLabel !== null) images[id].label = fileLabel
      } else {
        unmatchedImages.push(entry.fileName)
      }
    })
    return {
      images: images,
      unmatchedImages: unmatchedImages
    }
  }

  async readImageMeta(file) {
    const reader = new FileReader()
    reader.readAsText(file)
    const meta = await new Promise((resolve) => {
      reader.onload = (e) => {
        resolve(JSON.parse(e.target.result))
      }
    })
    return meta
  }

  async readImages(images) {
    const transformedImages = images.map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      const name = this.generateFileId(file.name)
      const imgObj = {
        meta: {
          id: name,
          fileName: file.name
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

export default new IMGService()
