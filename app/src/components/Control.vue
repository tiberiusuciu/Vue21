<template>
  <div class="control" v-if="isCurrentPlayer()">
    <div class="buttoncontrol hit" @click="hit">
      Hit
    </div>
    <div class="buttoncontrol double" @click="double">
      Double
    </div>
    <div class="buttoncontrol split" @click="split">
      Split
    </div>
    <div class="buttoncontrol hold" @click="hold">
      Hold
    </div>
  </div>
</template>

<script>

export default {
  name: 'control',
  methods: {
    hit() {
      this.$store.dispatch('onUserHit');
    },
    double() {
      this.$store.dispatch('onUserDouble');
    },
    split() {
      var playerHand = this.userInfo.hands[this.userInfo.currentHand];
      if (playerHand.cards[0].charAt(0) === playerHand.cards[1].charAt(0) && !playerHand.hasHit) {
        this.$store.dispatch('onUserSplit');
      }
    },
    hold() {
      this.$store.dispatch('onUserHold');
    },
    isCurrentPlayer() {
      if (this.$store.state.users.length == 0 || this.$store.state.currentUser == -1) {
        return false;
      }
      return this.$store.state.users[this.$store.state.currentUser].id === this.$store.state.id;
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
      else {
        return null;
      }
    }
  }
}
</script>

<style scoped>

    .control {
        position: relative;
        box-sizing: border-box;
        /* height: 20vh; */
        background-color: #040;
    }

    .responsive-wrapper {
      display: inline-block;
    }

    .buttoncontrol {
      display: inline-block;
      width: 150px;
      height: 150px;
      border-radius: 150px;
      margin-left: 40px;
      margin-right: 40px;
      margin-top: -50px;
      border: 10px solid #040;
      background-color: white;
      line-height: 150px;
      font-weight: bold;
      font-size: 1.75em;
      color: white;
      cursor: pointer;
      transition: border-color .1s ease-in-out;
      user-select: none;
    }

    .buttoncontrol:hover {
      border: 10px solid white;
    }

    .hit {
      background: linear-gradient(to left, #33ccff 0%, #ff99cc 100%);
      /* background: linear-gradient(90deg, #1CB5E0 0%, #000851 100%); */
    }

    .double {
      background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
    }

    .split {
      background: linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%);
    }

    .hold {
      background: linear-gradient(90deg, #d53369 0%, #daae51 100%);
    }

    @media screen and (max-width: 800px) {

      .buttoncontrol {
        width: 70px;
        height: 70px;
        margin-left: 5px;
        margin-right: 5px;
        border: 5px solid #040;
        background-color: white;
        line-height: 70px;
        font-weight: bold;
        font-size: 1em;
        margin-top: -20px;
      }

      .buttoncontrol:hover {
        border: 5px solid white;
      }

      .responsive-wrapper {
        display: block;
      }
    }
</style>
