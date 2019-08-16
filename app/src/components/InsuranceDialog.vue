<template>
    <div class="insurance-dialog-overlay">
        <div class="insurance-dialog-box-area">
            <div class="insurance-dialog-box">
                <template v-if="!userInfo.hands[0].hasBlackJack">
                    Insurance?
                </template>
                <template v-else>
                    <span class="smalltext">
                        1 to 1 payment?
                    </span>
                </template>
                <div class="timer-area">
                    <div class="timer" :style="{width: 100 * ($store.state.userSecondsLeft / 15000) + '%'}">

                    </div>
                </div>
                <div class="button no" :class="{'active': $store.state.insuranceAnswer === false}" @click="declineInsurances()">
                    <i class="fas fa-times"></i>
                </div>
                <div class="button yes" :class="{'active': $store.state.insuranceAnswer === true}" @click="acceptInsurances()">
                    <i class="fas fa-check"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'InsuranceDialog',
    methods: {
        declineInsurances() {
            this.$store.state.insuranceAnswer = false;
            this.$store.dispatch('onSendUserAnswer', false);
        },
        acceptInsurances() {
            this.$store.state.insuranceAnswer = true;
            this.$store.dispatch('onSendUserAnswer', true);
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
    .insurance-dialog-overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100vh;
        width: 100%;
        background-color: #000000AA;
    }

    .insurance-dialog-box-area {
        width: 100%;
        position: absolute;
        bottom: 0px;
    }

    .insurance-dialog-box {
        margin: auto;
        background-color: ghostwhite;
        width: 200px;
        height: 60px;
        line-height: 60px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        font-size: 1.75em;
        font-weight: bold;
        letter-spacing: 1px;
        padding: 25px 50px;
        position: relative;
    }

    .button {
        position: absolute;
        bottom: -42px;
        top: 0px;
        border: 4px solid ghostwhite;
        width: 110px;
        height: 110px;
        border-radius: 110px;
        line-height: 110px;
        box-sizing: border-box;
        cursor: pointer;
        font-size: 1.25em;


        border-color: ghostwhite;
        color: ghostwhite;
        background: #606c88;
        background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
        background: linear-gradient(to right, #3f4c6b, #606c88);
    }

    .yes {
        right: -55px;

    }

    .yes.active, .yes:hover {
        background: #0cebeb;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #29ffc6, #20e3b2, #0cebeb);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #29ffc6, #20e3b2, #0cebeb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .no {
        left: -55px;
    }

    .no.active, .no:hover {
        background: #FF416C;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #FF4B2B, #FF416C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }

    .timer-area {
        position: absolute;
        width: 100%;
        height: 35px;
        left: 0px;
        bottom: 0px;
        /* background-color: gold; */
        padding: 0px 70px;
        box-sizing: border-box;
    }

    .timer {
        height: 6px;
        background-color: lime;
    }

    .smalltext {
        font-size: 21px;
    }
</style>
