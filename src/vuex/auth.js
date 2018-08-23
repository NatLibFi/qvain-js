// https://medium.com/front-end-hacking/persisting-user-authentication-with-vuex-in-vue-b1514d5d3278

export default {
  namespaced: true,
  state: {
    token: '',
    user: 'itsme',
    loggedIn: false,
    busy: false,
    projects: {
      '2001036': '',
      project_x: '',
      project_y: '',
    },
  },
  getters: {
    isLoggedIn: function(state) {
      return state.loggedIn
    },
    getUserName: function(state) {
      return state.user
    },
    getProjects: function(state) {
      return Object.keys(state.projects)
    },
  },
  mutations: {
    login(state) {
      state.busy = true
    },
    success(state) {
      state.busy = false
      state.loggedIn = true
    },
    logout(state) {
      state.loggedIn = false
    },
  },
}
