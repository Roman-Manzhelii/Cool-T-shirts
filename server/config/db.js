const mongoose = require('mongoose')
mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})


// Mongodb Atlas
// mongoose.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.rexak40.mongodb.net/${process.env.DB_NAME}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("connected to", db.client.s.url)
})