<template>
  <form class="pure-form pure-form-stacked" v-on:submit="submitForm" title='Эта форма может отредактировать всю отфильтрованную выборку записей'>
    <fieldset>
      <label> Add tags </label>
      <TagsInput
        v-bind:recordsTags="batchForm.addRecordsTags"
        v-on:change="newRecordsTags => batchForm.addRecordsTags = newRecordsTags" />

      <label> Remove Tags </label>
      <TagsInput
        v-bind:recordsTags="batchForm.removeRecordsTags"
        v-bind:defaultDatalistID="'suggested-removing-tags'"
        v-on:change="newRecordsTags => batchForm.removeRecordsTags = newRecordsTags" />

      <label for="record-batch-name">Operation</label>
      <RecordNameInput
        v-bind:recordName="batchForm.name"
        v-on:change="newName => batchForm.name = newName" />

      <label>Card</label>
      <CardSelector
        v-bind:card="batchForm.card"
        v-on:selectCard="newCard => batchForm.card = newCard"/>
    </fieldset>

    <input
      type="submit"
      class="pure-button pure-button-primary"
      v-bind:disabled="!validBatchForm"
      v-bind:value="submitButtonName" />
    <input
      type="button"
      class="pure-button button-error"
      v-on:click="destroyRecords"
      value="Destroy All" />
  </form>
</template>
<script>
import axios from 'axios'
import { mapState, mapGetters, mapActions } from 'vuex'
import TagsInput from '../TagsInput.vue'
import CardSelector from '../CardSelector.vue'
import RecordNameInput from '../RecordNameInput.vue'

export default {
  components: {
    TagsInput,
    CardSelector,
    RecordNameInput
  },

  data: function() {
    return {
      batchForm: {
        name: '',
        addRecordsTags: [],
        removeRecordsTags: [],
        card: {}
      },

      submitButtonName: 'Apply',
      isDisabledSubmit: true
    }
  },

  computed: {
    ...mapState(['filter']),
    ...mapGetters(['filterParams']),

    validBatchForm() {
      const { name, card, addRecordsTags, removeRecordsTags } = this.batchForm
      return name.length > 0 || card.id || addRecordsTags.length > 0 || removeRecordsTags.length > 0
    }
  },

  methods: {
    ...mapActions(['fetchRecords']),

    submitForm(e) {
      e.preventDefault();
      this.submitButtonName = 'Saving...'

      axios.put('/records', this.submitFormParams())
        .then(() => {
          this.submitButtonName = 'Apply';
          this.fetchRecords();
          this.$emit('close');
        })
    },

    destroyRecords(e) {
      e.preventDefault();

      if (!confirm('Are you sure do you want tor remove all selected records?')) return null;

      axios({url: '/records', method: 'delete', params: this.filterParams })
        .then(() => {
          this.fetchRecords();
          this.$emit('close');
        })
    },

    submitFormParams() {
      const { batchForm, filter } = this
      let fd = new FormData();

      Object.keys(filter).forEach(el => { 
        if(el === 'from') fd.append('performed_at[gt]', filter.from)
        else if(el === 'to' ) fd.append('performed_at[lt]', filter.to)
        else fd.append(el, filter[el])
      });

      if(batchForm.name.length > 0) fd.append('batch_form[name]', batchForm.name)
      if(batchForm.card.id) fd.append('batch_form[card_id]', batchForm.card.id)
      if(batchForm.addRecordsTags.length > 0) {
        batchForm.addRecordsTags.forEach(recTag => fd.append('batch_form[records_tags_attributes][][tag_id]', recTag.tag_id))
      }

      if(batchForm.removeRecordsTags.length > 0) {
        batchForm.removeRecordsTags.forEach(recTag => fd.append('removing_tag_ids[]', recTag.tag_id))
      }

      return fd
    }
  }
}
</script>
<style lang="css">
</style>
