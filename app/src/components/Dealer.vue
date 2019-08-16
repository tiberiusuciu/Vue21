<template>
    <div class="hand" :class="{'unactive': $store.state.gamePhase === 'waitingbet'}">
        <div class="dealer-tag">
            Dealer
        </div>
        <div class="timer" v-if="$store.state.gamePhase === 'aboutToStart'">
            Game starts in {{$store.state.gamestarttime}} seconds
        </div>
        
        <template v-if="$store.state.dealer.hands">
            <template v-if="(
                $store.state.gamePhase === 'dealingCards' || $store.state.gamePhase === 'userplay' || $store.state.gamePhase === 'revealCard' || $store.state.gamePhase === 'giveRewards') && $store.state.dealer.hands.length > 0">  
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
        </template>


        <div class="anouncement" v-if="$store.state.currentUser != -1 && !isCurrentPlayer() && ($store.state.gamePhase !== 'waitingbet' || $store.state.gamePhase !== 'revealCard' || $store.state.gamePhase !== 'giveRewards')">
            Waiting on {{ $store.state.users[$store.state.currentUser].username }}'s turn
        </div>
    </div>
</template>

<script>
import Card from './Card.vue'

export default {
    name: 'dealer',
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
        transformedValue() {
            if (this.$store.state.gamePhase === 'revealCard' || this.$store.state.gamePhase === 'giveRewards') {
                return this.$store.state.dealer.hands[0].currentValue;
            }
            else {
                if (this.$store.state.dealer.hands.length > 0) {
                    var card = this.$store.state.dealer.hands[0].cards[0];
                    if (card.charAt(0) === 'A') {
                        return 11;
                    }
                    else if (card.charAt(0) === 'K' || card.charAt(0) === 'Q' || card.charAt(0) === 'J' || card.charAt(0) === '1'){
                        return 10;
                    }
                    else {
                        return card.charAt(0);
                    }
                }
                else {
                    return 0;
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
        background-color: #050;
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

    .unactive {
        background-color: #040;
    }

    .anouncement {
        color: white;
        font-size: 1.25em;
        margin-top: 20px;
        letter-spacing: 1px;
    }

    @media screen and (max-width: 800px) {
        .hand {
            padding-top: 80px;
        }

        .hand-area {
            padding: 25px 5px;
            margin-left: 15px;
            margin-right: 15px;
        }

        .aligned-content {
            width: 50px;
            font-size: 1.5em;
            padding: 5px;
        }

        .floating-value {
            top: -20px;
        }

        .dealer-tag {
            top: 10px;
            left: 10px;
            letter-spacing: 1px;
        }
    }
</style>
