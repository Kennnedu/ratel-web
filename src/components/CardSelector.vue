<template>
  <div>
    <input type="hidden" :value="currentCardId" :required="required"/>
    <b-button size="sm" v-for="account in cards" :key="account.name" class="ml-1 mb-1"
     :variant="currentCardId === account.id ? 'secondary' : 'outline-secondary'"
       @click="selectAccount(account)">{{account.name}}</b-button>
  </div>
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
  },

  methods: {
    selectAccount(account) {
      if(this.currentCardId === account.id && !this.$props.required) {
        this.currentCardId = null;
        this.$emit('selectCard', { id: null })
      } else {
        this.currentCardId = account.id
        this.$emit('selectCard', account)
      }
    }
  }
}
</script>
<style lang="css" scoped>
</style>
