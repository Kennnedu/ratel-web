<template>
  <b-form>
    <b-form-group id="source-name-group" label="Source Name" label-for="source-name">
      <b-form-input type="text" id="source-name" required v-model="currentCard.name"></b-form-input>
    </b-form-group>

    <b-button variant="outline-primary" @click="submitForm">{{saveButtonName}}</b-button>
    <b-button variant="danger" v-if="currentCard.id" @click="deleteCard" class="float-right">
      Delete
    </b-button>
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
      let savingCard = Object.assign({}, this.currentCard);
      delete savingCard.id;
      return { card: savingCard }
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
      .then(() => {
        _this.fetchCards();
        _this.$emit('save');
      })
      .then(() => _this.$emit('close'));
    },

    updateCard(){
      const _this = this

      axios.put(`/cards/${_this.currentCard.id}`, _this.savingCard)
      .then(() => {
        _this.fetchCards();
        _this.$emit('close');
      })
      .then(() => _this.$emit('close'))
    },

    deleteCard(e){
      e.preventDefault();
      const _this = this

      axios.delete(`/cards/${_this.currentCard.id}`)
      .then(() => {
        _this.fetchCards();
        _this.fetchRecords();
        _this.$emit('close');
      })
      .then(() => _this.$emit('close'));
    }
  }
}
</script>
<style>
</style>
