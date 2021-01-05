<template>
  <section id="content">
    <b-container>
      <template v-if="isMobile()">
        <b-row class="py-2" v-show="selectedOption === 'None'">
          <b-col cols="6" class="pb-1">
            <b-button size="sm" block variant="primary" v-b-modal.new-record>New</b-button>
          </b-col>
          <b-col cols="6" class="pb-1">
            <b-button @click="selectedRecordIds = [0]" size="sm" block>Select All</b-button>
          </b-col>
          <b-col cols="6">
            <b-button v-b-toggle.sidebar-1 size="sm" block>Filter</b-button>
          </b-col>
          <b-col cols="6">
            <SortByDropdown
              :options="orderOptions"
              :selectedOption="orderOption"
              :block="true"
              @selectOption="opt => { this.orderOption = opt; this.fetchRecords() }" />
          </b-col>
          <b-col cols="12" class="pb-1">
            <FilterChips />
          </b-col>
        </b-row>
        <b-row class="py-2" v-show="selectedOption !== 'None'">
          <b-col cols="6" class="pb-1" v-show="selectedOption !== 'One'">
            <b-button v-b-modal.edit-batch-records size="sm" block>Edit</b-button>
          </b-col>
          <b-col cols="6" class="pb-1" v-show="selectedOption === 'One'">
            <b-button v-b-modal.edit-record size="sm" block>Edit</b-button>
          </b-col>
          <b-col cols="6" class="pb-1">
            <b-button @click="selectedRecordIds = []" size="sm" block>Cancel</b-button>
          </b-col>
          <b-col cols="12" class="pb-1">
            <div v-show="selectedOption !== 'None'" class="text-secondary font-weight-bolder">Selected records: {{selectedCount}}</div>
          </b-col>
        </b-row>
      </template>
      
      <b-row class="py-2" v-else>
        <b-col md="8" class="pb-1 pt-1">
          <FilterChips v-show="selectedOption === 'None'" />
          <div v-show="selectedOption !== 'None'" class="text-secondary font-weight-bolder">Selected records: {{selectedCount}}</div>
        </b-col>
        <b-col md="4" class="pb-1 pt-1">
          <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu" class="float-right" v-show="selectedOption === 'None'">
            <b-button-group  class="mr-1" size="sm">
              <b-button size="sm" block variant="primary" v-b-modal.new-record>New</b-button>
            </b-button-group>
            <b-button-group  class="mr-1" size="sm">
              <b-button size="sm" @click="selectedRecordIds = [0]">Select All</b-button>
            </b-button-group>
            <b-button-group size="sm" >
              <b-button v-b-toggle.sidebar-1 size="sm">Filter</b-button>
              <SortByDropdown
                :options="orderOptions"
                :selectedOption="orderOption"
                @selectOption="opt => { this.orderOption = opt; this.fetchRecords() }" />
            </b-button-group>
          </b-button-toolbar>
          <b-button-toolbar v-show="selectedOption !== 'None'" class="float-right">
            <b-button-group class="mr-1" size="sm" v-show="selectedOption === 'One'">
              <b-button v-b-modal.edit-record size="sm" >Edit</b-button>
            </b-button-group>
            <b-button-group class="mr-1" size="sm" v-show="selectedOption !== 'One'">
              <b-button v-b-modal.edit-batch-records size="sm">Edit</b-button>
            </b-button-group>
            <!-- TODO: replace delete logic
              <b-button-group size="sm" class="mr-3">
              <b-button size="sm" variant="danger" v-if="selectedOption === 'One'">Delete</b-button>
              <b-button size="sm" variant="danger" v-else>Delete All</b-button>
            </b-button-group> -->
            <b-button-group size="sm">
              <b-button size="sm" @click="selectedRecordIds = []">Cancel</b-button>
            </b-button-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row :class="`work-space ${selectedOption !== 'None' && 'edit'}`" >
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
                      :isSelected="(() => selectedOption === 'All' ||
                        (selectedOption === 'Many' && !selectedRecordIds.includes(record.id)) ||
                        (selectedOption !== 'Many' && selectedRecordIds.includes(record.id))
                      )()"
                      :filterable="selectedOption === 'None'"
                      :record="record"
                      @click="clickOnRecordCallback(record)"/>
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
    <b-modal id="edit-batch-records" centered title="Edit Batch Record" hide-footer>
      <b-container>
        <RecordBatchForm
          :selectedOption = "selectedOption"
          :selectedRecordIds = "selectedRecordIds"
          @remoteAction = "fetchTotalSum(); fetchRecords(); selectedRecordIds = []" />
      </b-container>
    </b-modal>
    <b-modal id="new-record" centered title="New Record" hide-footer>
      <RecordForm @save="$bvModal.hide('new-record'); fetchRecords(); fetchTotalSum()" />
    </b-modal>
    <b-modal id="edit-record" centered title="Edit Record" hide-footer>
      <RecordForm 
        :record="records.find(r => r.id === selectedRecordIds[0])"
        @save="$bvModal.hide('edit-record'); fetchRecords({ limit: recordsCount }); fetchTotalSum(); selectedRecordIds = []" />
    </b-modal>
  </section>
