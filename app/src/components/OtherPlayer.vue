<template>
    <div class="other-hand" v-if="$store.state.gamePhase === 'userplay' && !isCurrentPlayer() && $store.state.currentUser !== -1">
        <div class="card-layout">
            <Card v-for="(card, index) in hand.cards" :key="index" :card_identity="card" is_showcase/>
        </div>
        <div class="other-info">
            <div class="value">
                {{ hand.currentValue }}
            </div>
            <div class="name">
                {{ player.username }} (<i class="far fa-dollar-sign" style="color:lime;"></i> {{ hand.currentBet }})
            </div>
        </div>
    </div>
</template>

<script>
import Card from './Card.vue'

export default {
    name: 'OtherPlayer',
    components: {
        Card
    },
    methods: {
        isCurrentPlayer() {
            if (this.$store.state.users.length == 0 || this.$store.state.currentUser == -1) {
                return false;
            }
            return this.$store.state.users[this.$store.state.currentUser].id === this.$store.state.id;
        }
    },
    computed: {
        hand() {
            var player = this.$store.state.users[this.$store.state.currentUser];
            return player.hands[player.currentHand];
        },
        player() {
            return this.$store.state.users[this.$store.state.currentUser];
        }
    },
}
</script>

<style scoped>
    .other-hand {
        position: absolute;
        right: 0px;
        bottom: 0px;
    }

    .card-layout {
        margin-right: 10px;
        margin-left: 115px;
    }

    .other-info {
        position: absolute;
        background-color: #222;
        border: 1px solid #222;
        height: 60px;
        bottom: 22px;
        right: 0px;
        width: 100%;
        border-top-left-radius: 60px;
        border-bottom-left-radius: 60px;
        display: flex;
    }

    .value {
        width: 60px;
        height: 60px;
        line-height: 56px;
        border: 3px solid white;
        font-size: 1.25em;
        font-weight: bold;
        border-radius: 60px;
        box-sizing: border-box;
        color: white;
        background: #4776E6;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #8E54E9, #4776E6);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #8E54E9, #4776E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

        display: inline-block;
        user-select: none;

    }

    .name {
        flex: 1;
        color: white;
        display: inline-block;
        line-height: 60px;
        letter-spacing: 1px;
    }
</style>
