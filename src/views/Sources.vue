<template>
  <section id="content">
    <Navbar />
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="8">
          <FilterChips />
        </b-col>
        <b-col md="4">
          <b-button block variant="primary" v-b-modal.new-source>+ Add Source</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-row class="cards-deck active">
            <b-col v-for="source in sources" :key="source.id" md="4" class="py-3">
              <b-card no-body :class="{ positive: source.records_sum > 0 }" class="shadow-sm">
                <b-card-body @click="currentSource = source; $bvModal.show('edit-source')">
                  <b-card-sub-title class="mb-2">{{source.name}}</b-card-sub-title>
                  <b-card-title>{{source.records_sum}}</b-card-title>
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
    <b-modal id="new-source" title="New Source" hide-footer>
      <CardForm @close="$bvModal.hide('new-source'); fetchFilteredCards()" :card="{'name': ''}" />
    </b-modal>
    <b-modal id="edit-source" title="Edit Source" hide-footer>
      <CardForm @close="$bvModal.hide('edit-source'); fetchFilteredCards()" :card="currentSource" />
    </b-modal> 
  </section>
</template>
<script>
  import RecordFilter from '../components/RecordFilter.vue'
  import FilterChips from '../components/FilterChips.vue'
  import CardForm from '../components/CardForm.vue'
  import Navbar from '../components/Navbar.vue'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import { mapState } from 'vuex'

  export default {
    components: { RecordFilter, FilterChips, Navbar, CardForm },

    data: function() {
      return {
        sources: [],
        currentSource: {}
      }
    },

    watch: {
      filter: {
        handler: function(){
          this.debouncedFilteredCards()
        },
        deep: true
      }
    },

    mounted() {
      this.fetchFilteredCards();
      this.debouncedFilteredCards = debounce(this.fetchFilteredCards, 500);
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
      fetchFilteredCards() {
        axios.get('/cards', { params: this.sourceParams })
            .then(resp => this.sources = resp.data.cards)
      }
    }
  }
</script>
<style>
</style>
