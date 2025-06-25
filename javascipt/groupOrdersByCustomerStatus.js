// 🧠 Challenge: Group Orders Per Customer Per Status
// You're building an analytics view that shows how many orders each customer made per status.

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
//   Alice: { delivered: 2, pending: 1 },
//   Bob: { pending: 1, cancelled: 1 },
//   David: { delivered: 1 }
// }
// 🧩 Your Task:

function groupOrdersByCustomerStatus(orders) {
  return orders.reduce((acc, order) => {
    const { customer, status } = order;

    // Step 1: If this customer doesn't exist in acc, initialize as empty object
    if (!acc[customer]) {
      acc[customer] = {};
    }

    // Step 2: If this status doesn't exist for this customer, initialize as 0
    if (!acc[customer][status]) {
      acc[customer][status] = 0;
    }

    // Step 3: Increment the count for this status for this customer
    acc[customer][status] += 1;

    // Step 4: Return the accumulator for the next iteration
    return acc;
  }, {});
}

console.log(groupOrdersByCustomerStatus(orders));
// 🧠 Tips:
// Use .reduce()

// Create a nested object: acc[customer][status] = count

// Initialize inner objects if not present

