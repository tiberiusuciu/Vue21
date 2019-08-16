<template>
  <div class="hand" :class="{'unactive': $store.state.currentUser !== $store.state.id}">
    <div class="username-tag">
      <div>
        {{ userInfo.username }}
      </div>
      <div style="font-size: 1.25em;" v-if="$store.state.gamePhase !== 'waitingbet'">
        (<i class="far fa-dollar-sign" style="color:lime;"></i> {{ userInfo.money }})
      </div>
    </div>

    <div v-if="$store.state.userSecondsLeft > 0 && !$store.state.askInsurance" class="usertimer" :style="{width: 100 * ($store.state.userSecondsLeft / 15000) + '%'}">
    </div>

    <div v-if="(
      $store.state.gamePhase === 'waitingbet' || 
      $store.state.gamePhase === 'aboutToStart') &&
      (!userInfo.hasbet && userInfo.username !== '') &&
      userInfo.money > 0">
      <div class="betting-area-your-money">
        <div class="available-money-tag">Your Money</div>
        <span class="money-value">
          ${{ userInfo.money - $store.state.bettingAmount }}
        </span>
      </div>
      <div class="betting-area-your-money your-bet">
        <div class="available-money-tag">Your Bet ($)</div>
        <input type="number" class="betting-input" placeholder="Place bet here" @keyup="setAmount" :value="$store.state.bettingAmount" />
      </div>
      <div class="betting-area-confirm" @click="confirmBet">
        Confirm
      </div>
    </div>

    <div v-if="!(userInfo.money > 0) && !userInfo.hasbet" class="game-over">
      <div class="game-over-label-area">
        <dir class="game-over-label">
          Game Over
        </dir>
      </div>
      No more money, thank you for playing! Refresh this page to start again!
    </div>

    <template v-if="userInfo.hasbet && ($store.state.gamePhase === 'userplay' || $store.state.gamePhase === 'dealingCards' || $store.state.gamePhase === 'revealCard' || $store.state.gamePhase === 'giveRewards')">
      <template v-for="(hand, index) in userInfo.hands">
        <div :key="index" class="hand-area" v-if="hand.cards.length > 0">
          <div class="floating-value">
            <div class="aligned-content" :class="{'unactive': $store.state.currentUser !== $store.state.id}">{{hand.currentValue}}</div>
          </div>

          <div class="feedback currenthand" v-if="userInfo.currentHand === index && userInfo.id === $store.state.currentUser && $store.state.gamePhase === 'userplay'" :class="{'unactive': $store.state.currentUser !== $store.state.id}">
              <i class="fas fa-eye"></i>
          </div>

          <div class="feedback blackjack" v-if="hand.hasBlackJack" :class="{'unactive': $store.state.currentUser !== $store.state.id}">
            <div class="star">
              <i class="fas fa-star"></i>
            </div>
          </div>

          <template v-if="$store.state.dealer.hands && $store.state.dealer.hands[0]">
            <div class="feedback bust" v-if="$store.state.dealer.hands && hand.currentValue > 21 || ($store.state.dealer.hands[0].instantLose && !hand.hasBlackJack)" :class="{'unactive': $store.state.currentUser !== $store.state.id}">
              <i class="fas fa-times"></i>
            </div>

            <div class="feedback double" v-else-if="hand.hasDoubled" :class="{'unactive': $store.state.currentUser !== $store.state.id}">
              <i class="fal fa-times"></i>2
            </div>
          </template>



          <Card v-for="(card, index) in hand.cards" :key="index" :card_identity="card"/>
          <div class="floating-betting-box">
            <div class="betting-box" :class="{'unactive': $store.state.currentUser !== $store.state.id}">
              <i class="far fa-dollar-sign" style="color:lime;"></i> {{ hand.hasDoubled ? hand.currentBet / 2 : hand.currentBet }}
            </div>
          </div>
        </div>
      </template>
    </template>

  </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'player',
  components: {
    Card
  },
  methods: {
    setAmount(e) {
      if (isNaN(e.target.value) || e.target.value == "" || parseInt(e.target.value) < 0) {
        e.target.value = 0;
      }
      if (parseInt(e.target.value) > this.userInfo.money) {
        e.target.value = this.userInfo.money
      }
      this.$store.state.bettingAmount = parseInt(e.target.value);
    },
    confirmBet() {
      if (this.$store.state.bettingAmount <= this.userInfo.money) {
        this.$store.dispatch('onConfirmUserBet');
        if (this.$store.state.bettingAmount > this.userInfo.money - this.$store.state.bettingAmount) {
            this.$store.state.bettingAmount = 0;
        }
      }
    }
  },
  computed: {
    userInfo() {
      if (this.$store.state.id !== null) {
        for (var i = 0; i < this.$store.state.users.length; i++) {
          if (this.$store.state.users[i].id === this.$store.state.id) {
            return this.$store.state.users[i];
          }
        }
      }
      return {
        username: '',
        hands: [
          {
            cards: []
          }
        ]
      };
    }
  },
}
</script>

