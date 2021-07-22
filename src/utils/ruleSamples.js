 export const samples = [
  {
    name: "Record name contain 'Some string'",
    sample: {
      "in": [
        "Some string",
        { 
          "var": "name"
        }
      ]
    }
  },
  {
    name: "Card name contain 'Some string'",
    sample: {
      "in": [
        "Some string",
        {
          "var": "card.name"
        }
      ]
    }
  },
  {
    name: "0 more than Amount",
    sample: {
      ">": [
        0,
        {
          "var": "amount"
        }
      ]
    }
  }
]