<template>
  <b-form @submit="submitForm">
    <b-form-group class="mb-3" id="record-amount-group" label="Amount:">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text ><font-awesome-icon icon="dollar-sign"/></b-input-group-text>
        </b-input-group-prepend>
        <b-form-input type="number" id="record-amount" step="0.01" :autofocus="true" v-model.number="currentRecord.amount" :required="true">
        </b-form-input>
      </b-input-group>
    </b-form-group>
    
    <b-form-group class="mb-3" id="record-card-group" label="Source:">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text ><font-awesome-icon icon="credit-card"/></b-input-group-text>
        </b-input-group-prepend>
        <CardSelector
          :card="currentRecord.card"
          @selectCard="newCard => currentRecord.card = newCard"/>
      </b-input-group>
    </b-form-group>
      
    <b-form-group class="mb-3" id="record-tags-group" label="Tags:">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text ><font-awesome-icon icon="tags"/></b-input-group-text>
        </b-input-group-prepend>
        <TagsInput
          :recordsTags="currentRecord.records_tags"
          @change="newRecordsTags => currentRecord.records_tags = newRecordsTags" />
      </b-input-group>
    </b-form-group>

    <b-form-group class="mb-3" id="record-performed-at-group" label="Performed at:">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text ><font-awesome-icon icon="calendar"/></b-input-group-text>
        </b-input-group-prepend>
        <flat-pickr v-model="currentRecord.performed_at"
                    class="form-control"
                    :config="{enableTime: true}"></flat-pickr>
      </b-input-group>
    </b-form-group>
    
    <b-form-group id="record-name-group">
      <RecordNameInput
        :recordName="currentRecord.name"
        :dataListId="'record-name-suggestions'"
        @change="newName => currentRecord.name = newName" />
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
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faDollarSign, faCreditCard, faTags, faCalendar } from '@fortawesome/free-solid-svg-icons'
  
  library.add(faDollarSign, faCreditCard, faTags, faCalendar)

  const emptyNewRecord = () => {
    return {
      name: '',
      card: {},
      amount: null,
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
    components: { CardSelector, TagsInput, RecordNameInput, flatPickr },

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
