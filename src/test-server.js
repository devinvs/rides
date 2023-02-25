const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());
const port = 5000

app.get('/events/:eventId', (req, res) => {
    console.log("Get events for ", req.params.eventId);

    res.json({
        name: "The Best Event",
        cars: [{
            capacity: 3,
            riders: ["Devin", "Mathew", "Justin"],
            driver: "Nicholas"
        }, {
            capacity: 1,
            riders: ["Bob"],
            driver: "Joe"
        }],
        unassigned: ["Frank", "John"]
    })
})

app.post('/events', (_, res) => {
    console.log("Receive post for /events");

    res.json({
        name: "The Best Event"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
