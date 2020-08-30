<template>
  <b-dropdown id="dropdown-buttons" text="Sort By" size="sm" right :block="block">
    <b-dropdown-item-button v-for="option in options" 
      :key="JSON.stringify(option)"
      :active="JSON.stringify(option) === JSON.stringify(selectedOption)"
      @click="$emit('selectOption', option)">
      <font-awesome-icon :icon="sortOptionIcon(option)" class="mr-2" />
      {{option['order[field]'].charAt(0).toUpperCase() + option['order[field]'].slice(1)}}
    </b-dropdown-item-button>
  </b-dropdown>
</template>
<script>
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faSortAmountUpAlt, faSortAmountUp, faSortAlphaUpAlt, faSortAlphaUp, faSortNumericUpAlt,
    faSortNumericUp } from '@fortawesome/free-solid-svg-icons'

  library.add(faSortAmountUpAlt, faSortAmountUp, faSortAlphaUpAlt, faSortAlphaUp, faSortNumericUpAlt,
    faSortNumericUp)

  export default {
    props: ['options', 'selectedOption', 'block'],

    methods: {
      sortOptionIcon(opt){
        const field = opt['order[field]'], direction = opt['order[type]'];
        let iconName;

        if (['amount', 'records_sum'].includes(field)) iconName = 'sort-numeric-up'
        else if (field === "name") iconName = 'sort-alpha-up'
        else iconName = 'sort-amount-up'

        if (direction === 'desc') {
          iconName = iconName + '-alt'
        }
        return iconName
      }
    }
  }
</script>
<style>
</style>
