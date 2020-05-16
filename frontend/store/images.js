import ImgParser from '@/services/parsers/imageparser.service'
import ImageService from '@/services/image.service'

export const state = () => ({
  images: {},
  meta: []
})

export const getters = {
}

export const mutations = {
  setImages(state, payload) {
    state.images = payload
  },
  setMeta(state, payload) {
    state.meta = payload
  },
  setMatchedData(state, payload) {
    state.matchedImages = payload
  }
}

export const actions = {
  insertImages({ commit, state }, payload) {
    return ImgParser.readImages(payload).then((images) => {
      commit('setImages', images)
    })
  },
  insertMetaData({ commit }, payload) {
    return ImgParser.readImageMeta(payload).then((meta) => {
      commit('setMeta', meta)
    })
  },
  createImages({ state }, projectId) {
    console.log(state.images)
    return ImageService.uploadImages(projectId, state.images)
  },
  matchMetaAndImages({ state, commit }) {
    const result = ImgParser.matchMetaAndImages(state.meta, state.images)
    commit('setImages', result.images)
    return Promise.resolve(result.unmatchedImages)
  }
}
