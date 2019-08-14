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
        <div class="hand-area">
            <div class="floating-value">
                <div class="aligned-content">{{ transformedValue }}</div>
            </div>


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
        </div>
    </template>

  </div>
</template>

<script>
import Card from './Card.vue'

export default {
    name: 'dealer',
    components: {
        Card
    },
    computed: {
        transformedValue() {
            if (this.$store.state.gamePhase === 'revealCard' || this.$store.state.gamePhase === 'giveRewards') {
                return this.$store.state.dealer.hands[0].currentValue;
            }
            else {
                var card = this.$store.state.dealer.hands[0].cards[0];
                if (card.charAt(0) === 'A') {
                    return 11;
                }
                else if (card.charAt(0) === 'K' || card.charAt(0) === 'Q' || card.charAt(0) === 'J'){
                    return 10;
                }
                else {
                    return card.charAt(0);
                }
            }
        }
    },
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
        padding-top: 75px;
        box-sizing: border-box;
        height: 40vh;
        position: relative;
    }
    .timer {
        color: white;
        letter-spacing: 1px;
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
