<template>
  <span>
    <template v-if="card_identity === 'hidden'">
      <div class="card hidden">
        <div>

        </div>
      </div>
    </template>
    <template v-else>
      <div :class="{'red': card_identity[1] === 'H' || card_identity[1] === 'D', 'showcase': is_showcase}" class="card">
          <template v-if="card_identity.length <= 2">
            <span>
                {{ card_identity[0] }}
            </span>
            <i v-if="card_identity[1] === 'H'" class="fas fa-heart"></i>
            <i v-if="card_identity[1] === 'S'" class="fas fa-spade"></i>
            <i v-if="card_identity[1] === 'C'" class="fas fa-club"></i>
            <i v-if="card_identity[1] === 'D'" class="fas fa-diamond"></i>
          </template>
          <template v-else>
                <span>
                    {{ card_identity[0] + card_identity[1]}}
                </span>
                <i v-if="card_identity[2] === 'H'" class="fas fa-heart"></i>
                <i v-if="card_identity[2] === 'S'" class="fas fa-spade"></i>
                <i v-if="card_identity[2] === 'C'" class="fas fa-club"></i>
                <i v-if="card_identity[2] === 'D'" class="fas fa-diamond"></i>
          </template>
      </div>
    </template>
  </span>
</template>

<script>
export default {
  name: 'card',
  props: {
    card_identity: String,
    is_showcase: Boolean
  }
}
</script>

<style scoped>
  .card {
      width: 100px;
      height: 140px;
      background-color: #E9E9E9;
      border-radius: 6px;
      margin: auto;
      text-align: center;
      line-height: 140px;
      font-size: 2.5em;
      color: black;
      border: 1px solid black;
      font-weight: bold;
      user-select: none;
      cursor: pointer;
      display: inline-block;
      margin: 5px 10px 0px 10px;
      vertical-align: bottom;
      box-sizing: border-box;
      /* For animation purposes */
      /* transition: 
          background-color .1s ease-in-out,
          width .1s ease-in-out,
          height .1s ease-in-out, line-height, .1s ease-in-out, color, .1s ease-in-out; */
  }

  .hidden {
    padding: 10px;
  }
  
  .hidden div {
    background-color: lightcoral;
    height: 100%;
    width: 100%;
    border-radius: 3px;
  }

  /* For animation purposes */
  /* 
  .card:hover {
      background-color: white;
      width: 110px;
      height: 150px;
      line-height: 150px;
      margin: 0px 5px 0px 5px;
      color: red;
  } */

  .card span {
      margin-right: -12px;
  }

  .red {
      color: red;
  }

  .showcase {
    line-height: 65px;
    margin-left: -45px;
    text-align: left;
    padding-left: 4px;
  }

  @media screen and (max-width: 800px) {
    .card {
      width: 50px;
      height: 70px;
      background-color: #E9E9E9;
      border-radius: 6px;
      margin: auto;
      text-align: center;
      line-height: 70px;
      font-size: 1em;
      color: black;
      border: 1px solid black;
      font-weight: bold;
      user-select: none;
      cursor: pointer;
      display: inline-block;
      margin: 5px 10px 0px 10px;
      vertical-align: bottom;
      box-sizing: border-box;
      /* For animation purposes */
      /* transition: 
          background-color .1s ease-in-out,
          width .1s ease-in-out,
          height .1s ease-in-out, line-height, .1s ease-in-out, color, .1s ease-in-out; */
    }

    .card span {
        margin-right: -4px;
    }
  }
</style>
