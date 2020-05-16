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
    return this.request.post(`/projects/${projectId}/docs`, chunk)
  }

  chunkArray(arr) {
    let chunk = []
    const chunkedArray = []
    let chunkSize = 0
    const maxChunksize = 2
    arr.forEach((item) => {
      const sizeInMb = item.meta.__size / (1024 * 1024)
      if (sizeInMb > maxChunksize) { // send files that are larger than the specified maxChunkSize in a single request
        chunkedArray.push(chunk)
        chunkSize = sizeInMb
        chunk = [item]
      } else if ((chunkSize + sizeInMb) <= maxChunksize) { // push files to the current chunk as long as it smaller than maxChunkSize
        chunk.push(item)
        chunkSize += sizeInMb
      } else { // start a new chunk when maxChunkSize is reached
        chunkedArray.push(chunk)
        chunkSize = sizeInMb
        chunk = [item]
      }
    })
    return chunkedArray
  }
}

export default new ImageService()
