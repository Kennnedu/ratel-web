<template>
  <b-form>
    <b-form-group>
      <RecordNameInput
        :recordName="batchForm.name"
        @change="newName => batchForm.name = newName" />
    </b-form-group>

    <b-form-group label="Account">
      <CardSelector
        :card="batchForm.card"
        @selectCard="newCard => batchForm.card = newCard"/>
    </b-form-group>

    <b-form-group label="Add Tags">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text class="font-weight-bold">&plus;</b-input-group-text>
        </b-input-group-prepend>
        <TagsInput
          :recordsTags="batchForm.addRecordsTags"
          @change="newRecordsTags => batchForm.addRecordsTags = newRecordsTags" />
      </b-input-group>
    </b-form-group>

    <b-form-group label="Remove Tags">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text class="font-weight-bold">&minus;</b-input-group-text>
        </b-input-group-prepend>
        <TagsInput
          :recordsTags="batchForm.removeRecordsTags"
          @change="newRecordsTags => batchForm.removeRecordsTags = newRecordsTags" />
      </b-input-group>
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreditCard, faTags } from '@fortawesome/free-solid-svg-icons'

library.add(faCreditCard, faTags,)

export default {
  components: {
    TagsInput,
    CardSelector,
    RecordNameInput
  },

  props: ['selectedOption', 'selectedRecordIds'],

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

      axios({url: '/records', method: 'delete', params: this.destroyRecordsParams() })
        .then(() => { this.clearForm(); this.$emit('remoteAction')})
    },

    destroyRecordsParams() {
      let dRP = {...{}, ...this.filterParams}

      if(this.selectedOption === 'Many') {
        dRP['except_ids'] = this.selectedRecordIds.slice(1, this.selectedRecordIds.length)
      } else if(this.selectedOption === 'Several') {
        dRP['ids'] = this.selectedRecordIds
      }

      return dRP
    },

    submitFormParams() {
      const { batchForm, filter } = this
      let fd = new FormData();

      if(this.selectedOption === 'All' || this.selectedOption === 'Many') {
        Object.keys(filter).forEach(el => {
          if(el === 'from') fd.append('performed_at[gt]', filter.from)
          else if(el === 'to' ) fd.append('performed_at[lt]', filter.to)
          else fd.append(el, filter[el])
        });

        if(this.selectedOption === 'Many') {
          this.selectedRecordIds.slice(1, this.selectedRecordIds.length).forEach(id => fd.append('except_ids[]', id))
        }
      } else if(this.selectedOption === 'Several') {
        this.selectedRecordIds.forEach(id => fd.append('ids[]', id))
      }

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
