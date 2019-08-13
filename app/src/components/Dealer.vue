<template>
  <div class="hand">
    <!-- <Card card_identity="AS"/>
    <Card card_identity="3S"/>
    <Card card_identity="JS"/>
    <Card card_identity="QH"/>
    <Card card_identity="KD"/>
    <Card card_identity="10C"/> -->
    <div class="dealer-tag">
        Dealer
    </div>
  </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'dealer',
  components: {
    Card
  }
}
</script>

<style scoped>

    .dealer-tag {
        color: white;
        position: absolute;
        top: 25px;
        left: 25px;
        letter-spacing: 1px;
    }

    .hand {
        padding-top: 100px;
        box-sizing: border-box;
        height: 40vh;
        position: relative;
    }
</style>
