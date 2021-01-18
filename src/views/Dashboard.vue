<template>
  <b-container>
    <b-row>
      <b-col cols="12" class="mt-3">
        <balance-chart />
      </b-col>
      <b-col cols="12" class="mt-3">
        <expences-income-chart />
      </b-col>
      <b-col cols="12" class="mt-3">
        <tag-chart />
      </b-col>
      <b-col cols="12" class="mt-3">
        <account-chart />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import ExpencesIncomeChart from '../components/ExpencesIncomeChart'
import AccountChart from '../components/AccountChart'
import TagChart from '../components/TagChart'
import BalanceChart from '../components/BalanceChart.vue'

export default {
  components: { ExpencesIncomeChart, AccountChart, TagChart, BalanceChart },
}
</script>