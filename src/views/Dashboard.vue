<template>
  <b-container>
    <b-row>
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

export default {
  components: { ExpencesIncomeChart, AccountChart, TagChart },
}
</script>