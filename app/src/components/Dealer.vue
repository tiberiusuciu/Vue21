<template>
  <div class="hand">
    <div class="dealer-tag">
        Dealer
    </div>
    <div class="timer" v-if="$store.state.gamePhase === 'aboutToStart'">
        Game starts in {{$store.state.gamestarttime}} seconds
    </div>

    <template v-if="(
        $store.state.gamePhase === 'dealingCards' || $store.state.gamePhase === 'userplay' || $store.state.gamePhase === 'revealCard' || $store.state.gamePhase === 'giveRewards') && $store.state.dealer.hands">    
        <template v-for="(card, index) in $store.state.dealer.hands[0].cards">
            <template v-if="index == 0">
                <Card :key="index" :card_identity="card"/>
            </template>
            <template v-else-if="index == 1">
                <template v-if="$store.state.gamePhase !== 'revealCard' && $store.state.gamePhase !== 'giveRewards'">
                    <Card :key="index" :card_identity="'hidden'"/>
                </template>
                <template v-else>
                    <Card :key="index" :card_identity="card" />
                </template>
            </template>
            <template v-else>
                <Card :key="index" :card_identity="card"/>
            </template>
        </template>
    </template>

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
    .timer {
        color: white;
        letter-spacing: 1px;
    }
</style>
