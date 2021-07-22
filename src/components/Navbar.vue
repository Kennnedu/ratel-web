<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" :sticky="true">
    <b-overlay :show="isFetchingTotalBalance" spinner-variant="secondary" spinner-type="grow" variant="dark" opacity="1" spinner-small rounded="sm" v-if="isMobile()">
      <b-navbar-brand :class="`mx-5 ${balanceColorClass}`" :aria-hidden="isFetchingTotalBalance ? 'true' : null" align="center">
        {{totalBalance}}
      </b-navbar-brand>
    </b-overlay>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="mx-auto" align='left'>
        <b-nav-item href="#" to="records" :active="$route.name === 'records'">
          Records
            <b-badge 
              v-bind:variant="totalSum < 0 && 'danger' || totalSum > 0 && 'success' || totalSum == 0 && 'secondary'"
              v-b-tooltip.hover title="Filtered Records Sum">{{totalSum}}</b-badge>
        </b-nav-item>
        <b-nav-item href="#" to="tags" :active="$route.name === 'tags'">
          Tags <b-badge variant="light">{{tagsCount}}</b-badge>
        </b-nav-item>
        <b-nav-item href="#" to="accounts" :active="$route.name === 'accounts'">
          Accounts <b-badge variant="light">{{cardsCount}}</b-badge>
        </b-nav-item>
        <b-nav-item href="#" to="record_names" :active="$route.name === 'record_names'">Record Names</b-nav-item>
      </b-navbar-nav>
      <b-overlay :show="isFetchingTotalBalance" spinner-variant="secondary" spinner-type="grow" variant="dark" opacity="1" spinner-small rounded="sm" v-if="!isMobile()">
        <b-navbar-brand :class="`mx-5 ${balanceColorClass}`" :aria-hidden="isFetchingTotalBalance ? 'true' : null" align="center" v-b-tooltip.hover title="Total Balance">
          {{totalBalance}}
        </b-navbar-brand>
      </b-overlay>
      <b-navbar-nav class="mx-auto" align='right'>
        <b-nav-item href="#" to="dashboard" :active="$route.name === 'dashboard'">Dashboard</b-nav-item>
        <b-nav-item href="#" to="reports" :active="$route.name === 'reports'">Bank Reports</b-nav-item>
        <b-nav-item href="#" to="rules" :active="$route.name === 'rules'">Rules</b-nav-item>
        <b-nav-item href="#" to="settings" :active="$route.name === 'settings'">Settings</b-nav-item>
        <b-nav-item href="#" @click="logout">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
  import { isMobile } from './../utils/mobileDetect.js'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import Cookies from 'js-cookie'

  export default {
    computed: {
      ...mapState(['filter', 'totalBalance', 'isFetchingTotalBalance', 'totalSum']),
      ...mapGetters(['cardsCount', 'tagsCount']),

      balanceColorClass() {
        if(this.totalBalance > 0) return 'text-success';
        else if(this.totalBalance < 0) return 'text-danger';
        else return ''; 
      }
    },

    mounted() {
      this.fetchTotalBalance();
      this.fetchTotalSum();
      this.fetchCards();
      this.fetchTags();
    },

    watch: {
      filter: {
        handler: function(){
          this.fetchTotalSum()
        },
        deep: true
      },
    },

    methods: {
      ...mapActions(['fetchTotalBalance', 'fetchTotalSum', 'fetchCards', 'fetchTags']),

      isMobile() {
        return isMobile();
      },

      logout() {
        Cookies.remove('session_token');
        this.$router.push('/login');
      }
    },
  }
</script>
<style></style>
