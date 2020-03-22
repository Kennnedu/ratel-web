<template>
  <form v-on:submit="submitForm">
    <b-form-group id="statements-html-group" label="Amount" label-for="statements-html">
      <b-form-file 
        id="statements-html"
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
        errors: [],
        saveButtonName: 'Upload'
      }
    },

    computed: {
      isDisabledTextArea() { return this.saveButtonName !== 'Upload' },
      nubmerOfError() { return this.errors.length },
    },

    methods: {
      ...mapActions(['fetchCards']),

      submitForm(e){
        e.preventDefault();

        let _this = this;
        _this.errors = [];

        _this.saveButtonName = 'Saving...';

        axios.post('/records/bulk', this.getFormData())
          .then(() => {
            _this.saveButtonName = 'Upload';
            _this.fetchCards()
            _this.$emit('save');
          })
          .catch(err => _this.errorHandler(err.response));
      },

      errorHandler(response){
        this.saveButtonName = 'Upload';
        if(Array.isArray(response.data.message)) {
          this.errors = [...this.errors, ...response.data.message];
        } else {
          this.errors.push(response.data.message)
        }
      },

      getFormData() {
        let fd = new FormData();

        fd.append('html_file', this.file)

        return fd
      }
    }
  }
</script>
<style lang="css" scoped>
  .pure-form-message.pure-form-message-error {
    color: red;
  }
</style>
