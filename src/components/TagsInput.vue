<template>
      <b-form-tags v-model="currentTags" no-outer-focus>
        <template v-slot="{ tags, disabled, addTag, removeTag }">
          <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
            <li v-for="tag in tags" :key="tag" class="list-inline-item">
              <b-form-tag
                @remove="removeTag(tag)"
                :title="tag"
                :disabled="disabled"
                variant="secondary"
              >{{ tag }}</b-form-tag>
            </li>
          </ul>

          <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
            <template v-slot:button-content>
              Choose tags
            </template>
            <b-dropdown-form @submit.stop.prevent="() => {}">
              <b-form-group
                label-for="tag-search-input"
                label="Search tags"
                label-cols-md="auto"
                class="mb-0"
                label-size="sm"
                :disabled="disabled"
              >
                <b-form-input
                  v-model="search"
                  id="tag-search-input"
                  type="search"
                  size="sm"
                  autocomplete="off"
                 ></b-form-input>
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button
              v-for="option in availableOptions"
              :key="option"
              @click="onOptionClick({ option, addTag })"
            >
              {{ option }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="availableOptions.length === 0">
              There are no tags available to select
            </b-dropdown-text>
          </b-dropdown>
        </template>
      </b-form-tags>
</template>
<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { mapState, mapActions } from 'vuex'

library.add(faTimesCircle)

export default {
  props: ['recordsTags', 'labelTagInput'],

  data: function(){
    return {
      search: ''
    }
  },

  computed: {
    ...mapState(['tags']),

    currentTags: {
      get: function() {
        return this.recordsTags.filter(recTag => !recTag._destroy).map(rt => rt.tag.name)
      },

      set: function(newVal) {
        if(newVal.length > this.currentTags.length ) {
          this.addTag(newVal[newVal.length - 1]);
        } else if (newVal.length < this.currentTags.length) {
          let removingTag = this.currentTags.find(t => newVal.indexOf(t) === -1);
          this.removeTag(removingTag);
        }
      }
    },

    criteria() {
      return this.search.trim().toLowerCase()
    },

    options() {
      return this.tags.map(t => t.name)
    },

    availableOptions() {
      const criteria = this.criteria
      // Filter out already selected options
      const options = this.options.filter(opt => this.currentTags.indexOf(opt) === -1)
      if (criteria) {
        // Show only options that match criteria
        return options.filter(opt => opt.toLowerCase().indexOf(criteria) > -1);
      }
      // Show all options available
      return options
    },
  },

  methods: {
    ...mapActions(['fetchTags']),

    addTag(newTag) {
      let newTagObj = this.tags.find(t => t.name === newTag);
      this.$emit('change', [...this.recordsTags, ...[Object.assign({tag_id: newTagObj.id}, { tag: newTagObj })] ]);
    },

    removeTag(removingTag) {
      let removingRecordsTag = this.recordsTags.find(rt => rt.tag.name === removingTag);
      this.deleteRecordsTag(removingRecordsTag);
    },

    deleteRecordsTag(removingRecordsTag) {
      if(removingRecordsTag.id) {
        removingRecordsTag._destroy = true
        this.$emit('change', [...[], ...this.recordsTags])
      } else this.$emit('change', this.recordsTags.filter(recTag => recTag.tag_id !== removingRecordsTag.tag_id))
    },

    onOptionClick({ option, addTag }) {
      addTag(option)
      this.search = ''
    }
  }
}
</script>
<style>
</style>
