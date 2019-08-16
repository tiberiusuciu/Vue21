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
    socket: io('http://192.168.0.111:3000'),
    id: null,
    bettingAmount: "",
    dealer: {},
    users: [],
    currentUser: -1,
    gamePhase: "waitingbet",
    gamestarttime: 0,
    gamestarttimer: null,
    userSecondsLeft: 0,
    askInsurance: false,
    insuranceAnswer: null,
    userTimer: null
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
      clearInterval(state.userTimer);
      state.userTimer = null;
      state.userSecondsLeft = 0;
      state.socket.emit('userHit', { id: state.id });
    },
    userDouble(state) {
      clearInterval(state.userTimer);
      state.userTimer = null;
      state.userSecondsLeft = 0;
      state.socket.emit('userDouble', { id: state.id });
    },
    userSplit(state) {
      clearInterval(state.userTimer);
      state.userTimer = null;
      state.userSecondsLeft = 0;
      state.socket.emit('userSplit', { id: state.id });
    },
    userHold(state) {
      clearInterval(state.userTimer);
      state.userTimer = null;
      state.userSecondsLeft = 0;
      state.socket.emit('userHold', { id: state.id });
    },
    sendUserAnswer(state) {
      state.socket.emit('userAnswer', { id: state.id, answer: state.insuranceAnswer });
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
      if (data === 'revealCard') {
        clearInterval(state.userTimer);
        state.userTimer = null;
        state.userSecondsLeft = 0;
      }

      if (data === 'waitingbet') {
        state.insuranceAnswer = null;
      }
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
    },
    "SOCKET_startUserTimeout": (state, data) => {
      console.log('timer!');
      state.userSecondsLeft = data;

      if (state.userTimer) {
        clearInterval(state.userTimer);
      }
      state.userTimer = setInterval(() => {
        console.log('tick');
        state.userSecondsLeft -= 5;
        if (state.userSecondsLeft <= 0) {
          console.log('timer done!');
          
          clearInterval(state.userTimer);
          state.userTimer = null;

          // if (state.users[state.currentUser].id === state.id && !state.askInsurance) {
          //   state.socket.emit('userHold', { id: state.id });
          // }
        }
      }, 5);
    },
    "SOCKET_askInsurance": (state, data) => {
      state.askInsurance = data;
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
    },
    onSendUserAnswer({commit}, data) {
      commit('sendUserAnswer', data);
    }
  }
})
