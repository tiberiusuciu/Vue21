<template>
  <div class="hand">
    <Card card_identity="AS"/>
    <Card card_identity="3S"/>
    <Card card_identity="JS"/>
    <Card card_identity="QH"/>
    <Card card_identity="KD"/>
    <Card card_identity="10C"/>
  </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'player',
  components: {
    Card
  }
}
</script>

<style>
</style>
