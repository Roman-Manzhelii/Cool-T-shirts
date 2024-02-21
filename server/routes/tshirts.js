const router = require(`express`).Router()
const createError = require('http-errors')
const tshirtsModel = require(`../models/tshirts`)
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer = require('multer');

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


const deleteTshirtPhoto =  (req, res, next) => {
    const { tshirtId, photoId } = req.params;

    tshirtsModel.findByIdAndUpdate(
        tshirtId,
        { $pull: { photos: { _id: photoId } } },
        { new: true },
        (err, tshirt) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting photo');
            }

            if (!tshirt) {
                return res.status(404).send('T-shirt not found');
            }

            res.send('Photo deleted successfully');
        }
    );
};


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


const updateTshirtDocument = async (req, res, next) => {
    try {
        const updateData = {
            style: req.body.style,
            color: req.body.color,
            size: req.body.size,
            materials: req.body.materials,
            country_of_manufacture: req.body.country_of_manufacture,
            brand: req.body.brand,
            price: req.body.price,
        };

        const existingTshirt = await tshirtsModel.findById(req.params.id);
        const newPhotos = req.files.map(file => ({ filename: file.filename }));
        updateData.photos = existingTshirt.photos.concat(newPhotos.filter(newPhoto =>
            !existingTshirt.photos.some(existingPhoto => existingPhoto.filename === newPhoto.filename)
        ))
        const updatedTshirt = await tshirtsModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedTshirt) {
            return res.status(404).send('T-shirt not found');
        }
        res.json(updatedTshirt);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};




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
router.put(`/tshirts/:id`, upload, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateTshirtFields, updateTshirtDocument);

// Delete one record
router.delete(`/tshirts/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, deleteTshirtDocument)

// Delete one photo
router.delete('/tshirts/:tshirtId/photos/:photoId', verifyUsersJWTPassword, checkThatUserIsAnAdministrator, deleteTshirtPhoto)



module.exports = router