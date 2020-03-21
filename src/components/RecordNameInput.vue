<template>
  <div>
    <b-input 
      type="text"
      class="form-control"
      id="record-name"
      placeholder="Enter name"
      :value="recordName"
      @input="val => $emit('change', val)"
      :list="datalistClass()"
      autocomplete="off"
      :required="isRequired"></b-input>

    <datalist :id="datalistClass()">
      <option v-for="(recName, index) in suggestedRecordNames" :key="recName.toLowerCase() + index">
        {{recName}}
      </option>
    </datalist>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['recordName', 'isRequired', 'dataListId'],

  data: function(){
    return {
      suggestedRecordNames: []
    }
  },

  watch: {
    recordName(newVal) {
      if(newVal.length === 0) {
        this.suggestedRecordNames = [];
        return null;
      }
      this.findSuggestions(newVal);
    }
  },

  methods: {
    datalistClass(){
      return this.dataListId || 'suggested-record-names'
    },

    findSuggestions(keyword) {
      axios.get('/records/names', {params: { name: keyword }})
        .then(resp => this.suggestedRecordNames = resp.data.record_names.map(el => el.name))
    }
  }
}
</script>
<style lang="css" scoped>
</style>
