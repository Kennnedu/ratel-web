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
  if(tags.length === 0) return {
    labels: ['Undefined'],
    dataset: [totalSum],
    colors: [grayColor]
  }
  
  tags = tags.map(el => Object.assign({}, el, { records_sum: Math.abs(Number(el['records_sum'])) }));

  const absSum = tags.map(el => el['records_sum']).reduce((calc, val) => Number((calc + val).toFixed(2)), 0)

  tags.sort((a,b) => a['records_sum'] < b['records_sum'] ? 1 : -1);

  let newTags = [];

  for (var i = 0, restSum = absSum; i < tags.length; i++) {
    let newRestSum = Number((restSum - tags[i]['records_sum']).toFixed(2))

    if(Number((newRestSum * 100 / absSum).toFixed(2)) > 0.15) {
      let newObj = Object.assign({}, tags[i]);
      if(!newObj['color']) newObj = Object.assign(newObj, { color: tagColorList[i] })
      newTags.push(newObj)
      restSum = newRestSum
    } else {
      newTags.push({
        records_sum: restSum,
        name: 'Other',
        color: grayColor
      })
      break;
    }
  }

  return {
    labels: newTags.map(el => el['name']),
    dataLabels: newTags.map(el => Number((el['records_sum'] * 100 / absSum).toFixed(2))),
    dataset: newTags.map(el => el['records_sum']),
    colors: newTags.map(el => el['color'])
  }
}

export const prepareCardsData = (cards, totalSum) => {
  const sum = cards.map(el => el['records_sum']).reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0)

  if(sum != totalSum) {
    cards.unshift({
      name: 'Undefined',
      records_sum: Number((totalSum - sum).toFixed(2)),
      color: grayColor
    })
  }

  cards = cards.map(el => Object.assign({}, el, { records_sum: Number(el['records_sum']) }))

  cards.sort((a,b) => a['records_sum'] < b['records_sum'] ? 1 : -1)
  
  cards.forEach((el, i, arr) => {
    if(!el['color']) arr[i]['color'] = cardColorList[cardColorList.length - 1 - i] 
  });

  return {
    labels: cards.map(el => el['name']),
    dataLabels: cards.map(el => Number((el['records_sum'] * 100 / totalSum).toFixed(2))),
    dataset: cards.map(el => el['records_sum']),
    colors: cards.map(el => el['color'])
  }
}

const grayColor = "#a9a9a9";

const tagColorList = [
  "#8dd3c7",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#bc80bd",
  "#ccebc5",
  "#ffed6f",
  "#e41a1c",
  "#377eb8",
  "#4daf4a",
  "#984ea3",
  "#ff7f00",
  "#ffff33",
  "#a65628",
  "#f781bf"
]

const cardColorList = [
  "#ccece6",
  "#99d8c9",
  "#66c2a4",
  "#41ae76",
  "#238b45",
  "#006d2c",
  "#00441b"
]