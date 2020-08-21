<template>
  <b-form>
    <b-form-group
      label-cols-sm="3"
      label="Type:"
    >
      <b-form-radio-group
        class="pt-2"
        :options="['Expences', 'Replenish', 'Both']"
        buttons
        button-variant="outline-secondary"
        size="sm"
        :checked="filter.type"
        @input="val => updateFilter({changes: { type: val }})"
      ></b-form-radio-group>
    </b-form-group>

    <b-form-group id="filter-name-group" label="Name:" label-for="filter-name" label-cols-sm="3">
      <b-form-input
        type="text"
        id="filter-name"
        :value="filter.name"
        @input="val => updateFilter({changes: { name: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-source-group" label="Source:" label-for="filter-card" label-cols-sm="3">
      <b-form-input
        type="text"
        id="filter-card"
        :value="filter.card"
        @input="val => updateFilter({changes: { card: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-tags-group" label="Tags:" label-for="filter-tags" label-cols-sm="3">
      <b-form-input
        type="text"
        id="filter-tags"
        :value="filter.tags"
        @input="val => updateFilter({changes: { tags: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-performed-group" label="Period:" label-for="filter-performed" label-cols-sm="3">
      <b-form-select
        id="filter-performed"
        v-model="selectedPerformedHandler"
        :options="performedHandlerOptions()"
      ></b-form-select>
    </b-form-group> 

    <template v-if="selectedPerformedHandler === 'custom'">
      <b-form-group id="filter-from" label="From" label-for="filter-from" label-cols-sm="3">
        <b-form-datepicker
          type="date"
          id="filter-from"
          :value="filter.from"
          @input="date => updateFilter({changes: { from: date }})"> </b-form-datepicker>
      </b-form-group>

      <b-form-group id="filter-to" label="To" label-for="filter-to" label-cols-sm="3">
        <b-form-datepicker
          type="date"
          id="filter-to"
          :value="filter.to"
          @input="date => updateFilter({changes: { to: date }})"> </b-form-datepicker>
      </b-form-group>
    </template>

    <b-button class="float-left" @click="resetFilter">Reset</b-button>
    <b-button class="float-right" :disabled="isEqlFilterToDefFilter" @click="saveDefaultFilter">Save as Default</b-button>
  </b-form>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getDefaultFilter, getDefaultPerformedHandler, getPerformedHandlerOptions, performedHandlerObject } from '../utils/filter'

export default {
  data: function() {
    return {
      selectedPerformedHandler: getDefaultPerformedHandler(),
      defaultFilter: getDefaultFilter()
    }
  },

  computed: {
    ...mapState(['filter']),

    isEqlFilterToDefFilter() {
      const defFilter = this.defaultFilter;
      const filter= this.filter;

      return filter.name === defFilter.name && filter.card === defFilter.card &&
        filter.from === defFilter.from && filter.to === defFilter.to && filter.tags === defFilter.tags &&
        filter.type === defFilter.type
    }
  },

  methods: {
    ...mapMutations(['updateFilter']),

    saveDefaultFilter() {
      this.defaultFilter = this.filter
      localStorage.setItem('performedHandler', this.selectedPerformedHandler)
      localStorage.setItem('defaultFilter', JSON.stringify(this.defaultFilter))
    },

    resetFilter() {
      this.selectedPerformedHandler = getDefaultPerformedHandler();
      this.updateFilter({changes: this.defaultFilter});
    },

    performedHandlerOptions() {
      return getPerformedHandlerOptions()
    }
  },

  watch: {
    selectedPerformedHandler: function(val) {
      if(val !== 'custom') this.updateFilter({ changes: performedHandlerObject()[val] })
    }
  }
}
</script>
<style>
</style>
