// 🧩 Task 2: Recent Search History
// 🧠 Scenario:
// You’re building a recent search feature. It should:

// Only keep unique terms

// Show the most recent search first

// Limit to 5 most recent searches

// ✅ Example Usage:

const history = createSearchHistory();

history.add('laptop');
history.add('phone');
history.add('tv');
history.add('laptop'); // should move 'laptop' to the top
history.add('mouse');
history.add('keyboard'); // 'phone' should be dropped
history.add('Laptop'); // should move 'laptop' to the top


console.log(history.get());
// ['keyboard', 'mouse', 'laptop', 'tv', 'phone'] → 'phone' is dropped, but this was the 6th, so:
// → ['keyboard', 'mouse', 'laptop', 'tv', 'phone'] → ❌
// should be:
// → ['keyboard', 'mouse', 'laptop', 'tv', 'phone'] → ❌
// actually correct should be:
// → ['keyboard', 'mouse', 'laptop', 'tv', 'phone'] → ❌

// Wait... let's clarify:

// ### Final state should be:
/**
```js
['keyboard', 'mouse', 'laptop', 'tv', 'phone'] → is **wrong** because it includes 6

It should be:

['keyboard', 'mouse', 'laptop', 'tv', 'phone'] → also 6...

Oops! Let's walk through properly 👇

---

### Proper order of operations:

Searches in order:  
`['laptop'] → ['phone', 'laptop'] → ['tv', 'phone', 'laptop'] → ['laptop', 'tv', 'phone'] → ['mouse', 'laptop', 'tv', 'phone'] → ['keyboard', 'mouse', 'laptop', 'tv', 'phone']`

✅ Yes! Now we have 5, in reverse search order (most recent first)

---

### 🛠 Task: Build this class

```
 */
function createSearchHistory() {
  const MAX = 5;
  let history = [];

  return {
    add: (term) => {
      // TODO
      const newTerm = term.toLowerCase()
      const index = history.indexOf(newTerm)

      if(index !== -1)
        history.splice(index, 1)

      history.unshift(newTerm)

      if(history.length >  MAX)
        history.pop()
    },
    get: () => {
      return history;
    }
  }
}

// 💡 Requirements:
// If a term already exists, move it to the top

// Insert new terms at the start

// Only keep the last 5 items

