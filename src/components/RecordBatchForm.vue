<template>
  <b-form>
    <b-form-group id="filter-to" label="Record Name">
      <RecordNameInput
        :recordName="batchForm.name"
        @change="newName => batchForm.name = newName" />
    </b-form-group>

    <b-form-group id="filter-to" label="Sources">
      <CardSelector
        :card="batchForm.card"
        @selectCard="newCard => batchForm.card = newCard"/>
    </b-form-group>

    <b-form-group id="filter-to" label="Add tags">
      <TagsInput
        :recordsTags="batchForm.addRecordsTags"
        @change="newRecordsTags => batchForm.addRecordsTags = newRecordsTags" />
    </b-form-group>

    <b-form-group id="filter-to" label="Remove Tags">
      <TagsInput
        :recordsTags="batchForm.removeRecordsTags"
        @change="newRecordsTags => batchForm.removeRecordsTags = newRecordsTags" />
    </b-form-group>
    <b-row>
      <b-col>
        <b-button variant="primary" :disabled="!validBatchForm" @click="submitForm" block>{{submitButtonName}}</b-button>
      </b-col>
      <b-col v-if="shouldDisplayDestroyAllBtn">
        <b-button class="float-right" variant="danger" @click="destroyRecords" block>
          Destroy All
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import axios from 'axios'
import { mapState, mapGetters } from 'vuex'
import TagsInput from'./TagsInput.vue'
import CardSelector from'./CardSelector.vue'
import RecordNameInput from'./RecordNameInput.vue'

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

  created() {
    this.shouldDisplayDestroyAllBtn = process.env.NODE_ENV === 'development'
  },

  methods: {
    clearForm() {
      this.batchForm = {
        name: '',
        addRecordsTags: [],
        removeRecordsTags: [],
        card: {}
      }
    },

    submitForm(e) {
      e.preventDefault();
      this.submitButtonName = 'Saving...'

      axios.put('/records', this.submitFormParams())
        .then(() => {
          this.submitButtonName = 'Apply';
          this.clearForm()
          this.$emit('remoteAction');
        })
    },

    destroyRecords(e) {
      e.preventDefault();

      if (!confirm('Are you sure do you want tor remove all selected records?')) return null;

      axios({url: '/records', method: 'delete', params: this.filterParams })
        .then(() => { this.clearForm(); this.$emit('remoteAction')})
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
<style>
</style>
