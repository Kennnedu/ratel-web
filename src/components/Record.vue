<template>
  <b-card
    class="record-card shadow-sm"
    no-body
    :border-variant='isSelected ? "warning" : ""'
    :class="{ positive: record.amount > 0 }"
    @mouseover="isActive = true"
    @mouseleave="isActive = false">
    <b-row no-gutters>
      <b-col cols="10">
        <b-card-body>
          <b-card-sub-title class="mb-2">
            {{record.name}}
          </b-card-sub-title>
          <b-card-title>
            <span ref="amount">
              {{Math.abs(record.amount)}}
              <span class="currency-type"> BYN</span>
            </span>
          </b-card-title>
          <b-popover :target="() => $refs.amount" placement="left" triggers="hover">
            <template v-if="dollar">
              <div>{{dollar}} <span class="font-weight-bold">&dollar;</span></div>
              <div>{{euro}} <span class="font-weight-bold">&euro;</span></div>
              <div>{{zloty}} <span class="font-weight-bold">z&#410;</span></div>
            </template>
            <span v-else>There is no data.</span>
          </b-popover>
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
            <section class="d-flex justify-content-between">
              <section class="performed-at">{{ moment(record.performed_at).format('LT') }}</section>
            </section>
          </b-card-text>
        </b-card-body>
      </b-col>
      <b-col cols="1" class="ml-1">
        <section class="d-flex flex-column align-items-center mt-1">
          <div v-b-tooltip.hover.ds1000 title="Select the record for further manipulation" 
            :class="`toolbar-action btn btn-sm ${isSelected ? 'text-warning' : 'text-muted'}`"
            @click="$emit('select')"
            v-if="isActive || isSelected"
            >
            <font-awesome-icon icon="check"/>
          </div>
          <div v-b-tooltip.hover.ds1000 title="Edit the Record" class="toolbar-action btn btn-sm text-muted" v-if="isActive" @click="$emit('edit')">
            <font-awesome-icon icon="pen"/>
          </div>
          <div v-b-tooltip.hover.ds1000 title="Exclude Name from search" class="toolbar-action btn btn-sm text-muted" v-if="isActive && !isSelected" @click="addFilteringName({name: `!${record.name}`})">
            <font-awesome-icon icon="minus"/>
          </div>
        </section>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import moment from 'moment'
import { mapMutations } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPen, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faCheck, faPen, faMinus)

export default {
  props: ['record', 'isSelected', 'filterable'],

  data: function(){
    return {
      moment: moment,
      isActive: false,
    }
  },

  computed: {
    dollar() {
      if(!this.record.usd_id) return null;
      const dollarCurrency = parseFloat(this.record.usd.byn)
      const recordAmount = parseFloat(this.record.amount)
      return Math.abs((recordAmount / dollarCurrency).toFixed(2))
    },

    euro() {
      if(!this.record.usd_id) return null;
      const euroCurrency = parseFloat(this.record.usd.eur)
      const dollarCurrency = parseFloat(this.record.usd.byn)
      const recordAmount = parseFloat(this.record.amount)

      return Math.abs((recordAmount / (dollarCurrency / euroCurrency)).toFixed(2))
    },


    zloty() {
      if(!this.record.usd_id) return null;
      const dollarCurrency = parseFloat(this.record.usd.byn)
      const zlotyCurrency = parseFloat(this.record.usd.pln)
      const recordAmount = parseFloat(this.record.amount)

      return Math.abs((recordAmount / (dollarCurrency / zlotyCurrency)).toFixed(2))
    }
  },

  methods: {
    ...mapMutations(['addFilteringName']),
  }
}
</script>
<style>
  .record-card .card-subtitle:hover {
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

 .toolbar-action {
    cursor: pointer;
  }

  .toolbar-action:hover {
    background-color: #6d85ca75;
    font-weight: bold;
  }

  .currency-type {
    font-size: 15px;
    font-weight: 400;
  }
</style>