<style scoped>
  .hand {
    padding-top: 50px;
    box-sizing: border-box;
    height: 45vh;
    border-top: 1px solid #040;
    position: relative;
    background-color: #050;
  }
  .username-tag {
    color: white;
    position: absolute;
    top: 25px;
    left: 25px;
    letter-spacing: 1px;
  }

  .betting-area-your-money {
    display: inline-block;
    border: 2px solid white;
    border-radius: 6px;
    min-width: 100px;
    width: fit-content;
    margin: auto;
    position: relative;
    padding: 30px 40px;
    color: white;
    letter-spacing: 1px;
    margin-right: 50px;
    margin-left: 50px;
  }

  .available-money-tag {
    position: absolute;
    /* background-color: #050; */
    top: -20px;
    left: 11px;
    padding: 10px 15px;
    background-color: #040;
  }

  .money-value {
    font-size: 1.25em;
  }

  .your-bet {
    padding: 0px 10px;
    height: 87px;
    box-sizing: border-box;
    min-width: 100px;
    width: fit-content;
  }

  .betting-input {
    height: 100%;
    box-sizing: border-box;
    text-align: center;
    border-radius: 6px;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-size: 1.25em;
    letter-spacing: 1px;
    width: 165px;
  }

  .betting-input::placeholder {
    color: white;
  }

  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }

  .betting-area-confirm {
    width: 100px;
    margin: auto;
    height: 60px;
    line-height: 60px;
    border-radius: 6px;
    color: black;
    background-color: ghostwhite;
    letter-spacing: 1px;
    margin-top: 50px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    font-weight: bold;
    user-select: none;
  }
  .betting-area-confirm:hover {
    background-color: white;
  }

  .hand-area {
    border: 1px solid white;
    display: inline-block;
    padding: 50px;
    position: relative;
    border-radius: 6px;
    box-sizing: border-box;
    margin-left: 30px;
    margin-right: 30px;
  }

  .floating-value {
    position: absolute;
    top: -30px;
    left: 0px;
    width: 100%;
    text-align: center;
    margin: auto;
  }

  .aligned-content {
    width: 100px;
    margin: auto;
    font-size: 2.5em;
    border: 1px solid white;
    background-color: #050;
    color: white;
    padding: 10px;
    border-radius: 6px;
  }

  .floating-betting-box {
    user-select: none;
    position: absolute;
    text-align: center;
    bottom: -41px;
    width: 100%;
    left: 0px;
  }

  .betting-box {
    color: white;
    font-size: 1.75em;
    background-color: #050;
    padding: 20px 15px;
    border: 3px solid white;
    box-sizing: border-box;
    border-radius: 50px;
    margin: auto;
    width: fit-content;
  }

  .game-over {
    color: white;
    font-weight: normal;
    letter-spacing: 1px;
    font-size: 1.5em;
    width: 500px;
    margin: auto;
    padding: 50px;
    border: 2px solid white;
    border-radius: 6px;
    position: relative;
    user-select: none;
    /* box-sizing: border-box; */
  }

  .game-over-label-area {
    position: absolute;
    top: -15px;
    left: 0px;
    /* padding: 0px 50px; */
    width: 100%;
  }

  .game-over-label {
    background-color: #040;
    width: 160px;
    margin: auto;
  }

  .feedback {
    background-color: #050;
    border: 3px solid white;
    border-radius: 50px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    position: absolute;
    top: -27px;
    right: -28px;
  }

  .bust {
    color: #F22;
    font-size: 2.5em;
  }

  .double i {
    vertical-align: middle;
  }

  .unactive {
    background-color: #040;
  }
  
  .double {
    color: white;
    font-size: 1.75em;
    background: #2b5876;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #4e4376, #2b5876);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #4e4376, #2b5876); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .blackjack {
    color: white;
    font-size: 1.75em;
    background: #4e54c8;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #8f94fb, #4e54c8);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #8f94fb, #4e54c8); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .currenthand {
    color: white;
    font-size: 1.75em;
    left: -28px;
    line-height: 53px;
    background: #11998e;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #38ef7d, #11998e);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  }

  .star {
    animation-name: spin;
    animation-duration: 2500ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear; 
  }

  @keyframes spin {
      from {
          transform:rotate(0deg);
      }
      to {
          transform:rotate(360deg);
      }
  }

  .usertimer {
    position: absolute;
    left: 0px;
    top: -2px;
    height: 4px;
    background-color: #292;
  }
</style>
