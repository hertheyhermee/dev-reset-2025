// 🧩 Task 1: Remove Duplicate Tags from Blog Posts
// 🧠 Scenario:
// You're building a blog, and authors can tag their posts with keywords. Some tags are repeated.

const tags = ['javascript', 'web', 'html', 'javascript', 'css', 'web', 'api'];
// 🎯 Goal:
// Return a list of unique tags, preserving insertion order.

// ['javascript', 'web', 'html', 'css', 'api']

const getUniqueTags = (tags) => {
    return Array.from(new Set(tags))
}

const getUniqueTagsTwo = (tags) => {
    const uniqueTags = []
    tags.forEach(tag => {
        if (!uniqueTags.includes(tag))
            uniqueTags.push(tag)
    });
    return uniqueTags
}

const getUniqueTagsThree = (tags) => {
    return tags.reduce((acc, tag) => {
      if (!acc.includes(tag)) acc.push(tag);
      return acc;
    }, []);
  };


console.log(getUniqueTags(tags))
console.log(getUniqueTagsTwo(tags))
console.log(getUniqueTagsThree(tags));

// ✅ Instructions:
// Write a function getUniqueTags(tags)

// Use a Set() to remove duplicates

// Return the result as an array

// 🧪 Bonus:
// Compare how you’d do it with:

// Array.includes() and .forEach()

// Set()

// .reduce()

