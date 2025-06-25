// 🧩 Task: Generate Transaction Summary Per User with Status Breakdown
// 💡 Input:

const transactions = [
  { user: 'Azeez', amount: 1200, status: 'success' },
  { user: 'Zainab', amount: 3000, status: 'success' },
  { user: 'Azeez', amount: null, status: 'failed' },
  { user: 'Chioma', amount: 1000, status: 'success' },
  { user: '', amount: 500, status: 'success' },
  { user: 'Zainab', amount: 2000, status: 'failed' },
  { user: 'Azeez', amount: '1500', status: 'success' },
  { user: 'Chioma', amount: 'oops', status: 'success' },
];
// 🎯 Expected Output:

// {
//   Azeez: {
//     success: 2700
//   },
//   Zainab: {
//     success: 3000,
//     failed: 2000
//   },
//   Chioma: {
//     success: 1000
//   }
// }
// ✅ Rules:
// Ignore transactions where:

// user is an empty string

// amount is not a valid number (e.g. 'oops', null)

// Convert amounts to numbers if they are strings

// Group by user ➜ then by status ➜ then sum amount

// ✍️ Starter Code:
function summarizeTransactions(transactions) {
  // your code here
  return transactions.filter(transaction => transaction.user !== '' && Number.isFinite(Number(transaction.amount)))
                .reduce((acc, transaction) => {
                    const { user, amount, status } = transaction
                    if(!acc[user])
                        acc[user] = {}

                    if(!acc[user][status])
                        acc[user][status] = 0

                    acc[user][status] += Number(amount)

                    return acc 

                }, {})
}

console.log(summarizeTransactions(transactions));

// 🧠 Tips:
// Start with .filter() to remove bad records

// Use .reduce() to group by user and status

// Initialize nested objects safely

// Use Number() and Number.isFinite() for conversion + checks

