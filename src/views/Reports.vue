<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-card no-body class="mt-3">
          <b-card-header>
            <h3 class="d-inline text-center">Reports</h3>
            <b-button variant="primary" class="float-right" size="sm" v-b-modal.new-report-form>New</b-button>
          </b-card-header>
          <b-card-body>
            <b-table-lite
              striped
              bordered
              fixed
              :items="reports"
              :fields="fields"
              :head-variant="'light'"
              class="rounded">
              <template #cell(name)="row">
                <b-link :href="row.item.url" target="_blank">
                  {{row.item.name}}
                </b-link>
              </template>
              <template #cell(status)="data">
                <span :class="{
                  'text-danger': data.value === 'error',
                  'text-success': data.value === 'processed',
                  'text-warning': data.value === 'queue' 
                  }"> 
                  {{data.value}}
                  </span>
              </template>
              <template #cell(action)="data">
                <b-button size="sm" variant="outline-danger" @click="() => confirmDeleteDialog(data.item.id)">
                  Delete
                </b-button>
              </template>
            </b-table-lite>
          </b-card-body>
          <b-card-footer class="clearfix">
            <b-form-group
              class="float-left"
              label="Per page:"
              label-size="sm"
              label-cols="6"
              >
              <b-form-select v-model="perPage" :options="[5, 10, 20, 50, 100]" size="sm"></b-form-select>
            </b-form-group>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalReports"
              :per-page="perPage"
              size="sm"
              first-text="First"
              prev-text="Prev"
              next-text="Next"
              last-text="Last"
              class="float-right">
            </b-pagination>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
    <b-modal id="new-report-form" centered title="New Report" hide-footer>
      <ReportForm @save="$bvModal.hide('new-report-form'); fetch()"/>
    </b-modal>
  </b-container>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import ReportForm from '../components/ReportForm.vue'

export default {
  components: {ReportForm},

  data: function() {
    return {
      fields: [
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'status',
          label: 'Status'
        },
        {
          key: 'created_at',
          label: 'Created At',
          formatter: 'createdAtFormatter'
        },
        {
          key: 'action',
          label: 'Action'
        }
      ],
      reports: [],
      totalReports: 0,
      currentPage: 1,
      perPage: 5,
      isFetching: true
    }
  },

  created() {
    this.fetch();
  },

  watch: {
    currentPage: function() {
      return this.fetch();
    },
    perPage: function() {
      return this.fetch();
    }
  },

  methods: {
    fetch() {
      this.isFetching = true;
      const offset = (this.currentPage - 1) * this.perPage
      axios.get('/reports', { params: { 'limit': this.perPage, 'offset': offset }}).then(({data}) => {
        this.reports = data.reports
        this.totalReports = data.total_count
        this.isFetching = false
      })
    },

    createdAtFormatter(value) {
      return moment(value).format('lll');
    },

    confirmDeleteDialog(id) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete the report, all related records will be deleted?', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        centered: true
      })
        .then(confirmed => confirmed && axios.delete(`/reports/${id}`).then(() =>  this.fetch()))
    }
  }
}
</script>
<style lang="stylus">
</style>