<template>
  <section id="content">
    <Navbar />
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="8">
          <FilterChips />
        </b-col>
        <b-col md="4">
          <b-button block variant="primary" v-b-modal.new-record>+ Add Record</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-row class="cards-deck" @scroll="recordsScroll">
            <template v-for="(record, index) in records">
                <b-col
                  :key="`${record.id}${index}`"
                  md="12"
                  class="divide-date text-center"
                  v-if="index === 0 || (index !== 0 && !moment(record.performed_at).isSame(moment(records[index-1].performed_at), 'day'))">
                  <em>{{ moment(record.performed_at).format('LL') }}</em>
                </b-col>
                <b-col md="4" class="py-3" :key="record.id">
                  <Record
                    :record="record"
                    @click="currentRecord = record; $bvModal.show('edit-record')"/>
                </b-col>
            </template>
          </b-row>
        </b-col>
        <b-col md="4">
          <b-card no-body>
            <b-tabs card>
              <b-tab title="Filter" class="side-tab" active>
                <RecordFilter/>
              </b-tab>
              <b-tab title="Edit batch" class="side-tab">
                <RecordBatchForm />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal id="new-record" title="New Record" hide-footer>
      <RecordForm @save="$bvModal.hide('new-record')" />
    </b-modal>
    <b-modal id="edit-record" title="Edit Record" hide-footer>
      <RecordForm @save="$bvModal.hide('edit-record')" :record="currentRecord" />
    </b-modal>
    <b-modal id="html-upload-record" title="Upload Records html" hide-footer>
      <HtmlRecordsUploadForm @save="$bvModal.hide('html-upload-record')"/>
    </b-modal>
  </section>
</template>
<script>
  import Record from '../components/Record.vue'
  import RecordForm from '../components/RecordForm.vue'
  import RecordFilter from '../components/RecordFilter.vue'
  import RecordBatchForm from '../components/RecordBatchForm.vue'
  import HtmlRecordsUploadForm from '../components/HtmlRecordsUploadForm.vue'
  import FilterChips from '../components/FilterChips.vue'
  import Navbar from '../components/Navbar.vue'
  import moment from 'moment'

  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    components: { Navbar, Record, RecordForm, RecordFilter, RecordBatchForm, HtmlRecordsUploadForm, FilterChips },

    data: function() {
      return {
        isFetchingRecords: false,
        displayBackButton: false,
        currentRecord: {},
        moment: moment
      }
    },

    mounted() {
      this.fetchRecords();
    },

    computed: {
      ...mapState(['records', 'totalRecords']),
      ...mapGetters(['recordsCount'])
    },

    watch: {
      recordsCount() {
        if(this.isFetchingRecords) this.isFetchingRecords = false
      }
    },

    methods: {
      ...mapActions(['fetchRecords', 'fetchCards']),

      recordsScroll(e) {
        e.preventDefault();

        const elem = e.target;

        if((elem.scrollTop + 1000) > elem.scrollHeight && !this.isFetchingRecords && this.recordsCount < this.totalRecords) {
          this.isFetchingRecords = true
          this.fetchRecords({offset: this.recordsCount, limit: 30});
        }

        if(elem.scrollTop < 30 && this.displayBackButton) this.displayBackButton = false
        else if(elem.scrollTop > 30 && !this.displayBackButton) this.displayBackButton = true
      },

      reduceScroll(elem) {
        if(elem.scrollTop === 0) return null
        elem.scrollTop -= Math.max(100, Math.floor(elem.scrollTop / 10));
        setTimeout(() => this.reduceScroll(elem), 30);
      },

      scrollBack(e){
      e.preventDefault();

        this.reduceScroll(document.querySelector('.records'));
        this.displayBackButton = false;
      }
    }
  }
</script>
<style>
  .cards-deck {
    background-color: #f3f2f2;
    overflow-y: auto;
    height: calc(100vh - 130px);
  }

  .side-tab {
    height: 450px;
    overflow-y: auto;
  }

  .cards-deck .card.positive {
    background-color: #ddfbdd;
  }

  .cards-deck .card:hover, .cards-deck .card:focus, .cards-deck .card:active {
    background-color: #e0e8ff75;
  }
</style>
