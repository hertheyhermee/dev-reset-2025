// 🔧 Problem: Updating a User's Email
// You're given:

// An array of users

// A function that receives an id and a newEmail

// You need to return a new version of the array where only the user with the matching id has their email updated.

// 🧩 Input:
const users = [
  { id: 1, name: 'Jane', email: 'jane@example.com' },
  { id: 2, name: 'Ali', email: 'ali@example.com' },
  { id: 3, name: 'Tunde', email: 'tunde@example.com' },
];

// 🚀 Task:
// Complete this function:

function updateEmail(users, id, newEmail) {
  // your code here
  return users.map((user) => user.id === id ? { ...user, email: newEmail } : user )
}

console.log(updateEmail(users, 2, 'ali@newdomain.com'));