<template>
  <div class="mt-2">
    <template v-for="name in recordNames">
      <b-badge :key="name" href="#" class="mr-1" :variant="badgeVariant(name)"
        @click="() => updateFilter({changes: { name: recordNames.filter(n => n !== name).join('&') }})">
        <font-awesome-icon icon="receipt" class="mr-1" />
        {{badgeText(name)}}
      </b-badge>
    </template>
    <template v-for="name in sourceNames">
      <b-badge :key="name" href="#" class="mr-1" :variant="badgeVariant(name)"
        @click="() => updateFilter({changes: { card: sourceNames.filter(n => n !== name).join('&') }})">
        <font-awesome-icon icon="credit-card" class="mr-1" />
        {{badgeText(name)}}
      </b-badge>
    </template>
    <template v-for="name in tagNames">
      <b-badge :key="name" href="#" class="mr-1" :variant="badgeVariant(name)"
        @click="() => updateFilter({changes: { tags: tagNames.filter(n => n !== name).join('&') }})">
        <font-awesome-icon icon="tags" class="mr-1" />
        {{badgeText(name)}}
      </b-badge>
    </template>
    <b-badge href="#" class="mr-1" variant="secondary" v-if="filter.from"
      @click="() => updateFilter({changes: { from: '' }})">
      <font-awesome-icon icon="calendar-alt" /> <span class="mr-1">from:</span>
      {{filter.from}}
    </b-badge>
    <b-badge href="#" class="mr-1" variant="secondary" v-if="filter.to"
      @click="() => updateFilter({changes: { to: '' }})">
      <font-awesome-icon icon="calendar-alt" /> <span class="mr-1">to:</span>
      {{filter.to}}
    </b-badge>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faReceipt, faCreditCard, faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faReceipt, faCreditCard, faTags, faCalendarAlt)

export default {
  computed: {
    ...mapState(['filter']),

    recordNames(){
      return this.filter.name.split('&').filter(name => name);
    },

    sourceNames() {
      return this.filter.card.split('&').filter(name => name);
    },

    tagNames() {
      return this.filter.tags.split('&').filter(name => name);
    }
  },

  methods: {
    ...mapMutations(['updateFilter']),

    badgeVariant(name) {
      return name[0] === '!' ? 'warning': 'secondary'
    },

    badgeText(name){
      return name[0] === '!' ? name.substr(1) : name 
    }
  }
}
</script>
<style>
</style>