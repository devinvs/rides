const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());
const port = 5000

app.get('/events/:eventId', (req, res) => {
    console.log("Get events for ", req.params.eventId);

    res.json({
      name: "The Best Event",
      cars: [
        {
            capacity: 4,
            riders: ["Devin", "Mathew", "Justin"],
            driver: "Nicholas"
        },
        {
            capacity: 3,
            riders: ["Bob"],
            driver: "Joe"
        },
        {
            capacity: 14,
            riders: ["David"],
            driver: "Frankie"
        },
        {
            capacity: 6,
            riders: ["Taylor"],
            driver: "Justin"
        },
      ],
      unassigned: ["Frank", "John"],
    });
})

app.get('/events/:eventId/persons', (req, res) => {
    console.log("Receive post for login")
    // let name = req.query.;
    let riders =  ["Devin", "Mathew", "Justin"];

    res.json({
        riders: riders,
        driver: "Nicholas",
    });
})

app.post('/events', (_, res) => {
    console.log("Receive post for /events");

    res.json({
        id: "8489293894874"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
