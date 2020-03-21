<template>
  <section id="content">
    <Navbar />
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="8">
          <FilterChips />
        </b-col>
        <b-col md="4">
          <b-button block variant="primary" v-b-modal.new-source>+ Add Tag</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-row class="cards-deck">
            <b-col v-for="tag in tags" :key="tag.id" md="4" class="py-3">
              <b-card no-body :class="{ positive: tag.records_sum > 0 }">
                <b-card-body>
                  <b-card-sub-title class="mb-2">{{tag.name}}</b-card-sub-title>
                  <b-card-title>{{tag.records_sum}}</b-card-title>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="4">
          <b-card no-body>
            <b-tabs card>
              <b-tab title="Filter" class="side-tab" active>
                <RecordFilter/>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
  import RecordFilter from '../components/RecordFilter.vue'
  import FilterChips from '../components/FilterChips.vue'
  import Navbar from '../components/Navbar.vue'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import { mapState } from 'vuex'

  export default {
    components: { RecordFilter, FilterChips, Navbar },

    data: function() {
      return {
        tags: []
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

    mounted() {
      this.fetchFilteredTags();
      this.debouncedFilteredTags = debounce(this.fetchFilteredTags, 500);
    },

    computed: {
      ...mapState(['filter']),

      sourceParams() {
        return {
          'fields': 'records_sum',
          'order[field]': 'records_sum',
          'order[type]': 'desc',
          'record[name]': this.filter.name,
          'record[card]': this.filter.card,
          'record[tags]': this.filter.tags,
          'record[performed_at][gt]': this.filter.from,
          'record[performed_at][lt]': this.filter.to
        }
      }
    },

    methods: {
      fetchFilteredTags() {
        axios.get('/tags', { params: this.sourceParams })
            .then(resp => this.tags = resp.data.tags)
      }
    }
  }
</script>
<style>
</style>
