<template>
  <article class="record-card"
       v-on:click="$emit('click')"
       v-bind:class="{ positive: record.amount > 0 }">
    <header class="head">
      <span v-on:click="filterByTheName">
        {{ record.name }}
      </span>
    </header>
    <main class="body"
         v-on:click="isOpenEditDialog = true">
      <section class="tags">
        <span v-for="recordsTag in record.records_tags" v-bind:key="recordsTag.tag_id">{{recordsTag.tag.name}}</span>
      </section>
      <section class="card">{{ record.card.name }}</section>
      <section class="amount">{{ `${record.amount} BYN` }}</section>
      <section class="rest" v-if="record.rest">{{ `${record.rest} BYN` }}</section>
      <section class="performed-at">{{ moment(record.performed_at).format('LT') }}</section>
    </main>
  </article>
</template>
<script>
import moment from 'moment'
import { mapMutations } from 'vuex'

export default {
  props: ['record'],

  data: function(){
    return {
      moment: moment
    }
  },

  methods: {
    ...mapMutations(['addFilteringName']),

    filterByTheName(e) {
      e.preventDefault();
      e.stopPropagation();

      this.addFilteringName({name: `!${this.record.name}`})
    }
  }

}
</script>
<style lang="css" scoped>
  .record-card {
    border: 1px solid #e0e0e0;
    border-radius: 7px;
  }

  .record-card .head {
    text-align: center;
  }

  .record-card .head span:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .record-card .body, .record-card .head, .record-card .body section {
    padding: 5px;
  }

  .record-card.positive {
    background-color: #ddfbdd;
  }

  .record-card:hover, .record-card:focus, .record-card:active {
    background-color: #e0e8ff75;
  }

  .record-card .body:hover {
    cursor: pointer;
  }

  .record-card .head, .record-card .body .amount {
    font-weight: bold;
  }

  .record-card .head, .record-card .body .card, .record-card .body .performed-at, .record-card .body .rest {
    font-size: 13px;
  }

  .tags span {
    font-size: 12px;
    background-color: #ababa9;
    padding: 3px;
    color: white;
    border-radius: 6px;
    margin-right: 3px;
  }
</style>
