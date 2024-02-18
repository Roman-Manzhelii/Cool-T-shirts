const router = require(`express`).Router()
const createError = require('http-errors')
const tshirtsModel = require(`../models/tshirts`)
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isMimeTypeValid = allowedTypes.test(file.mimetype);

    if (isMimeTypeValid) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type, only JPEG, JPG, and PNG are allowed!`), false);
    }
}


const upload = multer({
    dest: 'uploads/',
    fileFilter,
    limits: { fileSize: 5000000, files: parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED) },
}).array("tshirtPhotos");


const verifyUsersJWTPassword = (req, res, next) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err)
        {
            return next(err)
        }
        else
        {
            req.decodedToken = decodedToken
            next()
        }
    })
}

const checkThatUserIsAnAdministrator = (req, res, next) =>
{
    if(req.decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN)
    {
        return next(createError(401))
    }
    return next()
}


const validateTshirtFields = (req, res, next) => {
    if (!/^[a-zA-Z]+$/.test(req.body.style)) {
        return res.json({errorMessage: `Style must be a string`});
    }
    if (!/^[a-zA-Z]+$/.test(req.body.color)) {
        return res.json({errorMessage: `Color must be a string`});
    }
    if (!Array.isArray(req.body.size) || !req.body.size.every(size => ["XS", "S", "M", "L", "XL", "XXL"].includes(size))) {
        return res.json({errorMessage: `Size must be an array containing any of ["XS", "S", "M", "L", "XL", "XXL"]`});
    }
    if (!Array.isArray(req.body.materials) || !req.body.materials.every(material => /^[a-zA-Z]+$/.test(material))) {
        return res.json({errorMessage: `Materials must be an array of strings containing only letters`});
    }
    if (!/^[a-zA-Z]+$/.test(req.body.country_of_manufacture)) {
        return res.json({errorMessage: `Country of manufacture must be a string`});
    }
    if (!/^[a-zA-Z]+$/.test(req.body.brand)) {
        return res.json({errorMessage: `Brand must be a string`});
    }
    if (req.body.price < 0.01 || req.body.price > 100000) {
        return res.json({errorMessage: `Price needs to be between €0.01 and €100000`});
    }

    next();
};

const createNewTshirtDocument = (req, res, next) =>
{
    let tshirtDetails = {}

    tshirtDetails.style = req.body.style
    tshirtDetails.color = req.body.color
    tshirtDetails.size = req.body.size
    tshirtDetails.materials = req.body.materials
    tshirtDetails.country_of_manufacture = req.body.country_of_manufacture
    tshirtDetails.brand = req.body.brand
    tshirtDetails.price = req.body.price
    tshirtDetails.photos = req.files.map(file => ({ filename: file.filename }))

    tshirtsModel.create(tshirtDetails, (err, data) => {
        if(err)
        {
            return next(err)
        }
        return res.json(data)
    })
}


const getAllTshirtDocuments = (req, res, next) =>
{
    //user does not have to be logged in to see car details
    tshirtsModel.find((err, data) =>
    {
        if(err)
        {
            return next(err)
        }
        return res.json(data)
    })
}


const getTshirtPhotoAsBase64 = (req, res, next) =>
{
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, data) => {
        if (err) {
            return next(err)
        }

        return res.json({image: data})
    })
}


const getTshirtDocument = (req, res, next) =>
{
    tshirtsModel.findById(req.params.id, (err, data) =>
    {
        if(err)
        {
            return next(err)
        }
        return res.json(data)
    })
}


const updateTshirtDocument = (req, res, next) =>
{
    tshirtsModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, data) =>
    {
        if(err)
        {
            return next(err)
        }
        return res.json(data)
    })
}


const deleteTshirtDocument = (req, res, next) =>
{
    tshirtsModel.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            return next(err)
        }

        return res.json(data)
    })
}

// read all records
router.get(`/tshirts`, getAllTshirtDocuments)


router.get(`/tshirts/photo/:filename`, getTshirtPhotoAsBase64)


// Read one record
router.get(`/tshirts/:id`, verifyUsersJWTPassword, getTshirtDocument)


// Add new record
router.post(`/tshirts`, upload, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateTshirtFields, createNewTshirtDocument);



// Update one record
router.put(`/tshirts/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateTshirtFields, updateTshirtDocument);

// Delete one record
router.delete(`/tshirts/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, deleteTshirtDocument)

module.exports = router