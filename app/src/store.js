import Vue from 'vue'
import Vuex from 'vuex'

import io from 'socket.io-client';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    form: {
      username: "",
      money: ""
    },
    socket: io('http://localhost:3000'),
    id: null,
    users: [],
  },
  mutations: {
    sendUserInfo(state) {
      state.socket.emit('newUser', state.form);
    }
  },
  actions: {
    onSendUserInfo({commit}) {
      commit('sendUserInfo');
    },
    "SOCKET_welcome": (state, data) => {
      // console.log(data);
    }
  }
})
