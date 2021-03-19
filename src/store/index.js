import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabList: JSON.parse(sessionStorage.getItem('tabList')) ? JSON.parse(sessionStorage.getItem('tabList')) : [],
    tabPath: ''
  },
  mutations: {
    selectTabs(state, value) {
      let index = state.tabList.findIndex(item => item.name === value.name)
      if (index === -1) {

        state.tabList.push(value)
        state.tabList.forEach(item => {
          item.checked = false
        })
        state.tabList[state.tabList.length - 1].checked = true
      } else {
        state.tabList.forEach(item => {
          item.checked = false
        })
        state.tabList[index].checked = true
      }
      sessionStorage.setItem('tabList', JSON.stringify(state.tabList))
    },
    removeTag(state, value) {
      if (state.tabList.length === 1) {
        return
      }
      let index = state.tabList.indexOf(value)
      state.tabList.splice(index, 1)
      sessionStorage.setItem('tabList', JSON.stringify(state.tabList))
    },
    loginOut(state) {
      state.tabList = []
      sessionStorage.setItem('tabList', [])
    }
  },
  actions: {
  },
  modules: {
  }
})
