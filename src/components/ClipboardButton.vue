<template>
  <div>
    <b-button ref="copy-button" v-clipboard="copyText" v-clipboard:success="copiedText" size="sm">
      <font-awesome-icon icon="clipboard"/>
    </b-button>
    <b-tooltip :show.sync="showTooltip" :target="() => $refs['copy-button']" triggers="manual">
      Copied!
    </b-tooltip>
  </div>
</template>
<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faClipboard } from '@fortawesome/free-solid-svg-icons'

  library.add(faClipboard)

export default {
  props: ['copyText'],

  data: function() {
    return {
      showTooltip: false
    }
  },

  methods: {
    copiedText() {
      this.toggleTooltip();
      setTimeout(this.toggleTooltip, 500)
    },

    toggleTooltip() {
      return this.showTooltip = !this.showTooltip;
    }
  }
}
</script>