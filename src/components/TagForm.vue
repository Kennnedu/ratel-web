<template>
  <b-form @submit="submitForm">
    <b-form-group id="tag-name-group" label="Name" label-for="tag-name">
      <b-form-input type="text" autofocus id="tag-name" required v-model="currentTag.name"></b-form-input>
    </b-form-group>
    <b-row>
      <b-col>
        <b-button type="submit" variant="primary" block>{{saveButtonName}}</b-button>
      </b-col>
      <b-col v-if="currentTag.id">
        <b-button variant="danger" @click="deleteTag" block>
          Delete
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { mapActions } from 'vuex'
import axios from 'axios'

export default {
  props: ['tag'],

  data: function(){
    return {
      currentTag: Object.assign({ name: '' }, this.tag),
      saveButtonName: this.tag.id ? "Update" : "Create"
    }
  },

  computed: {
    savingTag() {
      return { tag: { name: this.currentTag.name } }
    }
  },

  methods: {
    ...mapActions(['fetchRecords']),

    submitForm(e){
      e.preventDefault();

      if(!this.currentTag.id) this.createTag()
      else this.updateTag()
    },

    createTag(){
      const _this = this

      axios.post('/tags', _this.savingTag).then(() => _this.$emit('close'))
    },

    updateTag(){
      const _this = this

      axios.put(`/tags/${_this.currentTag.id}`, _this.savingTag).then(() => _this.$emit('close'));
    },

    deleteTag(e){
      e.preventDefault();
      const _this = this

      axios.delete(`/tags/${_this.currentTag.id}`).then(() => _this.$emit('close'));
    }
  }
}
</script>
<style>
</style>
