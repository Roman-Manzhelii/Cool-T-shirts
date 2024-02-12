const router = require(`express`).Router()
const tshirtsModel = require(`../models/tshirts`)
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer  = require('multer')
var upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})


// read all records
router.get(`/tshirts`, (req, res) =>
{   
    //user does not have to be logged in to see tshirt details
    tshirtsModel.find((error, data) =>
    {
        res.json(data)
    })
})

router.get(`/tshirts/photo/:filename`, (req, res) =>
{
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, fileData) =>
    {
        if(fileData)
        {
            res.json({image:fileData})
        }
        else
        {
            res.json({image:null})
        }
    })
})


// Read one record
router.get(`/tshirts/:id`, (req, res) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err) =>
    {
        if (err)
        {
            res.json({errorMessage: `User is not logged in`})
        }
        else
        {
            tshirtsModel.findById(req.params.id, (error, data) => {
                res.json(data)
            })
        }
    })
})


// Add new record
router.post(`/tshirts`, upload.array("tshirtPhotos", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), (req, res) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err)
        {
            res.json({errorMessage:`User is not logged in`})
        }
        else {
            if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
                if (!/^[a-zA-Z]+$/.test(req.body.style)) {
                    res.json({errorMessage: `Style must be a string`});
                } else if (!/^[a-zA-Z]+$/.test(req.body.color)) {
                    res.json({errorMessage: `Color must be a string`});
                } else if (!Array.isArray(req.body.size) || !req.body.size.every(size => ["XS", "S", "M", "L", "XL", "XXL"].includes(size))) {
                    res.json({errorMessage: `Size must be an array containing any of ["XS", "S", "M", "L", "XL", "XXL"]`});
                } else if (!Array.isArray(req.body.materials) || !req.body.materials.every(material => /^[a-zA-Z]+$/.test(material))) {
                    res.json({errorMessage: `Materials must be an array of strings containing only letters`});
                } else if (!/^[a-zA-Z]+$/.test(req.body.country_of_manufacture)) {
                    res.json({errorMessage: `Country of manufacture must be a string`});
                } else if (!/^[a-zA-Z]+$/.test(req.body.brand)) {
                    res.json({errorMessage: `Brand must be a string`});
                } else if (req.body.price < 0.01 || req.body.price > 100000) {
                    res.json({errorMessage: `Price needs to be between €0.01 and €100000`});
                } else {

                    let tshirtDetails = {}

                    tshirtDetails.style = req.body.style
                    tshirtDetails.color = req.body.color
                    tshirtDetails.size = req.body.size
                    tshirtDetails.materials = req.body.materials
                    tshirtDetails.country_of_manufacture = req.body.country_of_manufacture
                    tshirtDetails.brand = req.body.brand
                    tshirtDetails.price = req.body.price

                    tshirtDetails.photos = []

                    req.files.map((file, index) =>
                    {
                        tshirtDetails.photos[index] = {filename:`${file.filename}`}
                    })
                    tshirtsModel.create(tshirtDetails, (error, data) => {
                        res.json(data)
                    })

                }
            }
            else
            {
                res.json({errorMessage:`User is not an administrator, so they cannot add new records`})
            }
        }
    })
})


// Update one record
router.put(`/tshirts/:id`, (req, res) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err) =>
    {
        if (err)
        {
            res.json({errorMessage:`User is not logged in`})
        }
        else {
                if (!/^[a-zA-Z]+$/.test(req.body.style)) {
                    res.json({errorMessage: `Style must be a string`});
                } else if (!/^[a-zA-Z]+$/.test(req.body.color)) {
                    res.json({errorMessage: `Color must be a string`});
                } else if (!Array.isArray(req.body.size) || !req.body.size.every(size => ["XS", "S", "M", "L", "XL", "XXL"].includes(size))) {
                    res.json({errorMessage: `Size must be an array containing any of ["XS", "S", "M", "L", "XL", "XXL"]`});
                } else if (!Array.isArray(req.body.materials) || !req.body.materials.every(material => /^[a-zA-Z]+$/.test(material))) {
                    res.json({errorMessage: `Materials must be an array of strings containing only letters`});
                } else if (!/^[a-zA-Z]+$/.test(req.body.country_of_manufacture)) {
                    res.json({errorMessage: `Country of manufacture must be a string`});
                } else if (!/^[a-zA-Z]+$/.test(req.body.brand)) {
                    res.json({errorMessage: `Brand must be a string`});
                } else if (req.body.price < 0.01 || req.body.price > 100000) {
                    res.json({errorMessage: `Price needs to be between €0.01 and €100000`});
                } else {
                    tshirtsModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) => {
                        res.json(data)
                    })
                }
        }
    })
})


// Delete one record
router.delete(`/tshirts/:id`, (req, res) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err)
        {
            res.json({errorMessage:`User is not logged in`})
        }
        else {
            if (decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
                tshirtsModel.findByIdAndRemove(req.params.id, (error, data) => {
                    res.json(data)
                })
            }
            else
            {
                res.json({errorMessage: `User is not an administrator, so they cannot delete records`})
            }
        }
    })
})

module.exports = router