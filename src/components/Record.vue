<template>
  <b-card
    class="record-card shadow-sm"
    no-body
    :border-variant='isSelected ? "warning" : ""'
    :class="{ positive: record.amount > 0 }">
    <b-card-body @click="$emit('click')">
      <font-awesome-icon icon="check-circle" size="lg" class="selected-icon" v-if="isSelected" />
      <b-card-sub-title class="mb-2" @click="(e) => {
         if(filterable) {
           e.preventDefault()
           e.stopPropagation()
           addFilteringName({name: record.name})
         } else return true
       }">
        {{record.name}}
      </b-card-sub-title>
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faCheckCircle)

export default {
  props: ['record', 'isSelected', 'filterable'],

  data: function(){
    return {
      moment: moment
    }
  },

  methods: {
    ...mapMutations(['addFilteringName']),
  }

}
</script>
<style>
  .record-card .card-subtitle:hover {
    cursor: pointer;
    text-decoration: underline;
    white-space: initial;
  }

  .record-card .card-subtitle {
    width: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .record-card.border-warning {
    border: 2px solid;
  }

  .selected-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #ffc107;
  }
</style>
