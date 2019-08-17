<template>
    <div class="game-over-button" v-if="!(userInfo.money > 0) && !userInfo.hasbet" @click="onPlayAgain()">
      Out of money &middot; Play again
    </div>
</template>

<script>
import GameOver from './GameOver.vue'

export default {
  name: 'GameOver',
  components: {
    GameOver
  },
  methods: {
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
</style>
