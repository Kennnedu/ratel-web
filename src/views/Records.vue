<template>
  <section id="content">
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="9">
          <FilterChips />
        </b-col>
        <b-col md="3">
          <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu" class="float-right">
            <b-button-group  class="mr-1" size="sm">
              <b-dropdown block variant="primary" text="New" size="sm">
                <b-dropdown-item href="#" v-b-modal.new-record>One</b-dropdown-item>
                <b-dropdown-item href="#" v-b-modal.html-upload-record>Upload batch(html)</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-button-group  class="mr-1" size="sm">
              <b-button v-b-toggle.sidebar-2 size="sm">Edit</b-button>
            </b-button-group>
            <b-button-group size="sm" >
              <b-button v-b-toggle.sidebar-1 size="sm">Filter</b-button>
              <SortByDropdown
                :options="orderOptions"
                :selectedOption="orderOption"
                @selectOption="opt => { this.orderOption = opt; this.fetchRecords() }" />
            </b-button-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-overlay :show="isFetchingRecords">
            <b-row class="cards-deck active" @scroll="recordsScroll" :aria-hidden="isFetchingRecords ? 'true' : null">
              <template v-for="(record, index) in records">
                  <b-col
                    :key="`${record.id}${moment(record.performed_at).format('X')}`"
                    md="12"
                    class="divide-date text-center"
                    v-if="shouldShowDivideDate(index, record, records[index - 1])">
                    <em>{{ moment(record.performed_at).format('LL') }}</em>
                  </b-col>
                  <b-col md="3" class="py-3" :key="`${record.id}${index}`">
                    <Record
                      :record="record"
                      @click="currentRecord = record; $bvModal.show('edit-record')"/>
                  </b-col>
              </template>
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
    <b-sidebar id="sidebar-2" title="Edit" right shadow>
      <b-container>
        <RecordBatchForm @remoteAction = "fetchTotalSum(); fetchRecords()" />
      </b-container>
    </b-sidebar>
    <b-modal id="new-record" title="New Record" hide-footer>
      <RecordForm @save="$bvModal.hide('new-record'); fetchRecords(); fetchTotalSum()" />
    </b-modal>
    <b-modal id="edit-record" title="Edit Record" hide-footer>
      <RecordForm 
        :record="currentRecord"
        @save="$bvModal.hide('edit-record'); fetchRecords({ limit: recordsCount }); fetchTotalSum()" />
    </b-modal>
    <b-modal id="html-upload-record" title="Upload Records html" hide-footer>
      <HtmlRecordsUploadForm @save="$bvModal.hide('html-upload-record'); fetchRecords(); fetchTotalSum()"/>
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
  import SortByDropdown from '../components/SortByDropdown.vue'
  import moment from 'moment'
  import debounce from 'lodash.debounce'
  import axios from 'axios'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    components: { Record, RecordForm, RecordFilter, RecordBatchForm, HtmlRecordsUploadForm, FilterChips, SortByDropdown },

    data: function() {
      return {
        isFetchingRecords: true,
        displayBackButton: false,
        currentRecord: {},
        moment: moment,
        records: [],
        totalRecords: 0,
        orderOption: null
      }
    },

    created() {
      this.orderOptions = [
        { "order[field]": "amount", "order[type]": "asc" },
        { "order[field]": "amount", "order[type]": "desc" },
        { "order[field]": "performed_at", "order[type]": "asc" },
        { "order[field]": "performed_at", "order[type]": "desc" },
        { "order[field]": "name", "order[type]": "asc" },
        { "order[field]": "name", "order[type]": "desc" }
      ];
      this.orderOption = this.orderOptions[3];
    },

    mounted() {
      this.fetchRecords();
      this.debouncedFetchRecords = debounce(this.fetchRecords, 500);
    },

    computed: {
      ...mapState(['filter']),
      ...mapGetters(['filterParams']),

      recordsCount() {
        return this.records.length
      }
    },

    watch: {
      filter: {
        handler: function(){
          this.debouncedFetchRecords()
        },
        deep: true
      }
    },

    methods: {
      ...mapActions(['fetchRecords', 'fetchTotalSum']),

      recordsScroll(e) {
        e.preventDefault();

        const elem = e.target;

        if((elem.scrollTop + 1000) > elem.scrollHeight && !this.isFetchingRecords && this.recordsCount < this.totalRecords) {
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
      },

      fetchRecords(params = {}) {
        this.isFetchingRecords = true;

        const paramsResult = Object.assign({}, this.filterParams, this.orderOption, params);

        axios.get('/records', { params:  paramsResult})
          .then(data => {
            if(paramsResult.offset) this.records = [...[], ...this.records, ...data.data.records]
            else this.records = data.data.records
            this.totalRecords = data.data.total_count
          })
          .then(() =>  this.isFetchingRecords = false)
      },

      shouldShowDivideDate(index, record, prevRecord) {
        return this.orderOption['order[field]'] === 'performed_at' && (
          index === 0 || (
            index !== 0 && !this.moment(record.performed_at).isSame(this.moment(prevRecord.performed_at), 'day')
          )
        )
      }
    }
  }
</script>
<style>
  .cards-deck {
    background-color: #f4f3ef;
    overflow-y: auto;
    height: calc(100vh - 130px);
  }

  .side-tab {
    height: calc(100vh - 185px);
    overflow-y: auto;
  }

  .cards-deck .card.positive {
    background-color: #ddfbdd;
  }

  .cards-deck.active .card:hover, .cards-deck.active .card:focus, .cards-deck.active .card:active {
    background-color: #e0e8ff75;
  }
</style>
