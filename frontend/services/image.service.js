import ApiService from '@/services/api.service'

class ImageService {
  constructor() {
    this.request = ApiService
  }

  uploadImages(projectId, images) {
    const chunks = this.chunkArray(Object.values(images))
    let uploadedChunks = 0
    const uploadResponses = []
    while (uploadedChunks < chunks.length) {
      uploadResponses.push(this.uploadChunk(projectId, chunks[uploadedChunks]))
      uploadedChunks += 1
    }

    return Promise.all(uploadResponses)
  }

  uploadChunk(projectId, chunk) {
    return this.request.post(`/projects/${projectId}/docs/upload-images`, chunk)
  }

  chunkArray(arr) {
    const maxChunksize = 2048
    const chunkedArray = []

    let chunk = []
    let chunkSize = 0

    arr.forEach((item) => {
      const sizeInMb = item.meta.__size / (1024 * 1024)

      if (sizeInMb > maxChunksize) { // send files that are larger than the specified maxChunkSize in a single request
        if (chunk.length > 0) chunkedArray.push(chunk)
        chunkedArray.push([item])
        chunkSize = 0
      } else if ((chunkSize + sizeInMb) <= maxChunksize) { // push files to the current chunk as long as it smaller than maxChunkSize
        chunk.push(item)
        chunkSize += sizeInMb
      } else { // start a new chunk when maxChunkSize is reached
        chunkedArray.push(chunk)
        chunkSize = sizeInMb
        chunk = [item]
      }
    })

    if (chunk.length > 0) chunkedArray.push(chunk) // push last chunk to array if it contains any items

    return chunkedArray
  }
}

export default new ImageService()
