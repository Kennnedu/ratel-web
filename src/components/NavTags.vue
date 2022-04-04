<template>
  <b-nav-item-dropdown href="#" no-caret>
    <template #button-content>
      Tags <b-badge variant="light">{{tagsCount}}</b-badge>
    </template>
    <b-dropdown-item @click="() => onClickTagCallback({'name': ''})">+ Add New</b-dropdown-item>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item v-for="tag in tags" :key="tag.name" @click="() => onClickTagCallback(tag)">{{tag.name}}</b-dropdown-item>

    <b-modal id="modal-edit-tag" centered :title="`${currentTag.name ? 'Edit' : 'New'} Tag`" hide-footer>
      <TagForm @close="onCloseModalCallback()" :tag="currentTag" />
    </b-modal>
  </b-nav-item-dropdown>
</template>
<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import TagForm from '../components/TagForm.vue'

  export default {
    data: function() {
      return {
        currentTag: {'name': ''},
      }
    },

    components: {TagForm},

    computed: {
      ...mapState(['tags']),
      ...mapGetters(['tagsCount']),
    },

    methods: {
      ...mapActions(['fetchTags']),

      onClickTagCallback(tag) {
        this.currentTag = tag;
        this.$bvModal.show('modal-edit-tag');
      },

      onCloseModalCallback() {
        this.$bvModal.hide('modal-edit-tag');
        this.fetchTags();
      }
    }
  }
</script>
