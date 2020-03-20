<template>
  <b-form-select
    id="record-card"
    v-model="currentCardId"
    :required="required"
    @change="$emit('selectCard', cards.filter(card => currentCardId === card.id)[0])">
    <b-form-select-option
      v-for="card in cards"
      :key="card.id"
      :value="card.id"
      :selected="currentCardId === card.id">
      {{card.name}}
    </b-form-select-option>
  </b-form-select>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: ['card', 'required'],

  data: function(){
    return {
      currentCardId: this.card.id || null,
    }
  },

  computed: {
    ...mapState(['cards'])
  }
}
</script>
<style lang="css" scoped>
</style>
