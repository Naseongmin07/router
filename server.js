const express = require('express');
const app = express()
const main = require('./routers/index')
const board = require('./routers/board')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')



app.set('view engine','html')
app.use(express.static('static'))
app.use(bodyParser.urlencoded({
    extended: false
}))

nunjucks.configure('views',({
    express:app
}))

app.use('/',main);
app.use('/board',board)


app.listen(3000,()=>{
    console.log('server start port 3000')
})

