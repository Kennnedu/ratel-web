<template>
  <b-form-group label="Tags" label-size="sm">
    <multiselect
      :value="onlyTags"
      :options="tags.map(t => t.name)"
      :multiple="true"
      :taggable="true"
      placeholder="are included"
      @input="updateOnlyTags"/>

    <multiselect
      class="mt-2"
      :value="exceptTags"
      :options="tags.map(t => t.name)"
      :multiple="true"
      :taggable="true"
      placeholder="are excluded"
      @input="updateExceptTags"/>
  </b-form-group>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Multiselect from 'vue-multiselect'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faMinus)

export default {
  data: function(){
    return {
      onlyTags: [],
      exceptTags: [],
    }
  },

  components: { Multiselect },

  created() {
    this.assingTagsStr(this.filter.tags);
  },

  computed: {
    ...mapState(['filter', 'tags']),

    tagsStr() {
      return [...this.onlyTags, ...this.exceptTags.map(t => `!${t}`)].join('&')
    }
  },

  methods: {
    ...mapMutations(['updateFilter']),

    updateOnlyTags(newOnlyTags) {
      this.onlyTags = newOnlyTags;
      this.updateFilter({ changes: { tags: this.tagsStr } });
    },

    updateExceptTags(newExceptTags) {
      this.exceptTags = newExceptTags;
      this.updateFilter({ changes: { tags: this.tagsStr } });
    },

    assingTagsStr(tagsStr) {
      const tags = tagsStr.split('&');
      this.onlyTags = tags.filter(t => t[0] !== '!' && t.length > 0);
      this.exceptTags = tags.filter(t => t[0] === '!' && t.length > 1).map(t => t.slice(1));
    }
  },

  watch: {
    filter: {
      handler: function(newFilter){
        if(newFilter.tags !== this.tagsStr) {
          this.assingTagsStr(newFilter.tags);
        }
      },
      deep: true
    }
  },
}
</script>
<style>
</style>
