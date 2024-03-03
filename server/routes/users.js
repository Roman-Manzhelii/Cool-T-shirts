const router = require(`express`).Router()
const createError = require('http-errors')
const usersModel = require(`../models/users`)
const bcrypt = require('bcryptjs')  // needed for password encryption
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer = require('multer')
const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

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

const checkThatUserExistsInUsersCollection = (req, res, next) => {
    usersModel.findOne({email: req.params.email}, (err, data) => {
        if (err) {
            return next(err)
        }

        req.data = data
        return next()
    })
}


const checkThatJWTPasswordIsValid = (req, res, next) => {

    if (!req.data) {
        return next(createError(401, "The login or password is incorrect. Or the account was not registered"))
    }

    bcrypt.compare(req.params.password, req.data.password, (err, result) => {
        if (err) {
            return next(err)
        }

        if (!result) {
            return next(createError(401, "The login or password is incorrect. Or the account was not registered"))
        }

        return next()
    })
}


const checkThatFileIsUploaded = (req, res, next) => {
    if (!req.file) {
        return next(createError(400, `No file was selected to be uploaded`))
    }

    return next()
}


const checkThatFileIsAnImageFile = (req, res, next) => {
    if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg") {
        fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, err => {
            if (err) {
                return next(err)
            }
            return next(createError(400, "Invalid file type, only JPEG, JPG, and PNG are allowed!"))
        })
    } else {
        return next()
    }
}


const getAllUsersDocuments = (req, res, next) => {
    usersModel.find((err, data) => {
        if (err) {
            return next(err)
        }
        return res.json(data)
    })
}


const getUserPhotoAsBase64 = (req, res, next) => {
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, data) => {
        if (err) {
            return next(err)
        }

        return res.json({image: data})
    })
}


const checkThatUserIsNotAlreadyInUsersCollection = (req, res, next) => {
    usersModel.findOne({email: req.params.email}, (err, data) => {
        if (err) {
            return next(err)
        }

        if (data) {
            return next(createError(401, "Account already exists"))
        }
        return next()
    })
}


const addNewUserToUsersCollection = (req, res, next) => {
    bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
        if (err) {
            return next(err)
        }

        usersModel.create({
            name: req.params.name,
            email: req.params.email,
            password: hash,
            profilePhotoFilename: req.file.filename
        }, (err, data) => {
            if (err) {
                return next(err)
            }

            const token = jwt.sign({
                email: data.email,
                accessLevel: data.accessLevel
            }, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY})

            fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, 'base64', (err, fileData) => {
                if (err) {
                    return next(err)
                }

                return res.json({
                    name: data.name,
                    email: data.email,
                    accessLevel: data.accessLevel,
                    profilePhoto: fileData,
                    token: token
                })
            })
        })
    })
}


const returnUsersDetailsAsJSON = (req, res, next) => {
    const token = jwt.sign({
        email: req.data.email,
        accessLevel: req.data.accessLevel
    }, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY})

    if (req.data.profilePhotoFilename) {
        fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.data.profilePhotoFilename}`, 'base64', (err, data) => {
            if (err) {
                return next(err)
            }

            if (data) {
                return res.json({
                    name: req.data.name,
                    email: req.data.email,
                    accessLevel: req.data.accessLevel,
                    profilePhoto: data,
                    token: token
                })
            } else {
                return res.json({
                    name: req.data.name,
                    email: req.data.email,
                    accessLevel: req.data.accessLevel,
                    profilePhoto: null,
                    token: token
                })
            }
        })
    } else {
        return res.json({
            name: req.data.name,
            email: req.data.email,
            accessLevel: req.data.accessLevel,
            profilePhoto: null,
            token: token
        })
    }
}


const deleteUserDocument = (req, res, next) => {
    usersModel.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) {
            return next(err)
        }
        return res.json(data)
    })
}


const logout = (req, res) => {
    return res.json({})
}


router.get(`/users`, verifyUsersJWTPassword, getAllUsersDocuments)

router.get(`/users/photo/:filename`, verifyUsersJWTPassword, getUserPhotoAsBase64)

router.post(`/users/register/:name/:email/:password`, upload.single("profilePhoto"), checkThatFileIsUploaded, checkThatFileIsAnImageFile, checkThatUserIsNotAlreadyInUsersCollection, addNewUserToUsersCollection)

router.post(`/users/login/:email/:password`, checkThatUserExistsInUsersCollection, checkThatJWTPasswordIsValid, returnUsersDetailsAsJSON)

router.post(`/users/logout`, logout)

router.delete(`/users/:id`, verifyUsersJWTPassword, deleteUserDocument)

module.exports = router