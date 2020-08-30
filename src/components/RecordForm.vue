<template>
  <b-form @submit="submitForm">
    <b-form-group id="record-name-group" label="Name" label-for="record-name">
      <RecordNameInput
        :recordName="currentRecord.name"
        :dataListId="'record-name-suggestions'"
        :isRequired="true"
	:autofocus="true"
        @change="newName => currentRecord.name = newName" />
    </b-form-group>

    <b-form-group id="record-amount-group" label="Amount" label-for="record-amount">
      <b-form-input type="number" id="record-amount" step="0.01" v-model.number="currentRecord.amount" :required="true">
      </b-form-input>
    </b-form-group>
    
    <b-form-group id="record-card-group" label="Source" label-for="record-card">
      <CardSelector
        :card="currentRecord.card"
        @selectCard="newCard => currentRecord.card = newCard"/>
    </b-form-group>
    
    <b-form-group id="record-tags-group" label="Tags">
      <TagsInput
        :recordsTags="currentRecord.records_tags"
        @change="newRecordsTags => currentRecord.records_tags = newRecordsTags" />
    </b-form-group>

    <b-form-group id="record-performed-at-group" label="Performed At" label-for="record-performed-at">
      <b-form-input type="datetime-local" id="record-performed-at" v-model="currentRecord.performed_at"></b-form-input>
    </b-form-group>
    <b-row>
      <b-col>
        <b-button type="submit" variant="primary" block>{{saveButtonName}}</b-button>
      </b-col>
      <b-col v-if="currentRecord.id">
        <b-button variant="danger" class="float-right" @click="destroy" block>Delete</b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
  import CardSelector from'./CardSelector.vue'
  import TagsInput from'./TagsInput.vue'
  import RecordNameInput from'./RecordNameInput.vue'

  const emptyNewRecord = () => {
    return {
      name: '',
      card: {},
      amount: 0.0,
      rest: 0.0,
      records_tags: [],
      performed_at: moment().format('YYYY-MM-DDTHH:mm')
    }
  }

  const initCurrentRecord = (record) => {
    if (record) {
      return Object.assign({}, record, { performed_at: moment(record.performed_at).format('YYYY-MM-DDTHH:mm')});
    } else {
      return Object.assign({}, emptyNewRecord());
    }
  }

  export default {
    components: { CardSelector, TagsInput, RecordNameInput },

    props: ['record'],

    data: function(){
      return {
        currentRecord: initCurrentRecord(this.record),
        errors: [],
        saveButtonName: this.record ? 'Update' : 'Save'
      }
    },

    computed: {
      savingRecord: function(){
        const performedAt = this.record ? moment(this.currentRecord.performed_at) : moment()
        let savingRecord = Object.assign({}, this.currentRecord, { performed_at: performedAt },
                            { card_id: this.currentRecord.card.id })
        savingRecord.records_tags_attributes = savingRecord.records_tags.map(recTag => {
          delete recTag.tag
          return recTag
        })
        delete savingRecord.records_tags
        delete savingRecord.card
        delete savingRecord.card_name_old
        return savingRecord
      }
    },

    methods: {
      submitForm(e){
        e.preventDefault();

        if(this.currentRecord.id){
          this.updateExistingRecord();
        } else {
          this.createNewRecord();
        }
      },

      createNewRecord(){
        let _this = this;
        _this.saveButtonName = 'Saving...'

        axios.post('/records', { record: _this.savingRecord })
        .then(() => _this.$emit("save"))
        .then(() => _this.saveButtonName = 'Save')
      },

      updateExistingRecord(){
        let _this = this;
        _this.saveButtonName = 'Updating...';

        axios.put(`/records/${_this.currentRecord.id}`, { record: _this.savingRecord })
          .then(() => _this.$emit("save"))
          .then(() => _this.saveButtonName = 'Update');
      },

      destroy() {
        const _this = this;

        axios.delete(`/records/${_this.record.id}`)
          .then(() => _this.$emit('save'))
      }
    }
  }
</script>
<style>
</style>
