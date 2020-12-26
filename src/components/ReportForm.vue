<template>
  <form v-on:submit="submitForm">
    <b-form-group id="statements-html-group" label="Document">
      <b-form-file 
        placeholder="Choose a file or drop it here..."
        :disabled="isDisabledTextArea"
        @change="e => { this.file = e.target.files[0] }"></b-form-file>
    </b-form-group>
    <b-button type="submit" variant="primary">{{saveButtonName}}</b-button>
  </form>
</template>
<script>
  import axios from 'axios'
  import { mapActions } from 'vuex'

  export default {
    data: function(){
      return {
        file: {},
        saveButtonName: 'Upload'
      }
    },

    computed: {
      isDisabledTextArea() { return this.saveButtonName !== 'Upload' },
    },

    methods: {
      ...mapActions(['fetchCards']),

      submitForm(e){
        e.preventDefault();

        let _this = this;

        _this.saveButtonName = 'Saving...';

        axios.post('/reports', this.getFormData())
          .then(() => {
            _this.saveButtonName = 'Upload';
            _this.fetchCards()
            _this.$emit('save');
          })
      },

      getFormData() {
        let fd = new FormData();

        fd.append('document', this.file)

        return fd
      }
    }
  }
</script>
<style>
</style>
