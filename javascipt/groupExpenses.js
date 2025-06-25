// Problem: You’re given an array of expenses. 
// Each expense has an `amount` and a `category`.
// Return the total spent per category as an object.

// Input:
const expenses = [
    { category: 'food', amount: 1200 },
    { category: 'transport', amount: 800 },
    { category: 'food', amount: 600 },
    { category: 'entertainment', amount: 300 },
    { category: 'transport', amount: 500 }
  ];
  
  // Output:
//   {
//     food: 1800,
//     transport: 1300,
//     entertainment: 300
//   }
  
  function groupExpenses(expenses) {
    return expenses.reduce((acc, expense) => {
        const { category, amount } = expense;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});
  }
  
  console.log(groupExpenses(expenses));
  