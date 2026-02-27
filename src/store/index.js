import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: localStorage.getItem('lab-theme') || 'normal',
    viewMode: localStorage.getItem('lab-view-mode') || 'router' // 'router' or 'scroll'
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
      localStorage.setItem('lab-theme', theme)
    },
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode
      localStorage.setItem('lab-view-mode', mode)
    }
  },
  actions: {
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'normal' ? 'tech' : 'normal'
      commit('SET_THEME', newTheme)
    },
    toggleViewMode({ commit, state }) {
      const newMode = state.viewMode === 'router' ? 'scroll' : 'router'
      commit('SET_VIEW_MODE', newMode)
    }
  },
  modules: {
  }
})
