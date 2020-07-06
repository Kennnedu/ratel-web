<template>
  <b-navbar type="dark" variant="dark" fixed="top">
    <b-navbar-nav class="mx-auto">
      <b-nav-item href="#" to="records" :active="$route.name === 'records'">Records</b-nav-item>
      <b-nav-item href="#" to="tags" :active="$route.name === 'tags'">Tags</b-nav-item>
      <b-nav-item href="#" to="sources" :active="$route.name === 'sources'">Sources</b-nav-item>
      <b-overlay :show="isFetchingTotalSum" spinner-variant="secondary" spinner-type="grow" variant="dark" opacity="1" spinner-small rounded="sm">
        <b-nav-text :class="`mx-5 ${balanceColorClass}`" :aria-hidden="isFetchingRecords ? 'true' : null">
          {{totalSum}}
        </b-nav-text>
      </b-overlay>
      <b-nav-item href="#" to="expences" :active="$route.name === 'expences'">Expences</b-nav-item>
      <b-nav-item href="#" to="replenishments" :active="$route.name === 'replenishments'">Replenish</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
  import debounce from 'lodash.debounce'
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState(['filter', 'totalSum', 'isFetchingTotalSum']),

      balanceColorClass() {
        if(this.totalSum > 0) return 'text-success';
        else if(this.totalSum < 0) return 'text-danger';
        else return ''; 
      }
    },

    mounted() {
			let params = {}
			if(this.$route.name === 'expences') params = {'amount[lt]': 0}
			if(this.$route.name === 'replenishments') params = {'amount[gt]': 0}
      this.fetchTotalSum(params);
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
				if(from.name !== 'replenishments' && to.name === 'replenishments') this.fetchTotalSum({'amount[gt]': 0});
				if(['login', 'expences', 'replenishments'].includes(from.name) && !['expences', 'replenishments'].includes(to.name)) this.fetchTotalSum();
      }
    },

    methods: {
      ...mapActions(['fetchTotalSum'])
    },
  }
</script>
<style></style>
