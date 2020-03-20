<template>
  <div>
    <div class="mb-1">
      <b-badge
        pill
        variant="secondary"
        class="mr-1"
        v-for="(recordsTag, index) in recordsTags.filter(recTag => !recTag._destroy)"
        :key="recordsTag.tag.name.toLowerCase() + index">
        {{recordsTag.tag.name}}
        <font-awesome-icon
          prefix="far"
          icon="times-circle"
          @click="e => deleteRecordsTag(recordsTag)" />
      </b-badge>
    </div>

    <b-form-input
      type="text"
      id="record-tags"
      placeholder="Press space to add new tag"
      v-model="tagName"
      @keyup.space="addRecordsTag"
      :list="dataListId"
      autocomplete="off"></b-form-input>

    <datalist :id="dataListId">
      <option v-for="tag in suggestedTags" :key="tag.id">{{tag.name}}</option>
    </datalist>
  </div>
</template>
<script>
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTimesCircle)

export default {
  props: ['recordsTags', 'defaultDatalistID'],

  data: function(){
    return {
      tagName: '',
      suggestedTags: []
    }
  },

  computed: {
    displayingRecordsTags() {
      return this.recordsTags.filter(recTag => !recTag._destroy)
    },

    dataListId(){
      return this.defaultDatalistID || 'suggested-tags'
    }
  },

  watch: {
    tagName(newVal) {
      if(newVal.length === 0) {
        this.suggestedTags = [];
        return null;
      }

      this.findSuggestions(newVal)
    }
  },

  methods: {
    addRecordsTag(){
      const _this = this;

      axios.post(`/tags/${_this.tagName}`)
        .then(resp => {
          _this.tagName = "";
          _this.$emit('change', [..._this.recordsTags, ...[Object.assign({tag_id: resp.data.tag.id}, resp.data)] ]);
        })
    },

    findSuggestions(keyword) {
      axios.get('/tags', { params: {keyword: keyword} })
        .then(resp => this.suggestedTags = resp.data.tags)
    },

    deleteRecordsTag(removingRecordsTag) {
      if(removingRecordsTag.id) {
        removingRecordsTag._destroy = true
        this.$emit('change', [...[], ...this.recordsTags])
      } else this.$emit('change', this.recordsTags.filter(recTag => recTag.tag_id !== removingRecordsTag.tag_id))
    }
  }
}
</script>
<style>
</style>
