<template>
  <div class="hand">
    <div class="username-tag">
      {{ userInfo.username }}
    </div>
    <!-- <Card card_identity="AS"/>
    <Card card_identity="3S"/>
    <Card card_identity="JS"/>
    <Card card_identity="QH"/>
    <Card card_identity="KD"/>
    <Card card_identity="10C"/> -->
  </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'player',
  components: {
    Card
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
        return {
          username: ''
        };
      }
    }
  },
}
</script>

<style scoped>
  .hand {
    padding-top: 100px;
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
</style>
