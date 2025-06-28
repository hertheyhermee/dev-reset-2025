// 🧠 Task 3: Friend Suggestion Engine (Graph Concept)
// 🧩 Scenario:
// You’re building a basic social network.

// Here’s the user data:

const friends = {
  azeez: ['chioma', 'zainab'],
  chioma: ['azeez', 'tunde'],
  zainab: ['azeez'],
  tunde: ['chioma'],
};


const suggestFriends = (username) => {
    const directFriends = friends[username] || []
    let suggestions = []

    directFriends.forEach(friend => {
        (friends[friend] || []).forEach(fof => {
            if(fof !== username && !directFriends.includes(fof)) {
                suggestions.push(fof)
            }
        })
    })

    return [...new Set(suggestions)]
   

}
// 🎯 Goal:
// Build a function suggestFriends(username) that returns people the user is not friends with, but who are friends of their friends.

// ✅ For Example:
// suggestFriends('azeez') should return:

// js
// Copy
// Edit
// ['tunde'] // Azeez isn’t friends with tunde, but chioma is
// suggestFriends('zainab') should return:

// js
// Copy
// Edit
// ['chioma'] // zainab → azeez → chioma
// 🧠 Hint:
// Get the user’s direct friends.

// Loop through their friends' friends.

// Filter out:

// The user themself

// People they’re already friends with
console.log(suggestFriends('zainab'))
console.log(suggestFriends('azeez'));   // ['tunde']