<template>
  <b-form>
    <b-form-group id="filter-name-group" label="Filter by name" label-for="filter-name">
      <b-form-input
        type="text"
        id="filter-name"
        :value="filter.name"
        @input="val => updateFilter({changes: { name: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-source-group" label="Filter by source" label-for="filter-card">
      <b-form-input
        type="text"
        id="filter-card"
        :value="filter.card"
        @input="val => updateFilter({changes: { card: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-tags-group" label="Filter by tags" label-for="filter-tags">
      <b-form-input
        type="text"
        id="filter-tags"
        :value="filter.tags"
        @input="val => updateFilter({changes: { tags: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-from" label="Performed from" label-for="filter-from">
      <b-form-datepicker
        type="date"
        id="filter-from"
        :value="filter.from"
        @input="date => updateFilter({changes: { from: date }})"> </b-form-datepicker>
    </b-form-group>

    <b-form-group id="filter-to" label="Performed to" lablel-for="filter-to">
      <b-form-datepicker
        type="date"
        id="filter-to"
        :value="filter.to"
        @change="date => updateFilter({changes: { to: date }})"> </b-form-datepicker>
    </b-form-group>

    <b-button class="float-left" @click="() => updateFilter({changes: defFilter})">Reset</b-button>
    <b-button class="float-right" :disabled="isEqlFilterToDefFilter" @click="saveDefFilter">Save as Default</b-button>
  </b-form>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data: function(){
    return {
      defFilter: {}
    }
  },

  computed: {
    ...mapState(['filter']),

    isEqlFilterToDefFilter() {
      const defFilter = this.defFilter;
      const filter= this.filter;

      return filter.name === defFilter.name && filter.card === defFilter.card &&
        filter.from === defFilter.from && filter.to === defFilter.to && filter.tags === defFilter.tags
    }
  },

  methods: {
    ...mapMutations(['updateFilter', 'resetFilter']),

    saveDefFilter() {
      this.defFilter = this.filter;
      localStorage.setItem('defaultFilter', JSON.stringify(this.filter));
    }
  },

  created() {
    const savedDefFilter = JSON.parse(localStorage.getItem('defaultFilter'));

    this.defFilter = savedDefFilter || this.filter;
  }
}
</script>
<style>
</style>
