<template>
  <b-form @submit="submitForm">
    <b-form-group id="source-name-group" label="Name" label-for="source-name">
      <b-form-input type="text" autofocus id="source-name" v-model="currentCard.name" :required="true">
      </b-form-input>
    </b-form-group>

    <b-row>
      <b-col>
        <b-button type="submit" variant="primary" block>{{saveButtonName}}</b-button>
      </b-col>
      <b-col v-if="currentCard.id">
        <b-button variant="danger" @click="deleteCard" block>
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
  props: ['card'],

  data: function(){
    return {
      currentCard: Object.assign({ name: '' }, this.card),
      saveButtonName: this.card.id ? "Update" : "Create"
    }
  },

  computed: {
    savingCard() {
      return { card: { name: this.currentCard.name } }
    }
  },

  methods: {
    ...mapActions(['fetchCards', 'fetchRecords']),

    submitForm(e){
      e.preventDefault();

      if(!this.currentCard.id) this.createCard()
      else this.updateCard()
    },

    createCard(){
      const _this = this

      axios.post('/cards', _this.savingCard)
      .then(() => _this.fetchCards())
      .then(() => _this.$emit('close'));
    },

    updateCard(){
      const _this = this

      axios.put(`/cards/${_this.currentCard.id}`, _this.savingCard)
      .then(() => _this.fetchCards())
      .then(() => _this.$emit('close'))
    },

    deleteCard(e){
      e.preventDefault();
      const _this = this

      axios.delete(`/cards/${_this.currentCard.id}`)
      .then(() => {
        _this.fetchCards();
        _this.$emit('close');
      })
    }
  }
}
</script>
<style>
</style>
