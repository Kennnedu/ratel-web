<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="mx-auto" align='left'>
        <b-nav-item href="#" to="records" :active="$route.name === 'records'">Records</b-nav-item>
        <b-nav-item href="#" to="tags" :active="$route.name === 'tags'">
          Tags <b-badge>{{tagsCount}}</b-badge>
        </b-nav-item>
        <b-nav-item href="#" to="sources" :active="$route.name === 'sources'">
          Sources <b-badge>{{cardsCount}}</b-badge>
        </b-nav-item>
      </b-navbar-nav>
      <b-overlay :show="isFetchingTotalSum" spinner-variant="secondary" spinner-type="grow" variant="dark" opacity="1" spinner-small rounded="sm">
        <b-navbar-brand :class="`mx-5 ${balanceColorClass}`" :aria-hidden="isFetchingTotalSum ? 'true' : null" align="center">
          {{totalSum}}
        </b-navbar-brand>
      </b-overlay>
      <b-navbar-nav class="mx-auto" align='right'>
        <b-nav-item href="#" to="record_names" :active="$route.name === 'record_names'">Record names</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
  import debounce from 'lodash.debounce'
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState(['filter', 'totalSum', 'isFetchingTotalSum']),
      ...mapGetters(['cardsCount', 'tagsCount']),

      balanceColorClass() {
        if(this.totalSum > 0) return 'text-success';
        else if(this.totalSum < 0) return 'text-danger';
        else return ''; 
      }
    },

    mounted() {
			let params = {}
			if(this.$route.name === 'expences') params = {'amount[lt]': 0}
      this.fetchTotalSum(params);
      this.fetchCards();
      this.fetchTags();
      this.debouncedFetchSum = debounce(this.fetchTotalSum, 500);
    },

    watch: {
      filter: {
        handler: function(){
          this.fetchTotalSum()
        },
        deep: true
      },

      $route(to, from) {
				if(from.name !== 'expences' && to.name === 'expences') this.fetchTotalSum({'amount[lt]': 0});
				if(['login', 'expences'].includes(from.name) && !['expences'].includes(to.name)) this.fetchTotalSum();
      }
    },

    methods: {
      ...mapActions(['fetchTotalSum', 'fetchCards', 'fetchTags'])
    },
  }
</script>
<style></style>
