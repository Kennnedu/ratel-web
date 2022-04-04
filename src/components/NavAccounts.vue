<template>
  <b-nav-item-dropdown href="#" no-caret>
    <template #button-content>
      Accounts <b-badge variant="light">{{cardsCount}}</b-badge>
    </template>
    <b-dropdown-item @click="() => onClickAccountCallback({'name': ''})">+ Add New</b-dropdown-item>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item v-for="account in cards" :key="account.name" @click="() => onClickAccountCallback(account)">{{account.name}}</b-dropdown-item>

    <b-modal id="modal-edit-account" centered :title="`${currentAccount.name ? 'Edit' : 'New'} Account`" hide-footer>
      <CardForm @close="onCloseModalCallback()" :card="currentAccount" />
    </b-modal>
  </b-nav-item-dropdown>
</template>
<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import CardForm from '../components/CardForm.vue'

  export default {
    data: function() {
      return {
        currentAccount: {'name': ''},
      }
    },

    components: {CardForm},

    computed: {
      ...mapState(['cards']),
      ...mapGetters(['cardsCount']),
    },

    methods: {
      ...mapActions(['fetchCards']),

      onClickAccountCallback(account) {
        this.currentAccount = account;
        this.$bvModal.show('modal-edit-account');
      },

      onCloseModalCallback() {
        this.$bvModal.hide('modal-edit-account');
        this.fetchCards();
      }
    }
  }
</script>
<style></style>
