// 🧩 Project: Transaction Summary API
// You’ll build a function that simulates an endpoint like:

// GET /api/transactions/summary
// 🎯 Input: Full List of Transactions

const transactions = [
  { id: 1, user: "Azeez", amount: 1200, status: "success", channel: "mobile" },
  { id: 2, user: "Zainab", amount: 3000, status: "success", channel: "web" },
  {
    id: 3,
    user: "Azeez",
    amount: "1500",
    status: "success",
    channel: "mobile",
  },
  { id: 4, user: "Chioma", amount: 1000, status: "success", channel: "pos" },
  { id: 5, user: "Zainab", amount: 2000, status: "failed", channel: "web" },
  { id: 6, user: "Chioma", amount: "oops", status: "success", channel: "pos" },
  { id: 7, user: "", amount: 500, status: "success", channel: "web" },
  { id: 8, user: "Azeez", amount: null, status: "failed", channel: "mobile" },
];
// ✅ Your Task:
// Write a function getTransactionReport(transactions) that returns the following structured output:

const getTransactionReport = (transactions) => {
  const reportData = transactions
    .filter(
      (transaction) =>
        transaction.user !== "" && Number.isFinite(Number(transaction.amount))
    )
    .reduce(
      (acc, transaction) => {
        const { user, status, amount, channel } = transaction;
        const amt = Number(amount);

        if (status === "failed") acc.failedCount += 1;

        if (status === "success") acc.totalRevenue += amt;

        if(!acc.perUserSummary[user])
            acc.perUserSummary[user] = {}

        if(!acc.perUserSummary[user][status])
            acc.perUserSummary[user][status] = 0

        acc.perUserSummary[user][status] += amt

        if (status === "success") {
          if (!acc.perChannelRevenue[channel])
            acc.perChannelRevenue[channel] = 0;
          acc.perChannelRevenue[channel] += amt
        }

        return acc;
      },
      {
        totalRevenue: 0,
        failedCount: 0,
        perUserSummary: {},
        perChannelRevenue: {},
      }
    );

  return {
    totalRevenue: reportData.totalRevenue,
    failedCount: reportData.failedCount,
    perUserSummary: reportData.perUserSummary,
    perChannelRevenue: reportData.perChannelRevenue,
  };
};

// 🧾 Expected Output:
// {
//   totalRevenue: 6700,  // total of all successful transactions
//   failedCount: 1,      // how many failed transactions passed cleanup
//   perUserSummary: {
//     Azeez: {
//       success: 2700
//     },
//     Zainab: {
//       success: 3000,
//       failed: 2000
//     },
//     Chioma: {
//       success: 1000
//     }
//   },
//   perChannelRevenue: {
//     mobile: 2700,
//     web: 3000,
//     pos: 1000
//   }
// }
// 📌 Rules:
// Clean bad data:

// Ignore if user is empty

// Ignore if amount is invalid (NaN, null, 'oops')

// Use only valid records (i.e., pass them through .filter() first)

// Use .reduce() to:

// Count failed transactions

// Track total revenue (status === 'success')

// Track per-user totals by status

// Track per-channel revenue (only success)

// 🧠 Tips:
// Start by filtering the list for valid records

// Then use .reduce() to build the entire report object

// Nest your logic: if (status === 'success') { ... }, etc.

// Convert amounts safely: Number(amount)

console.log(getTransactionReport(transactions));