</template>
<script>
  import Record from '../components/Record.vue'
  import RecordForm from '../components/RecordForm.vue'
  import RecordFilter from '../components/RecordFilter.vue'
  import RecordBatchForm from '../components/RecordBatchForm.vue'
  import FilterChips from '../components/FilterChips.vue'
  import SortByDropdown from '../components/SortByDropdown.vue'
  import moment from 'moment'
  import debounce from 'lodash.debounce'
  import axios from 'axios'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { isMobile } from './../utils/mobileDetect.js'

  export default {
    components: { Record, RecordForm, RecordFilter, RecordBatchForm, FilterChips, SortByDropdown },

    data: function() {
      return {
        isFetchingRecords: true,
        displayBackButton: false,
        currentRecord: {},
        moment: moment,
        records: [],
        totalRecords: 0,
        orderOption: null,
        selectedRecordIds: []
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
      this.recordClicks = 0;
    },

    computed: {
      ...mapState(['filter']),
      ...mapGetters(['filterParams']),

      recordsCount() {
        return this.records.length
      },

      selectedOption() {
        let opt;

        if(this.selectedRecordIds.length === 1 && this.selectedRecordIds[0] === 0) opt = 'All'
        else if(this.selectedRecordIds.length === 1) opt = 'One'
        else if(this.selectedRecordIds.length > 1 && this.selectedRecordIds[0] === 0) opt = 'Many'
        else if(this.selectedRecordIds.length > 1) opt = 'Several'
        else if(this.selectedRecordIds.length === 0) opt = 'None'

        return opt
      },

      selectedCount() {
        let count = 0;

        if(this.selectedRecordIds.length > 0){
          if(this.selectedRecordIds.includes(0)) {
            count = this.totalRecords - this.selectedRecordIds.filter(id => id !== 0).length
          } else count = this.selectedRecordIds.length
        }

        return count;
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
      },

      clickOnRecordCallback(record) {
        this.recordClicks++;

        if(this.recordClicks === 1) {
          this.selectRecord(record);
          this.timer = setTimeout(() => this.recordClicks = 0, 300);
        } else{
          clearTimeout(this.timer);
          this.recordClicks = 0;
          if(this.selectedCount > 1) this.$bvModal.show('edit-batch-records');
          else if(this.selectedCount === 0) this.$bvModal.show('new-record');
          else this.$bvModal.show('edit-record');
        }
      },

      selectRecord(record) {
        if(this.selectedRecordIds.includes(record.id)) {
          this.selectedRecordIds = this.selectedRecordIds.filter(id => id !== record.id)
        } else {
          this.selectedRecordIds = [...[], ...this.selectedRecordIds, ...[record.id]]
        }
      },

      isMobile() {
        return isMobile();
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

  .work-space {
    border-radius: 3px;
    border: 3px solid lightgray;
  }

  .work-space.edit {
    border: 3px dashed lightgray;
  }
</style>
