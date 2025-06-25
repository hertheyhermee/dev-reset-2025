// Problem: You are given an array of transactions with amounts. 
// Filter out only the positive transactions and return their total sum.

// Input: [1200, -700, 300, -50, 400]
// Output: 1900

function totalPositive(transactions) {
    let positiveTransactions = transactions.filter(transaction => transaction > 0);
    let sum = 0;
    positiveTransactions.forEach(positiveTransaction => {
        sum += positiveTransaction;
    });
    return sum
  }

//   function totalPositive(transactions) {
//     return transactions
//       .filter(t => t > 0)
//       .reduce((sum, t) => sum + t, 0);
//   }

//   const totalPositive = transactions =>
//     transactions.reduce((sum, t) => t > 0 ? sum + t : sum, 0);
  
  
  console.log(totalPositive([1200, -700, 300, -50, 400])); // 1900
  