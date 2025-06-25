// 🔥 Next Task – Task 2: Count number of orders per status
// 🧩 Input:

// Use same orders array
const orders = [
    { id: 1, customer: 'Alice', total: 5000, status: 'delivered' },
    { id: 2, customer: 'Bob', total: 7000, status: 'pending' },
    { id: 3, customer: 'Alice', total: 3000, status: 'delivered' },
    { id: 4, customer: 'David', total: 2000, status: 'delivered' },
    { id: 5, customer: 'Bob', total: 1000, status: 'cancelled' },
    { id: 6, customer: 'Alice', total: 1500, status: 'pending' },
  ];

//   ✍️ Function:

function countOrdersByStatus(orders) {
  // your code here
  return orders.reduce((acc, order) => {
    const { status } = order
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})
}

console.log(countOrdersByStatus(orders));

// ✅ Expected Output:
// js
// Copy
// Edit
// {
//   delivered: 3,
//   pending: 2,
//   cancelled: 1
// }