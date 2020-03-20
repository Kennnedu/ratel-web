<template>
  <div>
    <b-input 
      type="text"
      class="form-control"
      id="record-name"
      placeholder="Enter operation"
      :value="recordName"
      @input="val => $emit('change', val)"
      list="suggested-record-names"
      autocomplete="off"
      :required="isRequired"></b-input>

    <datalist id="suggested-record-names">
      <option v-for="(recName, index) in suggestedRecordNames" :key="recName.toLowerCase() + index">
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
