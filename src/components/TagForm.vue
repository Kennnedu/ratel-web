<template>
  <b-form @submit="submitForm">
    <b-form-group id="tag-name-group" label="Tag Name" label-for="tag-name">
      <b-form-input type="text" autofocus id="tag-name" required v-model="currentTag.name"></b-form-input>
    </b-form-group>

    <b-button type="submit" variant="outline-primary">{{saveButtonName}}</b-button>
    <b-button variant="danger" v-if="currentTag.id" @click="deleteTag" class="float-right">
      Delete
    </b-button>
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
