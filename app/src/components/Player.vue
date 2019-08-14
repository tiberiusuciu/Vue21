<template>
  <div class="hand">
    <div class="username-tag">
      {{ userInfo.username }}
    </div>

    <div v-if="($store.state.gamePhase === 'waitingbet' || $store.state.gamePhase === 'aboutToStart') && (!userInfo.hasbet && userInfo.username !== '')">
      <div class="betting-area-your-money">
        <div class="available-money-tag">Your Money</div>
        <span class="money-value">
          ${{ userInfo.money - $store.state.bettingAmount }}
        </span>
      </div>
      <div class="betting-area-your-money your-bet">
        <div class="available-money-tag">Your Bet</div>
        <input type="number" class="betting-input" placeholder="Place bet here" @keyup="setAmount" :value="$store.state.bettingAmount" />
      </div>
      <div class="betting-area-confirm" @click="confirmBet">
        Confirm
      </div>
    </div>

    <template v-if="userInfo.hasbet && ($store.state.gamePhase === 'userplay' || $store.state.gamePhase === 'dealingCards' || $store.state.gamePhase === 'revealCard' || $store.state.gamePhase === 'giveRewards')">
      <template v-for="(hand, index) in userInfo.hands">
        <div :key="index" class="hand-area" v-if="hand.cards.length > 0">
          <div class="floating-value">
            <div class="aligned-content">{{hand.currentValue}}</div>
          </div>
          <Card v-for="(card, index) in hand.cards" :key="index" :card_identity="card"/>
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
    height: 40vh;
    border-top: 1px solid #040;
    position: relative;
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
    background-color: #050;
    top: -20px;
    left: 11px;
    padding: 10px 15px;
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
</style>
