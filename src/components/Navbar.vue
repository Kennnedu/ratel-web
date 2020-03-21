<template>
  <b-navbar type="dark" variant="dark" fixed="top">
    <b-navbar-nav class="mx-auto">
      <b-nav-item href="#" to="records" :active="$route.name === 'records'">Records</b-nav-item>
      <b-nav-item href="#" to="tags" :active="$route.name === 'tags'">Tags</b-nav-item>
      <b-nav-item href="#" to="sources" :active="$route.name === 'sources'">Sources</b-nav-item>
      <b-nav-text :class="`mx-5 ${balanceColorClass}`">
        {{totalSum}}
      </b-nav-text>
      <b-nav-item href="#" to="expences" :active="$route.name === 'expences'">Expences</b-nav-item>
      <b-nav-item href="#" to="replenishments" :active="$route.name === 'replenishments'">Replenish</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['totalSum']),

      balanceColorClass() {
        if(this.totalSum > 0) return 'text-success';
        else if(this.totalSum < 0) return 'text-danger';
        else return ''; 
      }
    }
  }
</script>
<style></style>