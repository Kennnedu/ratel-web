<template>
  <b-form-group label="Accounts" label-size="sm">
    <div class="d-flex">
      <div class="d-flex justify-content-center align-items-center p-1">
        <font-awesome-icon icon="plus"/>
      </div>
      <multiselect
        :value="onlyAccounts"
        :options="cards.map(t => t.name)"
        :multiple="true"
        :hideSelected="true"
        :searchable="false"
        placeholder="are included"
        @input="updateOnlyAccounts"/>
    </div>

  <div class="d-flex">
    <div class="d-flex justify-content-center align-items-center p-1 pt-2">
      <font-awesome-icon icon="minus"/>
    </div>
    <multiselect
      class="mt-2"
      :value="exceptAccounts"
      :options="cards.map(t => t.name)"
      :multiple="true"
      :hideSelected="true"
      :searchable="false"
      placeholder="are excluded"
      @input="updateExceptAccounts"/>
  </div>
  </b-form-group>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Multiselect from 'vue-multiselect'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faMinus);

export default {
  data: function(){
    return {
      onlyAccounts: [],
      exceptAccounts: [],
    }
  },

  components: { Multiselect },

  created() {
    this.assingAccountsStr(this.filter.card);
  },

  computed: {
    ...mapState(['filter', 'cards']),

    accountsStr() {
      return [...this.onlyAccounts, ...this.exceptAccounts.map(t => `!${t}`)].join('&')
    }
  },

  methods: {
    ...mapMutations(['updateFilter']),

    updateOnlyAccounts(newOnlyAccounts) {
      this.onlyAccounts = newOnlyAccounts;
      this.updateFilter({ changes: { card: this.accountsStr } });
    },

    updateExceptAccounts(newExceptAccounts) {
      this.exceptAccounts = newExceptAccounts;
      this.updateFilter({ changes: { card: this.accountsStr } });
    },

    assingAccountsStr(accountsStr) {
      const accounts = accountsStr.split('&');
      this.onlyAccounts = accounts.filter(a => a[0] !== '!' && a.length > 0);
      this.exceptAccounts = accounts.filter(a => a[0] === '!' && a.length > 1).map(a => a.slice(1));
    }
  },

  watch: {
    filter: {
      handler: function(newFilter){
        if(newFilter.card !== this.accountsStr) {
          this.assingAccountsStr(newFilter.card);
        }
      },
      deep: true
    }
  },
}
</script>
<style>
</style>
