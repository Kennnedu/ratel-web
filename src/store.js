import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'
import { getDefaultFilter } from './utils/filter'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isFetchingTotalBalance: true,
    totalBalance: 0,
    totalSum: 0,
    filter: getDefaultFilter(),
    cards: [],
    tags: []
  },

  getters: {
    filterParams: state => {
      return {
        'name': state.filter.name,
        'card': state.filter.card,
        'tags': state.filter.tags,
        'performed_at[gt]': moment(state.filter.from).utc().format('llll'),
        'performed_at[lt]': moment(state.filter.to).utc().format('llll'),
        'amount[lt]': state.filter.type === 'Expences' ? 0 : null,
        'amount[gt]': state.filter.type === 'Replenish' ? 0 : null
      }
    },

    filterRecordParams: state => {
      return {
        'record[name]': state.filter.name,
        'record[card]': state.filter.card,
        'record[tags]': state.filter.tags,
        'record[performed_at][gt]': moment(state.filter.from).utc().format('llll'),
        'record[performed_at][lt]': moment(state.filter.to).utc().format('llll'),
        'record[amount][lt]': state.filter.type === 'Expences' ? 0 : null,
        'record[amount][gt]': state.filter.type === 'Replenish' ? 0 : null
      }
    },

    cardsCount: state => state.cards.length,
    tagsCount: state => state.tags.length
  },

  mutations: {
    updateCards(state, payload) {
      state.cards = payload.cards;
    },

    updateTags(state, payload) {
      state.tags = payload.tags;
    },

    updateTotalSum(state, payload) {
      state.totalSum = payload.totalSum
    },

    updateTotalBalance(state, payload) {
      state.totalBalance = payload.totalBalance
    },
 
    updateFilter(state, payload) {
      state.filter = Object.assign({}, state.filter, payload.changes)
    },

    addFilteringName(state, payload) {
      state.filter.name = [...state.filter.name.split('&'), ...['!' + payload.name]].join('&')
    },

    changeIsFetchingTotalBalance(state, payload) {
      state.isFetchingTotalBalance = payload.isFetching;
    }
  },

  actions: {
    fetchTotalSum(context, params) {
      return new Promise((resolve, reject) => {
        axios.get('/records/sum', { params: Object.assign({}, context.getters.filterParams, params) })
        .then(data => {
          context.commit('updateTotalSum', { totalSum: data.data.sum })
          resolve(data.data) 
        })
        .catch(error => reject(error.response))
      })
    },

    fetchTotalBalance(context) {
      context.commit('changeIsFetchingTotalBalance', { isFetching: true })

      return new Promise((resolve, reject) => {
        axios.get('/records/sum')
        .then(data => {
          context.commit('updateTotalBalance', { totalBalance: data.data.sum })
          resolve(data.data) 
        })
        .catch(error => reject(error.response))
        .then(() =>  context.commit('changeIsFetchingTotalBalance', { isFetching: false }))
      })
    },

    fetchCards(context){
      return new Promise((resolve, reject) => {
        axios.get('/cards').then(data => {
          context.commit('updateCards', data.data);
          resolve();
        })
        .catch(error => reject(error.response))
      })
    },

    fetchTags(context) {
      return new Promise((resolve, reject) => {
        axios.get('/tags').then(data => {
          context.commit('updateTags', data.data);
          resolve();
        })
        .catch(error => reject(error.response))
      })
    }
  }
})
