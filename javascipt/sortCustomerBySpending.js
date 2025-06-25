// 🔥 Next Task – Task 3: Sort customers by total spending (DESC)
// 🧠 Goal:
// Take this result from getTotalPerCustomer():

const orders = [
    { id: 1, customer: 'Alice', total: 5000, status: 'delivered' },
    { id: 2, customer: 'Bob', total: 7000, status: 'pending' },
    { id: 3, customer: 'Alice', total: 3000, status: 'delivered' },
    { id: 4, customer: 'David', total: 2000, status: 'delivered' },
    { id: 5, customer: 'Bob', total: 1000, status: 'cancelled' },
    { id: 6, customer: 'Alice', total: 1500, status: 'pending' },
  ];
  // ✅ Task 1: Group total order amounts per customer
  
  function getTotalPerCustomer(orders) {
    // your code here
    return orders.reduce((acc, order) => {
      const { customer, total } = order;
      acc[customer] = (acc[customer] || 0) + total;
      return acc
    }, {})
  }

// Turn it into a sorted array of entries by total amount spent, highest first.

// ✅ Expected Output:
// [
//   ['Alice', 9500],
//   ['Bob', 8000],
//   ['David', 2000]
// ]
// 🧩 Task:
// Complete this function:

function sortCustomersBySpending(totals) {
  // your code here
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

const totals = getTotalPerCustomer(orders); // from earlier
console.log(sortCustomersBySpending(totals));