// app.js

// Function to fetch text content
async function fetchTextContent() {
    try {
      console.log("Fetching text content...");
      const response = await fetch('/.netlify/functions/textContent');
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Received data:", data);
      updateTextColumns(data);
    } catch (error) {
      console.error('Error fetching text content:', error);
    }
  }
  
  async function fetchComments() {
    try {
      console.log("Fetching comments...");
      const response = await fetch('/.netlify/functions/comments');
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Received comments:", data);
      updateComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
// Function to update comments
function updateComments(data) {
    editors[3].setContents(data.zoe ? JSON.parse(data.zoe) : []);
    editors[4].setContents(data.catharina ? JSON.parse(data.catharina) : []);
}

// Function to submit a comment
async function submitComment(user) {
    const editorIndex = user === 'Zoe' ? 3 : 4;
    const content = editors[editorIndex].getContents();
    const timestamp = new Date().toISOString();

    try {
        const response = await fetch('/.netlify/functions/comments', {
            method: 'POST',
            body: JSON.stringify({ user, content: JSON.stringify(content), timestamp })
        });
        const data = await response.json();
        console.log('Comment submitted:', data);
        fetchComments(); // Refresh comments after submitting
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
}

// Set up periodic polling
function startPolling() {
    fetchTextContent();
    fetchComments();
    setInterval(fetchComments, 30000); // Poll for new comments every 30 seconds
}

// Start the application
document.addEventListener('DOMContentLoaded', startPolling);

// Make sure the global submitComment function is available
window.submitComment = submitComment;