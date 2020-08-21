<template>
  <section id="content">
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="8">
          <FilterChips />
        </b-col>
        <b-col md="1">
          <SortByDropdown
            :options="orderOptions"
            :selectedOption="orderOption"
            @selectOption="opt => { this.orderOption = opt; this.fetchFilteredTags() }" />
        </b-col>
        <b-col md="1">
          <b-button v-b-toggle.sidebar-1 size="sm" class="mt-2">Filter</b-button>
        </b-col>
        <b-col md="2">
          <b-button block variant="primary" v-b-modal.new-tag>+ Add</b-button>
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
                    <b-card-title>{{tag.records_sum}}</b-card-title>
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
    <b-modal id="new-tag" title="New Tag" hide-footer>
      <TagForm @close="$bvModal.hide('new-tag'); fetchFilteredTags(); fetchTags()" :tag="{'name': ''}" />
    </b-modal>
    <b-modal id="edit-tag" title="Edit Tag" hide-footer>
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
      ...mapState(['filter']),

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
      }
    },

    methods: {
      ...mapActions(['fetchTags']),

      fetchFilteredTags() {
				this.isFetching = true;

        axios.get('/tags', { params: this.sourceParams })
            .then(resp => this.tags = resp.data.tags)
            .then(() => this.isFetching = false)
      }
    }
  }
</script>
<style>
</style>
