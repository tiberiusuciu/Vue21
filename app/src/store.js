import Vue from 'vue'
import Vuex from 'vuex'

import io from 'socket.io-client';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    form: {
      username: ""
    },
    socketid: "",
    socket: io('http://localhost:3000'),
    id: null,
    bettingAmount: "",
    dealer: {},
    users: [],
    currentUser: -1,
    gamePhase: "waitingbet",
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
    userHit(state) {
      state.socket.emit('userHit', { id: state.id });
    },
    userDouble(state) {
      state.socket.emit('userDouble', { id: state.id });
    },
    userSplit(state) {
      state.socket.emit('userSplit', { id: state.id });
    },
    userHold(state) {
      state.socket.emit('userHold', { id: state.id });
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
    "SOCKET_gamephasechange": (state, data) => {
      state.gamePhase = data;
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
    },
    "SOCKET_assignNextPlayer": (state, data) => {
      state.currentUser = data;
    }
  },
  actions: {
    onSendUserInfo({commit}) {
      commit('sendUserInfo');
    },
    onConfirmUserBet({commit}) {
      commit('confirmUserBet');
    },
    onUserHit({commit}) {
      commit('userHit');
    },
    onUserDouble({commit}) {
      commit('userDouble');
    },
    onUserSplit({commit}) {
      commit('userSplit');
    },
    onUserHold({commit}) {
      commit('userHold');
    }
  }
})
