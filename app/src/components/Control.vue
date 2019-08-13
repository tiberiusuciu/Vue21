<template>
  <div class="control">
      <!-- <div class="betting-controls" v-if="userInfo !== null">
          <div class="available-money">
              ${{userInfo.money}}
          </div>
          <div>

          </div>
      </div> -->
  </div>
</template>

<script>

export default {
  name: 'control',
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
        height: 20vh;
        background-color: #040;
    }

    .betting-controls {
        position: absolute;
        /* background-color: #FFF1; */
        height: 60px;
        width: 100%;
        top: -30px;
        line-height: 60px;
    }

    .available-money {
        color: white;
        font-weight: normal;
        letter-spacing: 1px;
        border: 1px solid white;
        padding: 0px 20px;
        box-sizing: border-box;
        width: fit-content;
        min-width: 100px;
        margin: auto;
        background-color: #222;
        border-radius: 6px;
    }
</style>
