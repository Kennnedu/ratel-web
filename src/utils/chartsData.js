export const prepareExpencesIncomeDatasets = (incomeData, expencesData) => {
  const renameKey = (object, key, newKey) => {
    const clonedObj = Object.assign({}, object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  };

  expencesData = expencesData.map(el => {
    let a;
    a = renameKey(el, 'performed_date', 'x')
    a['sum_amount'] *= -1
    a = renameKey(a, 'sum_amount', 'y')
    return a
  })

  incomeData = incomeData.map(el => {
    let a;
    a = renameKey(el, 'performed_date', 'x')
    a = renameKey(a, 'sum_amount', 'y')
    return a
  })
  
  return [incomeData, expencesData]
}

export const prepareTagsData = (tags, totalSum) => {
  let labels = tags.map(el => el['name'])
  let dataset = tags.map(el => el['records_sum'])
  let colors = tags.map(() => dynamicColors());

  const sum = dataset.reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0)

  if(sum !== totalSum) {
    labels.push('Undefined')
    dataset.push(Number((totalSum - sum).toFixed(2)))
    colors.push('rgb(169, 169, 169)')
  }

  return {
    labels: labels,
    dataset: dataset,
    colors: colors
  }
}

export const prepareCardsData = (cards, totalSum) => {
  let labels = cards.map(el => el['name'])
  let dataset = cards.map(el => el['records_sum'])
  let colors = cards.map(() => dynamicColors());

  const sum = dataset.reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0)

  if(sum !== totalSum) {
    labels.push('Undefined')
    dataset.push(Number((totalSum - sum).toFixed(2)))
    colors.push('rgb(169, 169, 169)')
  }

  return {
    labels: labels,
    dataset: dataset,
    colors: colors
  }
}

const dynamicColors = () => {
  const colors = ["rgb(54, 162, 235)", "rgb(75, 192, 192)", "rgb(255, 159, 64)", "rgb(153, 102, 255)", "rgb(255, 99, 132)", "rgb(255, 205, 86)"]
  return colors[Math.floor( Math.random() * colors.length)]
}