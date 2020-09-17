
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { nanoid } = require('nanoid')
// const yup = require('yup')
// const monk = require('monk')

const app = express();
app.use(helmet());
app.use(morgan('tiny'))
app.use(cors());
app.use(express.json());
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.json({
        message: 'tes.te'
    })
})

app.get('/:id', (req, res) => {
    //TODO: redirect
})

app.post('/url', (req, res) => {
    //TODO: create
})

app.get('/url/:id', (req, res) => {
    //TODO: return info on the URL
})

const port = process.env.PORT || 1337

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})