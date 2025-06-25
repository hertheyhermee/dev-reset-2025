// Learn to perform data analysis operations like GROUP BY, COUNT, SUM, and ORDER BY using JavaScript methods (reduce, sort, etc.).

// These patterns are exactly how backend reports, analytics, dashboards, and even API summaries work.

// 🧩 Dataset:
// We'll use this sample orders array:

const orders = [
  { id: 1, customer: 'Alice', total: 5000, status: 'delivered' },
  { id: 2, customer: 'Bob', total: 7000, status: 'pending' },
  { id: 3, customer: 'Alice', total: 3000, status: 'delivered' },
  { id: 4, customer: 'David', total: 2000, status: 'delivered' },
  { id: 5, customer: 'Bob', total: 1000, status: 'cancelled' },
  { id: 6, customer: 'Alice', total: 1500, status: 'pending' },
];
// ✅ Task 1: Group total order amounts per customer
// (Like SQL: SELECT customer, SUM(total) GROUP BY customer)

// ✍️ Your Function:
// js
// Copy
// Edit
function getTotalPerCustomer(orders) {
  // your code here
  return orders.reduce((acc, order) => {
    const { customer, total } = order;
    acc[customer] = (acc[customer] || 0) + total;
    return acc
  }, {})
}

console.log(getTotalPerCustomer(orders));

// ✅ Expected Output:

// {
//   Alice: 9500,  // 5000 + 3000 + 1500
//   Bob: 8000,    // 7000 + 1000
//   David: 2000
// }
