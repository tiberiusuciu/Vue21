<template>
  <div class="hand" :class="{'unactive': !isCurrentPlayer()}">
    <div class="username-tag">
      <div>
        {{ userInfo.username }}
      </div>
      <div v-if="$store.state.gamePhase !== 'waitingbet'" class="info-money-tag">
        (<i class="far fa-dollar-sign" style="color:lime;"></i> {{ userInfo.money }})
      </div>
    </div>

    <!-- <div v-if="!(userInfo.money > 0) && !userInfo.hasbet" class="game-over">
      <div class="game-over-label-area">
        <dir class="game-over-label">
          Game Over
        </dir>
      </div>
      No more money, thank you for playing! Refresh this page to start again!
    </div> -->

    <div class="game-over-button" v-if="!(userInfo.money > 0) && !userInfo.hasbet" @click="onPlayAgain()">
      Out of money &middot; Play again
    </div>

    <template v-if="userInfo.hasbet && ($store.state.gamePhase === 'userplay' || $store.state.gamePhase === 'dealingCards' || $store.state.gamePhase === 'revealCard' || $store.state.gamePhase === 'giveRewards')">
      <template v-for="(hand, index) in userInfo.hands">
        <div :key="index" class="hand-area" v-if="hand.cards.length > 0">
          <div class="floating-value">
            <div class="aligned-content" :class="{'unactive': !isCurrentPlayer()}">{{hand.currentValue}}</div>
          </div>

          <div class="feedback currenthand" v-if="userInfo.currentHand === index && isCurrentPlayer() && $store.state.gamePhase === 'userplay'" :class="{'unactive': !isCurrentPlayer()}">
              <i class="fas fa-eye"></i>
          </div>

          <div class="feedback blackjack" v-if="hand.hasBlackJack" :class="{'unactive': !isCurrentPlayer()}">
            <div class="star">
              <i class="fas fa-star"></i>
            </div>
          </div>

          <template v-if="$store.state.dealer.hands && $store.state.dealer.hands[0]">
            <div class="feedback bust" v-if="$store.state.dealer.hands && hand.currentValue > 21 || ($store.state.dealer.hands[0].instantLose && !hand.hasBlackJack)" :class="{'unactive': !isCurrentPlayer()}">
              <i class="fas fa-times"></i>
            </div>

            <div class="feedback double" v-else-if="hand.hasDoubled" :class="{'unactive': !isCurrentPlayer()}">
              <i class="fal fa-times"></i>2
            </div>
          </template>



          <Card v-for="(card, index) in hand.cards" :key="index" :card_identity="card"/>
          <div class="floating-betting-box">
            <div class="betting-box" :class="{'unactive': !isCurrentPlayer()}">
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
    isCurrentPlayer() {
      if (this.$store.state.users.length == 0 || this.$store.state.currentUser == -1) {
        return false;
      }
      return this.$store.state.users[this.$store.state.currentUser].id === this.$store.state.id;
    },
    onPlayAgain() {
      this.$store.dispatch('onPlayAgain');
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
    /* in case we overflow, we could go horizontal */
    /* overflow-x: scroll;
      white-space: nowrap;
      overflow-y: hidden;
      padding: inherit 50px;
      padding-left: 20px;
      padding-right: 20px; */
  }
  .username-tag {
    color: white;
    position: absolute;
    top: 25px;
    left: 25px;
    letter-spacing: 1px;
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

  .game-over-button {
    background: #11998e;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #38ef7d, #11998e);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    width: fit-content;
    padding: 20px 65px;
    margin: auto;
    border-radius: 35px;
    font-weight: bold;
    color: ghostwhite;
    cursor: pointer;
    letter-spacing: 1px;
  }

  @keyframes spin {
      from {
          transform:rotate(0deg);
      }
      to {
          transform:rotate(360deg);
      }
  }

  .info-money-tag {
    font-size: 1.25em;
  }

  @media screen and (max-width: 800px) {
    .hand {
      padding-top: 80px;
      overflow-x: scroll;
      white-space: nowrap;
      overflow-y: hidden;
      padding: inherit 50px;
      padding-left: 20px;
      padding-right: 20px;
      -webkit-overflow-scrolling: touch;
    }

    .hand-area {
      padding: 25px 5px;
      margin-left: 25px;
      margin-right: 25px;
    }

    .betting-area-your-money {
      display: inline-block;
      border: 2px solid white;
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

    .betting-box {
      font-size: 1.25em;
      padding: 13px 10px;
      border: 2px solid white;
    }

    .floating-betting-box {
      user-select: none;
      position: absolute;
      text-align: center;
      bottom: -41px;
      width: 100%;
      left: 0px;
    }

    .aligned-content {
      width: 50px;
      font-size: 1.5em;
      padding: 5px;
    }

    .floating-betting-box {
      bottom: -32px;
    }

    .floating-value {
      top: -20px;
    }

    .feedback {
      width: 35px;
      height: 35px;
      line-height: 38px;
      top: -21px;
      left: -21px;
      font-size: 1.3em;
      border: 2px solid white;
    }

    .username-tag {
      top: calc(40vh + 10px);
      position: fixed;
      left: 5px;
      letter-spacing: 1px;
    }

    .info-money-tag {
      font-size: 1.15em;
    }

    .bust, .double, .blackjack {
      right: -20px;
      left: auto;
      line-height: 35px;
    }
  }
</style>
