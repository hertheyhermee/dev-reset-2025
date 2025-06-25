// 🧩 Challenge: Remove a User by ID
// You’re given:

// An array of users

// A function that receives an id

// You must return a new array with the user removed, without mutating the original array.

// 🔧 Input:
const users = [
  { id: 1, name: 'Jane' },
  { id: 2, name: 'Ali' },
  { id: 3, name: 'Tunde' },
];

// ✍️ Task:

function deleteUser(users, id) {
  // your code here
  return users.filter(user => user.id !== id)
}

console.log(deleteUser(users, 2));

// Expected output:

// [
//   { id: 1, name: 'Jane' },
//   { id: 3, name: 'Tunde' }
// ]
