<template>
  <section id="content">
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="7">
          <FilterChips />
        </b-col>
        <b-col md="1">
          <SortByDropdown
            :options="orderOptions"
            :selectedOption="orderOption"
            @selectOption="opt => { this.orderOption = opt; this.fetchFilteredTags() }" />
        </b-col>
        <b-col md="4">
          <b-button block variant="primary" v-b-modal.new-tag>+ Add Tag</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-overlay :show="isFetching">
            <b-row class="cards-deck active" :aria-hidden="isFetching ? 'true' : null">
              <b-col v-for="tag in tags" :key="tag.id" md="4" class="py-3">
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
        <b-col md="4">
          <b-card no-body>
            <b-tabs card justified>
              <b-tab title="Filter" class="side-tab" active>
                <RecordFilter/>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal id="new-tag" title="New Tag" hide-footer>
      <TagForm @close="$bvModal.hide('new-tag'); fetchFilteredTags()" :tag="{'name': ''}" />
    </b-modal>
    <b-modal id="edit-tag" title="Edit Tag" hide-footer>
      <TagForm @close="$bvModal.hide('edit-tag'); fetchFilteredTags()" :tag="currentTag" />
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
  import { mapState } from 'vuex'

  export default {
    components: { RecordFilter, FilterChips, TagForm, SortByDropdown },

    data: function() {
      return {
        tags: [],
        currentTag: {},
        orderOption: null,
				isFetching: false
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
          'record[performed_at][lt]': this.filter.to
        }, this.orderOption)
      }
    },

    methods: {
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
