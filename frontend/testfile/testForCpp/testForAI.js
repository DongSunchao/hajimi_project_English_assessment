// Frontend test code
fetch('https://4hi8leun21.execute-api.ap-southeast-2.amazonaws.com/ai-tutor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: "The UUID that was successfully persisted to DynamoDB earlier" // Must pass an ID with actual existing history records
  })
})
.then(res => res.json())
.then(data => console.log("AI tutor reply: ", data));