<template>
  <div id="app">
    <template v-if="$store.state.id === null">
      <div class="overlay-area">
        <div class="form-area">
          <h1>Welcome to Vue21</h1>
          <p>Before going any further, please identify yourself with a username</p>
          <div class="username-area input-area">
            <div><i class="fas fa-user"></i></div>
            <input type="text" placeholder="Username" v-model="$store.state.form.username" @keyup.enter="sendUserInfo" autofocus />
          </div>
          <div class="submit-area input-area" @click="sendUserInfo">
            Submit
          </div>
        </div>
      </div>
    </template>
    <template v-if="$store.state.id !== null">
      <Dealer />
      <div class="timer-area">
        <div v-if="$store.state.userSecondsLeft > 0 && !$store.state.askInsurance" class="usertimer" :style="{width: 100 * ($store.state.userSecondsLeft / 15000) + '%'}">
        </div>
      </div>
      <BettingBox />
      <Player />
      <Control v-if="$store.state.gamePhase === 'userplay'"/>
      <OtherPlayer />
      <InsuranceDialog v-if="$store.state.askInsurance" />
    </template>
  </div>
</template>

<script>
import Player from './components/Player.vue'
import Dealer from './components/Dealer.vue'
import Control from './components/Control.vue'
import OtherPlayer from './components/OtherPlayer.vue'
import InsuranceDialog from './components/InsuranceDialog.vue'
import BettingBox from './components/BettingBox.vue'

export default {
  name: 'app',
  components: {
    Player,
    Dealer,
    Control,
    OtherPlayer,
    InsuranceDialog,
    BettingBox
  },
  methods: {
    sendUserInfo() {
      this.$store.state.form.username = this.$store.state.form.username.trim().substring(0, 8);
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
    background-color: #040;
    height: 100vh;
    box-sizing: border-box;
    text-align: center;
    position: relative;
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

  .usertimer {
    /* position: absolute; */
    /* left: 0px; */
    /* top: -2px; */
    height: 4px;
    background-color: #292;
  }

  .timer-area {
    width: 100%;
    height: 4px;
  }


  @media screen and (max-width: 800px) {
      .overlay-area {
        padding: 0px;
      }

      .input-area div {
        width: 50px;
        padding: 0px 10px;
      }

      .form-area {
        background-color: ghostwhite;
        width: 100%;
        height: 100%;
        border-radius: 0px;
        padding: 20px;
        box-sizing: border-box;
        max-width: 100%;
        min-width: 0px;
        max-height: 100%;
        min-height: 0px;
        padding-top: 35%;
      }

      .form-area p {
        padding: 0px 40px;
      }
  }

  @media screen and (min-width: 800px) and (max-height: 700px) {
    /* .name-area {
      box-sizing: border-box;
      flex: 1;
      padding-top: 150px;
      padding-left: 10px;
    } */
  }

</style>
