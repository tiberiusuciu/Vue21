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
    socketid: "",
    socket: io('http://localhost:3000'),
    id: null,
    users: [],
  },
  mutations: {
    sendUserInfo(state) {
      state.socket.emit('newUser', { form: state.form, socketId: state.socketid });
    },
    "SOCKET_playerinfo": (state, data) => {
      console.log('playerinfo!', data);
    },
    "SOCKET_users": (state, data) => {
      console.log('users!', data);
    },
    "SOCKET_socketid": (state, data) => {
      state.socketid = data;
    },
  },
  actions: {
    onSendUserInfo({commit}) {
      commit('sendUserInfo');
    },
  }
})
