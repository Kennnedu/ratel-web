<template>
  <b-card
    class="record-card shadow-sm"
    no-body
    :class="{ positive: record.amount > 0 }">
    <b-card-body @click="$emit('click')">
      <b-card-sub-title class="mb-2">{{record.name}}</b-card-sub-title>
      <b-card-title>{{record.amount}}</b-card-title>
      <b-card-text>
        <section class="tags">
          <b-badge
            pill
            variant="secondary"
            class="mr-1"
            v-for="recordsTag in record.records_tags"
            v-bind:key="recordsTag.tag_id">{{recordsTag.tag.name}}</b-badge>
        </section>
        <section class="source">{{ record.card.name }}</section>
        <section class="performed-at">{{ moment(record.performed_at).format('LT') }}</section>
      </b-card-text>
    </b-card-body>
  </b-card>
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
    ...mapMutations(['addFilteringName'])
  }

}
</script>
<style>
</style>
