// Server-side global variables
require(`dotenv`).config({path:`./config/.env`})
const path = require("path")

// Database
require(`./config/db`)

// Express
const express = require(`express`)
const app = express()
const multer = require('multer');

app.use(require(`body-parser`).json())
app.use(require(`cors`)({credentials: true, origin: process.env.LOCAL_HOST}))

// Routers
app.use(require(`./routes/tshirts`))
app.use(require(`./routes/users`))


const appPath = path.join(__dirname,"..","client/build")
app.use(express.static(appPath))
app.get("*",function(req,res)
{
    res.sendFile(path.resolve(appPath, "index.html"))
})

// Port
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Connected to port ` + process.env.SERVER_PORT)
})

// Error 404
app.use((req, res, next) => {next(createError(404))})

app.use(function (err, req, res, next)
{

    if (!err.statusCode)
    {
        err.statusCode = 500
    }

    let errorMessage = err.message

    if (err instanceof multer.MulterError) {
        err.statusCode = 400; // Встановлюємо статус код для помилок Multer
        if (err.message === 'Too many files') {
             errorMessage = `Too many files. Maximum allowed: ${process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED}`
        }
    }
    if (err instanceof ReferenceError)
    {
        err.statusCode = 400
        errorMessage = "All fields are required"
    }

    res.status(err.statusCode).json({ errorMessage: errorMessage})
})


