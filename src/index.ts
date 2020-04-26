import express from 'express'
import bodyParser from 'body-parser'
import router from './router'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(router)

app.listen(7001, () => {
  console.log('listening on the port 7001')
})