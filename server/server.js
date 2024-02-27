// Express
const express = require(`express`)
const app = express()
const multer = require('multer')
const createError = require('http-errors');


app.use(express.json());
app.use(express.urlencoded({extended: true}))

let PORT
if (process.env.NODE_ENV === "production") // gcloud production mode
{
    require(`./config/db`)
    PORT = process.env.PORT    // Port is automatically set by gcloud and stored in the environment variable "process.env.PORT"
} else // development mode
{
    console.log("Development mode. Running on local host server")
    require(`dotenv`).config({path: `./config/.env`})
    app.use(require(`cors`)({credentials: true, origin: process.env.LOCAL_HOST}))  //  not needed in gcloud
    require(`./config/db`)
    PORT = process.env.SERVER_PORT
}

// Routers
app.use(require(`./routes/tshirts`))
app.use(require(`./routes/users`))

const path = require("path")
app.use(express.static(path.join(__dirname, "..", 'client', 'build')));

// Маршрут для обробки всіх інших запитів, повертає index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", 'client', 'build', 'index.html'));
});

// Port
app.listen(PORT, () => {
    console.log(`Connected to port ` + PORT)
})

// Error 404
app.use((req, res, next) => {
    next(createError(404))
})

app.use(function (err, req, res, next) {

    if (!err.statusCode) {
        err.statusCode = 500
    }

    let errorMessage = err.message

    if (err instanceof multer.MulterError) {
        err.statusCode = 400 // Встановлюємо статус код для помилок Multer
        if (err.message === 'Too many files') {
            errorMessage = `Too many files. Maximum allowed: ${process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED}`
        }
    }
    if (err instanceof ReferenceError) {
        err.statusCode = 400
        errorMessage = "All fields are required"
    }

    res.status(err.statusCode).json({errorMessage: errorMessage})
})