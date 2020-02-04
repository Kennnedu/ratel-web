<template>
  <div>
    <input 
      type="text"
      id="record-name"
      placeholder="Enter operation"
      v-bind:value="recordName"
      v-on:input="e => $emit('change', e.target.value)"
      list="suggested-record-names"
      autocomplete="off"
      v-bind:required="isRequired" />

    <datalist id="suggested-record-names">
      <option v-for="(recName, index) in suggestedRecordNames" v-bind:key="recName.toLowerCase() + index">
        {{recName}}
      </option>
    </datalist>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['recordName', 'isRequired'],

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
    findSuggestions(keyword) {
      axios.get('/records/names', {params: { name: keyword }})
        .then(resp => this.suggestedRecordNames = resp.data.record_names.map(el => el.name))
    }
  }
}
</script>
<style lang="css" scoped>
</style>
