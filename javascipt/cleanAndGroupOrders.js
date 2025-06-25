// 🔥 Awesome — welcome to Phase 2 – Day 3: Real-World Data Transformation and Cleanup.
// Now that you can build and structure data, we’ll add new skills:

// 🎯 What You'll Learn Today:
// Skill	Use Case
// ✅ Data cleaning	Handle bad/missing values like null, NaN, empty strings
// ✅ Multi-step transformation	Chaining .filter() → .map() → .reduce()
// ✅ Optional fields	Real-world data may not always be perfect
// ✅ Final report formatting	From raw DB-like input to clean API-like output

// 🧩 Task 1: Clean Orders and Group Total by Customer
// Some orders are broken, but we still need valid totals per customer.

// 💡 Input:
const rawOrders = [
  { id: 1, customer: 'Alice', total: 5000, status: 'delivered' },
  { id: 2, customer: '', total: 7000, status: 'pending' },            // ❌ no customer
  { id: 3, customer: 'Alice', total: '3000', status: 'delivered' },   // ❌ total is string
  { id: 4, customer: 'David', total: 2000, status: 'delivered' },
  { id: 5, customer: 'Bob', total: null, status: 'cancelled' },       // ❌ null total
  { id: 6, customer: 'Alice', total: 1500, status: 'pending' },
  { id: 7, customer: 'Bob', total: 1000, status: 'delivered' },
];

// 🎯 Expected Output:
// {
//   Alice: 9500,
//   David: 2000,
//   Bob: 1000
// }
// ✅ Rules:
// Skip orders with:

// No customer name

// total is null, NaN, or not a number

// If total is a string number (e.g. '3000'), convert it to number

// ✍️ Task:
function cleanAndGroupOrders(orders) {
  // your code here
  return rawOrders.filter(order => order.customer !== '' && order.total !== null)
            .reduce((acc, order) => {
                const { customer, total } = order

                acc[customer] = (acc[customer] || 0) + Number(total)

                return acc
            }, {})
  
}

console.log(cleanAndGroupOrders(rawOrders));
// 🧠 Tips:
// Use .filter() to remove bad records

// Use Number(value) to convert string totals

// Use .reduce() to build { customer: total } object

