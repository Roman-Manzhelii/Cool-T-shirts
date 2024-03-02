const router = require(`express`).Router()
const createError = require('http-errors')
const tshirtsModel = require(`../models/tshirts`)
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer = require('multer')

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/
    const isMimeTypeValid = allowedTypes.test(file.mimetype)

    if (isMimeTypeValid) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid file type, only JPEG, JPG, and PNG are allowed!`), false)
    }
}


const upload = multer({
    dest: 'uploads/',
    fileFilter,
    limits: {fileSize: 5000000, files: parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)},
}).array("tshirtPhotos")


const verifyUsersJWTPassword = (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => {
        if (err) {
            return next(err)
        } else {
            req.decodedToken = decodedToken
            next()
        }
    })
}

const checkThatUserIsAnAdministrator = (req, res, next) => {
    if (req.decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) {
        return next(createError(401))
    }
    return next()
}


const validateTshirtFields = (req, res, next) => {
    if (!req.body.style || req.body.style.length === 0) {
        return res.json({errorMessage: `Style cannot be empty`})
    }
    if (!req.body.color || req.body.color.length === 0) {
        return res.json({errorMessage: `Color cannot be empty`})
    }
    if (!Array.isArray(req.body.size) || !req.body.size.every(size => ["XS", "S", "M", "L", "XL", "XXL"].includes(size))) {
        return res.json({errorMessage: `Size cannot be empty. Must contain any of ["XS", "S", "M", "L", "XL", "XXL"]. Split by coma ","`})
    }
    if (!Array.isArray(req.body.materials) || !req.body.materials.every(material => material.length > 0)) {
        return res.json({errorMessage: `Materials cannot be empty. Split by coma ","`})
    }
    if (!req.body.country_of_manufacture || req.body.country_of_manufacture.length === 0) {
        return res.json({errorMessage: `Country of manufacture cannot be empty`})
    }
    if (!req.body.brand || req.body.brand.length === 0) {
        return res.json({errorMessage: `Brand cannot be empty`})
    }
    if (req.body.rating.length === 0 || !["1", "2", "3", "4", "5"].includes(req.body.rating)) {
        return res.status(400).json({errorMessage: "The rating can be one of the following values: 1, 2, 3, 4, 5"});
    }
    if (req.body.price.length === 0 || req.body.price < 0.01 || req.body.price > 100000) {
        return res.json({errorMessage: `Price needs to be between €0.01 and €100000`})
    }
    if (req.body.quantity.length === 0 || req.body.quantity < 0 || req.body.quantity > 1000) {
        return res.json({errorMessage: `Quantity needs to be between 0 and 1000`})
    }
    next()
}

const createNewTshirtDocument = (req, res, next) => {
    let tshirtDetails = {
        style: req.body.style,
        color: req.body.color,
        size: req.body.size,
        materials: req.body.materials,
        country_of_manufacture: req.body.country_of_manufacture,
        brand: req.body.brand,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        photos: req.files.map(file => ({filename: file.filename}))
    }


    tshirtsModel.create(tshirtDetails, (err, data) => {
        if (err) {
            return next(err)
        }
        return res.json(data)
    })
}


const getAllTshirtDocuments = (req, res, next) => {
    tshirtsModel.find((err, data) => {
        if (err) {
            return next(err)
        }
        return res.json(data)
    })
}


const getTshirtPhotoAsBase64 = (req, res, next) => {
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, data) => {
        if (err) {
            return next(err)
        }

        return res.json({image: data})
    })
}


const deleteTshirtPhoto = (req, res) => {
    tshirtsModel.findByIdAndUpdate(req.params.tshirtId, {$pull: {photos: {_id: req.params.photoId}}}, {new: true}, (err, tshirt) => {
            if (err) {
                return res.status(500).send('Error deleting photo')
            }

            if (!tshirt) {
                return res.status(404).send('T-shirt not found')
            }

            res.send('Photo deleted successfully')
        }
    )
}


const getTshirtDocument = (req, res, next) => {
    tshirtsModel.findById(req.params.id, (err, data) => {
        if (err) {
            return next(err)
        }
        return res.json(data)
    })
}

const getSomeTshirtDocuments = (req, res, next) => {
    const {ids} = req.body

    if (!ids || ids.length === 0) {
        return res.status(400).json({message: "No IDs provided."})
    }

    tshirtsModel.find({
        '_id': {$in: ids}
    }, (err, tshirts) => {
        if (err) {
            return next(err)
        }
        res.json(tshirts)
    })
}


const updateTshirtDocument = (req, res, next) => {
    tshirtsModel.findById(req.params.id, (err, tshirt) => {
        if (err) {
            return next(err)
        }

        if (!tshirt) {
            return next(createError(400, 'T-shirt not found'))
        }

        const photosToDelete = req.body.photosToDelete ? JSON.parse(req.body.photosToDelete) : []

        const updateData = {
            style: req.body.style,
            color: req.body.color,
            size: req.body.size,
            materials: req.body.materials,
            country_of_manufacture: req.body.country_of_manufacture,
            brand: req.body.brand,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity
        }

        const totalPhotosAfterUpdate = (tshirt.photos.length - photosToDelete.length) + (req.files ? req.files.length : 0)

        if (totalPhotosAfterUpdate > process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED) {
            return next(createError(400, `Maximum number of photos per T-shirt: ${process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED}`))
        }

        if (req.files && req.files.length > 0) {
            const newPhotos = req.files.map(file => ({filename: file.filename}))
            updateData.photos = [...tshirt.photos.filter(photo => !photosToDelete.includes(photo._id)), ...newPhotos]
        } else {
            updateData.photos = tshirt.photos.filter(photo => !photosToDelete.includes(photo._id))
        }

        tshirtsModel.findByIdAndUpdate(req.params.id, {$set: updateData}, {new: true}, (updateErr, updatedTshirt) => {
            if (updateErr) {
                return next(updateErr)
            }
            res.json(updatedTshirt)
        })
    })
}


const deleteTshirtDocument = (req, res, next) => {
    tshirtsModel.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            return next(err)
        }

        return res.json(data)
    })
}

// Read all records
router.get(`/tshirts`, getAllTshirtDocuments)

//Get photo
router.get(`/tshirts/photo/:filename`, getTshirtPhotoAsBase64)

// Read one record
router.get(`/tshirts/:id`, verifyUsersJWTPassword, getTshirtDocument)

// Read couple records
router.post(`/tshirts/bulk`, verifyUsersJWTPassword, getSomeTshirtDocuments)

// Add new record
router.post(`/tshirts`, upload, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateTshirtFields, createNewTshirtDocument)

// Update one record
router.put(`/tshirts/:id`, upload, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateTshirtFields, updateTshirtDocument)

// Delete one record
router.delete(`/tshirts/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, deleteTshirtDocument)

// Delete one photo
router.delete('/tshirts/:tshirtId/photos/:photoId', verifyUsersJWTPassword, checkThatUserIsAnAdministrator, deleteTshirtPhoto)


module.exports = router