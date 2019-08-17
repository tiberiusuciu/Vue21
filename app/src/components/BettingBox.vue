<template>
    <div v-if="(
      $store.state.gamePhase === 'waitingbet' || 
      $store.state.gamePhase === 'aboutToStart') &&
      (!userInfo.hasbet && userInfo.username !== '') &&
      userInfo.money > 0" class="betting-box-overlay">
      <div class="betting-box-area">
        <div class="betting-box">
            <div class="betting-inputs">
                <div class="betting-area-your-money your-money-area">
                    <div class="available-info">Your Money</div>
                    <div class="money-value" style="color: lime;">
                        ${{ userInfo.money - $store.state.bettingAmount }}
                    </div>
                </div>
                <div class="betting-area-your-money your-bet">
                    <div class="available-info">Your Bet ($)</div>
                    <input type="number" class="betting-input" placeholder="Bet here" @keyup="setAmount" :value="$store.state.bettingAmount" autofocus />
                </div>
            </div>
            <div class="betting-confirm">
                <div class="betting-area-confirm" @click="confirmBet">
                    Confirm
                </div>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'BettingBox',
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
      if (this.$store.state.bettingAmount <= this.userInfo.money && this.$store.state.bettingAmount !== "" && Number.isInteger(this.$store.state.bettingAmount) && this.$store.state.bettingAmount >= 1) {
        this.$store.dispatch('onConfirmUserBet');
        if (this.$store.state.bettingAmount > this.userInfo.money - this.$store.state.bettingAmount) {
            this.$store.state.bettingAmount = 0;
        }
      }
    },
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
    .betting-box-overlay {
        width: 100%;
        height: 100vh;
        background-color: #00000044;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 2;
    }

    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

    .betting-box-area {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 30vh;
        z-index: 1;
    }

    .betting-box {
        /* background-color: white; */
        /* width: min-content; */
        width: 200px;
        height: 200px;
        /* padding: 30px; */
        margin: auto;
        display: flex;
        border-radius: 6px;
    }

    .betting-inputs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .betting-box * {
        width: 100%;
    }

    .betting-confirm {
        flex: 1;
    }

    .betting-confirm * {
        width: 100%;
    }

    .betting-area-your-money {
        flex: 1;
        position: relative;
    }

    .available-info {
        position: absolute;
        top: 5px;
        color: ghostwhite;
    }

    .your-money-area {
        background-color: #222;
        height: 100%;
        box-sizing: border-box;
        color: ghostwhite;
        padding-left: 0px;
        padding-right: 0px;
        border-top-left-radius: 6px;
        text-align: center;
        box-sizing: border-box;
        /* line-height: 200px; */
    }

    .money-value {
        margin-top: 45px;
        letter-spacing: 1px;
    }

    .your-bet input {
        background-color: #222;
        height: 100%;
        border: none;
        outline: none;
        box-sizing: border-box;
        color: ghostwhite;
        padding-left: 10px;
        padding-right: 10px;
        border-bottom-left-radius: 6px;
        text-align: center;
        letter-spacing: 1px;
    }

    .your-bet input::placeholder {
        color: ghostwhite;
    }

    .betting-confirm {
        background-color: ghostwhite;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        line-height: 200px;
        letter-spacing: 1px;
        font-weight: bold;
        cursor: pointer;
    }
</style>
