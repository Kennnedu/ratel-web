<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-card no-body class="mt-3">
          <b-card-header>
            <h3 class="d-inline text-center">Reports</h3>
            <b-button variant="primary" class="float-right" size="sm">New</b-button>
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
                  'text-warrning': data.value === 'queue' 
                  }"> 
                  {{data.value}}
                  </span>
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
  </b-container>
</template>
<script>
import axios from 'axios'
import moment from 'moment'

export default {
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
        }
      ],
      reports: [],
      totalReports: 0,
      currentPage: 1,
      perPage: 5
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
      const offset = (this.currentPage - 1) * this.perPage
      axios.get('/reports', { params: { 'limit': this.perPage, 'offset': offset }}).then(({data}) => {
        console.log(data) // eslint-disable-line
        this.reports = data.reports
        this.totalReports = data.total_count
      })
    },

    createdAtFormatter(value) {
      return moment(value).format('lll');
    }
  }
}
</script>
<style lang="stylus">
</style>