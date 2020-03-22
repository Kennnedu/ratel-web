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
    totalSum: 0,
    filter: initializeFilter(),
    defaultFilter: initializeFilter(),
    cards: []
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
    }
  },

  mutations: {
    updateCards(state, payload) {
      state.cards = payload.cards
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
    }
  },

  actions: {
    fetchTotalSum(context) {
      return new Promise((resolve, reject) => {
        axios.get('/records/sum', { params: context.getters.filterParams })
        .then(data => {
          context.commit('updateTotalSum', { totalSum: data.data.sum })
          resolve(data.data) 
        })
        .catch(error => reject(error.response));
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
    }
  }
})
