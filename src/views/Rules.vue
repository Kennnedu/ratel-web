<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-card no-body class="mt-3">
          <b-card-header>
            <h3 class="d-inline text-center">Rules</h3>
            <b-button variant="primary" class="float-right" size="sm" @click="newRule">New</b-button>
          </b-card-header>
          <b-card-body>
            <b-overlay :show="isFetching">
              <b-table-lite
                striped
                bordered
                fixed
                :items="rules"
                :fields="fields"
                :head-variant="'light'"
                class="rounded">
                <template #cell(action)="data">
                  <b-button size="sm" variant="outline-warning" class="mr-2" @click="editRule(data.item)">
                    Edit
                  </b-button>
                  <b-button size="sm" variant="outline-danger" @click="confirmDeleteDialog(data.item.id)">
                    Delete
                  </b-button>
                </template>
              </b-table-lite>
            </b-overlay>
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
              :total-rows="totalRules"
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
import { mapMutations } from 'vuex'

export default {
  data: function() {
    return {
      fields: [
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'type',
          label: 'Type'
        },
        {
          key: 'updated_at',
          label: 'Changed At',
          formatter: 'createdAtFormatter'
        },
        {
          key: 'action',
          label: 'Action'
        }
      ],
      rules: [],
      totalRules: 0,
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
    ...mapMutations(['updateEditableRule']),

    fetch() {
      this.isFetching = true;
      const offset = (this.currentPage - 1) * this.perPage
      axios.get('/rules', { params: { 'limit': this.perPage, 'offset': offset }}).then(({data}) => {
        this.rules = data.rules
        this.totalRules = data.total_count
        this.isFetching = false
      })
    },

    createdAtFormatter(value) {
      return moment(value).format('lll');
    },

    confirmDeleteDialog(id) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete the rule, all related records will be deleted?', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        centered: true
      })
        .then(confirmed => confirmed && axios.delete(`/rules/${id}`).then(() =>  this.fetch()))
    },

    newRule() {
      this.updateEditableRule({changes: {id: null, name: '', type: '', condition: {}, card_id: null, tag_id: null, created_at: null, updated_at: null, user_id: null}});
      this.$router.push('/new_rule');
    },

    editRule(rule) { 
      this.updateEditableRule({changes: rule});
      this.$router.push('/edit_rule')
    }
  }
}
</script>
<style lang="stylus">
</style>
