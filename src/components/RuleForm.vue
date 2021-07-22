<template>
  <b-form>
    <b-form-group label="Name" description="Name of the rule should be straightforward. Example: 'LODE is medicine', 'medicine assign LODE', etc.">
      <b-input :value="editableRule.name" @input="val => updateEditableRule({changes: {name: val}})"></b-input>
    </b-form-group>
    <b-form-group label="Type" description="The type depends on action that will be executed.">
      <b-form-select :options="['TagRule', 'CardRule']" :value="editableRule.type" @input="val => updateEditableRule({changes: {type: val}})"></b-form-select>
    </b-form-group>
    <b-form-group label="Tag" v-if="editableRule.type === 'TagRule'" description="The tag that will be assigned to matched record.">
      <b-form-select :options="tagOptions" :value="editableRule.tag_id" @input="val => updateEditableRule({changes: {tag_id: val}})"></b-form-select>
    </b-form-group>
    <b-form-group label="Card" v-if="editableRule.type === 'CardRule'" description="The card that will be assigned to matched record.">
      <b-form-select :options="cardOptions" :value="editableRule.card_id" @input="val => updateEditableRule({changes: {card_id: val}})"></b-form-select>
    </b-form-group>
    <b-form-group label="Condition">
      <v-jsoneditor :options="{mode: 'code'}" :value="editableRule.condition" @input="val => updateEditableRule({changes: {condition: val}})" />
      <template v-slot:description>
        The condition comparing with record data.
        <a href="https://jsonlogic.com/operations.html" target="_blank">Here</a> you can find how to build condition correctly.
        Also you should consider record data schema it's looks like this:
        <code>
          {
            "name": "shopping",
            "amount": -3.4,
            "card": { "name": "salary"}
          }
        </code> <b-link v-b-toggle.collapse-1>Samples</b-link>
        <b-collapse id="collapse-1" class="mt-2">
          <b-card-group deck>
            <b-card no-body v-for="sample in samples()" :key="sample.name">
              <b-card-header class="d-flex justify-content-between align-items-center">
                <span>
                   {{sample.name}}
                </span>
                <clipboard-button :copyText="JSON.stringify(sample.sample, null, 2)" />
              </b-card-header>
              <b-card-body>
                <pre>{{JSON.stringify(sample.sample, null, 2)}}</pre>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-collapse>
      </template>
    </b-form-group>
    <b-form-group>
      <b-button type="button" @click="$router.go(-1)" variant="secondary" class="float-left">Back</b-button>
      <b-button type="submit" @click.prevent="$emit('submit')" variant="primary" class="float-right">Save</b-button>
    </b-form-group>
  </b-form>
</template>
<script>
import VJsoneditor from 'v-jsoneditor/src/index'
import { mapState, mapMutations } from 'vuex'
import ClipboardButton from './ClipboardButton.vue'
import { samples } from '../utils/ruleSamples'

export default {
  components: {VJsoneditor, ClipboardButton},

  computed: {
    ...mapState(['editableRule', 'cards', 'tags']),

    tagOptions() {
      return this.tags.map(tag => {
        return {
          value: tag.id,
          text: tag.name,
        }
      })
    },

    cardOptions() {
      return this.cards.map(card => {
         return {
          value: card.id,
          text: card.name,
        }
      });
    }
  },

  methods: {
    ...mapMutations(['updateEditableRule']),

    samples() {
      return samples;
    }
  }  
}
</script>