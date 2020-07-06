import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

Vue.use(Vuex)

function initializeFilter(){
  const savedFilter = JSON.parse(localStorage.getItem('defaultFilter'));
  if(savedFilter) return savedFilter;
  return {
    name: "",
    card: "",
    tags: "",
    from: moment().set('year', moment().get('year') - 1).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  }
}

export default new Vuex.Store({
  state: {
    isFetchingTotalSum: true,
    totalSum: 0,
    filter: initializeFilter(),
    defaultFilter: initializeFilter(),
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
        'performed_at[lt]': moment(state.filter.to).utc().format('llll')
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

    updateFilter(state, payload) {
      state.filter = Object.assign({}, state.filter, payload.changes)
    },

    updateDefaultFilter(state, payload) {
      let newDefaultFilter = Object.assign({}, state.defaultFilter, payload.changes)
      state.defaultFilter = newDefaultFilter;
      localStorage.setItem('defaultFilter', JSON.stringify(newDefaultFilter));
    },

    addFilteringName(state, payload) {
      state.filter.name = [...state.filter.name.split('&'), ...['!' + payload.name]].join('&')
    },

    changeisFetchingTotalSum(state, payload) {
      state.isFetchingTotalSum = payload.isFetching;
    }
  },

  actions: {
    fetchTotalSum(context, params) {
      return new Promise((resolve, reject) => {
        context.commit('changeisFetchingTotalSum', { isFetching: true });
        axios.get('/records/sum', { params: Object.assign({}, context.getters.filterParams, params) })
        .then(data => {
          context.commit('updateTotalSum', { totalSum: data.data.sum })
          resolve(data.data) 
        })
        .catch(error => reject(error.response))
        .then(() => context.commit('changeisFetchingTotalSum', { isFetching: false }))
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
