<template>
  <div id="app">
    <template v-if="$store.state.id === null">
      <div class="overlay-area">
        <div class="form-area">
          <h1>Welcome to Vue21</h1>
          <p>Before going any further, please identify yourself with a username</p>
          <div class="username-area input-area">
            <div><i class="fas fa-user"></i></div>
            <input type="text" placeholder="Username" v-model="$store.state.form.username" @keyup.enter="sendUserInfo" />
          </div>
          <div class="submit-area input-area" @click="sendUserInfo">
            Submit
          </div>
        </div>
      </div>
    </template>
    <template v-if="$store.state.id !== null">
      <Dealer />
      <Player />
      <Control v-if="$store.state.currentUser === $store.state.id && $store.state.gamePhase === 'userplay'"/>
    </template>
  </div>
</template>

<script>
import Player from './components/Player.vue'
import Dealer from './components/Dealer.vue'
import Control from './components/Control.vue'

export default {
  name: 'app',
  components: {
    Player,
    Dealer,
    Control
  },
  methods: {
    sendUserInfo() {
      if (this.$store.state.form.username !== "") {
        this.$store.dispatch('onSendUserInfo');
      }
    }
  }
}
</script>

<style>
  * {
    margin: 0px;
    padding: 0px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #050;
    height: 100vh;
    box-sizing: border-box;
    text-align: center;
  }

  .overlay-area {
    position: absolute;
    height: 100vh;
    width: 100%;
    padding: 200px 600px;
    box-sizing: border-box;
    background-color: #000000AA;
    z-index: 1;
  }

  .form-area {
    background-color: ghostwhite;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    padding: 125px 100px;
    box-sizing: border-box;
    max-width: 635px;
    min-width: 556px;
    max-height: 547px;
    min-height: 547px;
    margin: auto;
  }

  .form-area p {
    margin: auto;
    margin-top: 40px;
    padding: 0px 80px;
  }

  .input-area div, .input-area input {
    display: inline-block;
    height: 60px;
    box-sizing: border-box;
    line-height: 60px;
  }

  .input-area {
    margin-top: 30px;
    background-color: white;
    height: 60px;
    display: flex;
    border: 1px solid black;
    border-radius: 6px;
  }

  .input-area div {
    width: 50px;
  }

  .input-area input {
    border: 0px;
    flex: 1;
    background-color: transparent;
    outline: none;
    font-size: 1.5em;
  }

  .input-area input[type=number]::-webkit-inner-spin-button, 
  .input-area input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }

  .submit-area {
    border: none;
    background: rgb(164,128,210);
    background: linear-gradient(90deg, rgba(164,128,210,1) 0%, rgba(103,166,203,1) 50%, rgba(94,92,232,1) 100%);
    cursor: pointer;
    transition: opacity .08s ease-in-out;
    line-height: 60px;
    text-align: center;
    color: white;
    font-weight: bold;
    letter-spacing: 1px;
    display: block;
    user-select: none;
  }

  .submit-area:hover {
    opacity: .75;
  }

</style>
