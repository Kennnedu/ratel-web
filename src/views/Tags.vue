<template>
  <section id="content">
    <b-container>
      <b-row class="py-2" v-if="isMobile()">
        <b-col cols="12" class="pb-1">
          <b-button size="sm" block variant="primary" v-b-modal.new-tag>New</b-button>
        </b-col>
        <b-col cols="6">
          <b-button v-b-toggle.sidebar-1 size="sm" block>Filter</b-button>
        </b-col>
        <b-col cols="6">
          <SortByDropdown
            :options="orderOptions"
            :selectedOption="orderOption"
            :block="true"
            @selectOption="opt => { this.orderOption = opt; this.fetchFilteredTags() }" />
        </b-col>
        <b-col cols="12" class="pb-1">
          <FilterChips />
        </b-col>
      </b-row>
      <b-row class="py-2" v-else>
        <b-col md="9" cols="12" class="pb-1 pt-1">
          <FilterChips />
        </b-col>
        <b-col md="3" offset-md="0" cols="auto" offset="3" class="pb-1 pt-1">
          <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu" class="float-right">
            <b-button-group  class="mr-1" size="sm">
              <b-button size="sm" block variant="primary" v-b-modal.new-tag>New</b-button>
            </b-button-group>
            <b-button-group size="sm" >
              <b-button v-b-toggle.sidebar-1>Filter</b-button>
              <SortByDropdown
                :options="orderOptions"
                :selectedOption="orderOption"
                @selectOption="opt => { this.orderOption = opt; this.fetchFilteredTags() }" />
            </b-button-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-overlay :show="isFetching">
            <b-row class="cards-deck active" :aria-hidden="isFetching ? 'true' : null">
              <b-col v-for="tag in tags" :key="tag.id" md="3" class="py-3">
                <b-card no-body :class="{ positive: tag.records_sum > 0 }" class="shadow-sm">
                  <b-card-body @click="currentTag = tag; $bvModal.show('edit-tag')">
                    <b-card-sub-title class="mb-2">{{tag.name}}</b-card-sub-title>
                    <template v-if="filter.type === 'Expences'">
                      <b-card-title>{{recordsSumPercent(tag.records_sum)}} %</b-card-title>
                      <div>{{tag.records_sum}}</div>
                      <b-progress :value="recordsSumPercent(tag.records_sum)" variant="danger" key="danger"></b-progress>
                    </template>
                    <template v-else-if="filter.type === 'Replenish'">
                      <b-card-title>{{recordsSumPercent(tag.records_sum)}} %</b-card-title>
                      <div>{{tag.records_sum}}</div>
                      <b-progress :value="recordsSumPercent(tag.records_sum)" variant="success" key="success"></b-progress>
                    </template>
                    <template v-else>
                      <b-card-title>{{tag.records_sum}}</b-card-title>
                    </template>
                  </b-card-body>
                </b-card>
              </b-col>
              <b-col v-if="otherPercentCard" md="3" class="py-3">
                <b-card no-body class="shadow-sm" border-variant="dark">
                  <b-card-body>
                    <b-card-sub-title class="mb-2">{{otherPercentCard.name}}</b-card-sub-title>
                    <b-card-title>{{recordsSumPercent(otherPercentCard.records_sum)}} %</b-card-title>
                    <div v-if="filter.type === 'Expences' || filter.type === 'Replenish'">{{otherPercentCard.records_sum}}</div>
                    <b-progress :value="recordsSumPercent(otherPercentCard.records_sum)" variant="danger" key="danger" v-if="filter.type === 'Expences'"></b-progress>
                    <b-progress :value="recordsSumPercent(otherPercentCard.records_sum)" variant="success" key="success" v-if="filter.type === 'Replenish'"></b-progress>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row>
          </b-overlay>
        </b-col>
      </b-row>
    </b-container>
    <b-sidebar id="sidebar-1" title="Filter" right shadow>
      <b-container>
        <RecordFilter/>
      </b-container>
    </b-sidebar>
    <b-modal id="new-tag" centered title="New Tag" hide-footer>
      <TagForm @close="$bvModal.hide('new-tag'); fetchFilteredTags(); fetchTags()" :tag="{'name': ''}" />
    </b-modal>
    <b-modal id="edit-tag" centered title="Edit Tag" hide-footer>
      <TagForm @close="$bvModal.hide('edit-tag'); fetchFilteredTags(); fetchTags()" :tag="currentTag" />
    </b-modal>
  </section>
</template>
<script>
  import RecordFilter from '../components/RecordFilter.vue'
  import FilterChips from '../components/FilterChips.vue'
  import TagForm from '../components/TagForm.vue'
  import SortByDropdown from '../components/SortByDropdown.vue'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import { mapState, mapActions } from 'vuex'
  import { isMobile } from './../utils/mobileDetect.js'
  
  export default {
    components: { RecordFilter, FilterChips, TagForm, SortByDropdown },

    data: function() {
      return {
        tags: [],
        currentTag: {},
        orderOption: null,
				isFetching: true
      }
    },

    watch: {
      filter: {
        handler: function(){
          this.debouncedFilteredTags()
        },
        deep: true
      }
    },

    created() {
      this.orderOptions = [
        { "order[field]": "records_sum", "order[type]": "asc" },
        { "order[field]": "records_sum", "order[type]": "desc" },
        { "order[field]": "name", "order[type]": "asc" },
        { "order[field]": "name", "order[type]": "desc" }
      ];
      this.orderOption = this.orderOptions[1];
    },

    mounted() {
      this.fetchFilteredTags();
      this.debouncedFilteredTags = debounce(this.fetchFilteredTags, 500);
    },

    computed: {
      ...mapState(['filter', 'totalSum']),

      sourceParams() {
        return Object.assign({
          'fields': 'records_sum',
          'order[field]': 'records_sum',
          'order[type]': 'desc',
          'record[name]': this.filter.name,
          'record[card]': this.filter.card,
          'record[tags]': this.filter.tags,
          'record[performed_at][gt]': this.filter.from,
          'record[performed_at][lt]': this.filter.to,
          'record[amount][gt]': this.filter.type  === 'Replenish' ? 0 : null,
          'record[amount][lt]': this.filter.type === 'Expences' ?  0 : null,
        }, this.orderOption)
      },

      otherPercentCard() {
        if (this.filter.type === 'Expences' || this.filter.type === 'Replenish') {
          const sum = this.tags.reduce((calc, tag) => Number((calc + Number(tag.records_sum)).toFixed(2)), 0)
          if(sum !== this.totalSum) return { name: 'Other', records_sum: Number((this.totalSum - sum).toFixed(2)) }
        }

        return null
      }
    },

    methods: {
      ...mapActions(['fetchTags']),

      fetchFilteredTags() {
				this.isFetching = true;

        axios.get('/tags', { params: this.sourceParams })
            .then(resp => this.tags = resp.data.tags)
            .then(() => this.isFetching = false)
      },
    
      recordsSumPercent(recordsSum) {
        return Number((Number(recordsSum)*100/this.totalSum).toFixed(2)) 
      },

      isMobile() {
        return isMobile();
      }
    }
  }
</script>
<style>
</style>
