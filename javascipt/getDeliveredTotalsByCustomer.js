// 🧩 Task 1: Total delivered order amount per customer
// (Real-world: Analytics dashboard → “Revenue by customer from delivered orders only”)

// 💡 Input:

const orders = [
  { id: 1, customer: 'Alice', total: 5000, status: 'delivered' },
  { id: 2, customer: 'Bob', total: 7000, status: 'pending' },
  { id: 3, customer: 'Alice', total: 3000, status: 'delivered' },
  { id: 4, customer: 'David', total: 2000, status: 'delivered' },
  { id: 5, customer: 'Bob', total: 1000, status: 'cancelled' },
  { id: 6, customer: 'Alice', total: 1500, status: 'pending' },
];
// 🎯 Expected Output:

// {
//   Alice: 8000,
//   David: 2000
// }
// Only delivered orders should count toward the total. Bob should not appear at all.

// ✍️ Task:

function getDeliveredTotalsByCustomer(orders) {
    // your code here
    return orders.filter(order => order.status === 'delivered').reduce((acc, order) => {
      const { customer, total } = order
      acc[customer] = (acc[customer] || 0) + total
  
      return acc
    }, {})
  }

console.log(getDeliveredTotalsByCustomer(orders));
// 🧠 Hint:
// Use .filter() to keep only status === 'delivered'

// Then .reduce() to group by customer and sum totals

// Try it out — this is real backend/API logic and will prep you for query optimization in Laravel or Node.