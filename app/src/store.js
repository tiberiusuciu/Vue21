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
    bettingAmount: "",
    users: [],
  },
  mutations: {
    sendUserInfo(state) {
      state.socket.emit('newUser', { form: state.form, socketId: state.socketid });
    },
    confirmUserBet(state) {
      state.socket.emit('userbet', { bettingAmount: state.bettingAmount, id: state.id })
    },
    "SOCKET_playerinfo": (state, data) => {
      state.id = data;
    },
    "SOCKET_users": (state, data) => {
      state.users = data;
    },
    "SOCKET_socketid": (state, data) => {
      state.socketid = data;
    },
  },
  actions: {
    onSendUserInfo({commit}) {
      commit('sendUserInfo');
    },
    onConfirmUserBet({commit}) {
      commit('confirmUserBet');
    }
  }
})
