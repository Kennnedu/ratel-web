<template>
  <b-navbar type="dark" variant="dark" fixed="top">
    <b-navbar-nav class="mx-auto">
      <b-nav-item href="#" active>Records</b-nav-item>
      <b-nav-item href="#">Tags</b-nav-item>
      <b-nav-item href="#">Sources</b-nav-item>
      <b-nav-text :class="`mx-5 ${balanceColorClass}`">
        {{totalSum}}
      </b-nav-text>
      <b-nav-item href="#">Expences</b-nav-item>
      <b-nav-item href="#">Replenish</b-nav-item>
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