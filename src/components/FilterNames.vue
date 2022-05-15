<template>
  <b-form-group id="filter-name-group" label="Names" label-size="sm">
    <div class="d-flex">
      <div class="d-flex justify-content-center align-items-center p-1">
        <font-awesome-icon icon="plus"/>
      </div>
      <multiselect
        :value="onlyNames"
        :options="options"
        :multiple="true"
        :searchable="true"
        :internal-search="false"
        :taggable="true"
        :loading="isLoading"
        :hideSelected="true"
        placeholder="are included"
        @search-change="fetchSearch"
        @tag="tag => updateOnlyNames([...onlyNames, ...[tag]])"
        @input="updateOnlyNames">
        <template slot="noOptions">
          Please start typing to get options...
        </template>
      </multiselect>
    </div>

  <div class="d-flex">
    <div class="d-flex justify-content-center align-items-center p-1 pt-2">
      <font-awesome-icon icon="minus"/>
    </div>
    <multiselect
      class="mt-2"
      :value="exceptNames"
      :options="options"
      :multiple="true"
      :searchable="true"
      :internal-search="false"
      :taggable="true"
      :loading="isLoading"
      :hideSelected="true"
      placeholder="are excluded"
      @search-change="fetchSearch"
      @tag="tag => updateExceptNames([...exceptNames, ...[tag]])"
      @input="updateExceptNames">
      <template slot="noOptions">
        Please start typing to get options...
      </template>
      <template slot="tag">
      </template>
    </multiselect>
  </div>
  </b-form-group>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faMinus);

export default {
  components: { Multiselect },

  data: function(){
    return {
      onlyNames: [],
      exceptNames: [],
      options: [],
      isLoading: false,
    }
  },

  computed: {
    ...mapState(['filter']),

    namesStr() {
      return [...this.onlyNames, ...this.exceptNames.map(t => `!${t}`)].join('&')
    }
  },

  created() {
    this.assingNamesStr(this.filter.name);
  },

  methods: {
    ...mapMutations(['updateFilter']),

    updateOnlyNames(newNames) {
      this.onlyNames = newNames;
      this.options = [];
      this.updateFilter({ changes: { name: this.namesStr }});
    },

    updateExceptNames(newNames) {
      this.exceptNames = newNames;
      this.options = [];
      this.updateFilter({ changes: { name: this.namesStr }});
    },

    assingNamesStr(namesStr) {
      const names = namesStr.split('&');
      this.onlyNames = names.filter(n => n[0] !== '!' && n.length > 0);
      this.exceptNames = names.filter(n => n[0] === '!' && n.length > 1).map(n => n.slice(1));
    },

    async fetchSearch(keyword) {
      await axios.get('/records/names', { params: { name: keyword }}).then(resp => {
        this.options = resp.data['record_names'].map(el => el['name'])
      })
    },
  },

  watch: {
    filter: {
      handler: function(newFilter){
        if(newFilter.name !== this.namesStr) {
          this.assingNamesStr(newFilter.name);
        }
      },
      deep: true
    }
  },
}
</script>
<style>
</style>
