import moment from 'moment'

export const getDefaultFilter = () => {
  const defaultFilter= JSON.parse("{\"name\":\"\",\"card\":\"\",\"tags\":\"\"}")
  const filter = JSON.parse(localStorage.getItem('defaultFilter')) || defaultFilter;

  return { ...filter, ...performedHandlerObject()[getDefaultPerformedHandler()] }
}

export const getDefaultPerformedHandler = () => {
  const savedPerfomedHandler = localStorage.getItem('performedHandler');

  return getPerformedHandlerOptions().includes(savedPerfomedHandler) ? savedPerfomedHandler : 'Last month'
}

export const getPerformedHandlerOptions = () => {
  return [...Object.keys(performedHandlerObject()), ...['custom']]
}

export const performedHandlerObject = () => ({
  'Today': {
    from: moment().set('day', moment().get('day') - 1).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  },
  'Last week': {
    from: moment().set('week', moment().get('week') - 1).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  },
  'Last decade': {
    from: moment().set('day', moment().get('day') - 10).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  },
  'Last month': {
    from: moment().set('month', moment().get('month') - 1).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  },
  'Last quarter': {
    from: moment().set('month', moment().get('month') - 3).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  },
  'Last year': {
    from: moment().set('year', moment().get('year') - 1).format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  }
})

