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
    dealer: {},
    users: [],
    gamestarttime: 0,
    gamestarttimer: null
  },
  mutations: {
    sendUserInfo(state) {
      state.socket.emit('newUser', { form: state.form, socketId: state.socketid });
    },
    confirmUserBet(state) {
      state.socket.emit('userbet', { bettingAmount: state.bettingAmount, id: state.id })
      // state.bettingAmount = 0;
    },
    "SOCKET_playerinfo": (state, data) => {
      state.id = data;
    },
    "SOCKET_users": (state, data) => {
      state.users = data;
    },
    "SOCKET_dealer": (state, data) => {
      state.dealer = data;
    },
    "SOCKET_socketid": (state, data) => {
      state.socketid = data;
    },
    "SOCKET_gamebegintimer": (state, data) => {
      state.gamestarttime = data
      if (state.gamestarttimer) {
        clearInterval(state.gamestarttimer);
      }
      state.gamestarttimer = setInterval(() => {
        state.gamestarttime--;
        if (state.gamestarttime == 0) {
          clearInterval(state.gamestarttimer);
          state.gamestarttimer = null;
        }
      }, 1000)
    }
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
