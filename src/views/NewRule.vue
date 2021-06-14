<template>
  <b-container>
    <b-row>
      <b-col col="12">
        <b-card no-body class="mt-3">
          <b-card-header>
            <h3 class="d-inline text-center">New <span class="text-warning">{{editableRule.name}}</span> rule</h3>
          </b-card-header>
          <b-card-body>
            <rule-form @submit="submit"/>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios'
import RuleForm from '../components/RuleForm.vue'
import { mapState } from 'vuex'

export default {
  components: { RuleForm },

  computed: {
    ...mapState(['editableRule']),
  },

  methods: {
    submit() {
      axios.post('/rules', this.editableRule).then(() => this.$router.push('/rules'))
    }
  }
}
</script>