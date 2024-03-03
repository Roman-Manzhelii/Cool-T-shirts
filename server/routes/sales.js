const router = require(`express`).Router()

const salesModel = require(`../models/sales`)
const tshirtsModel = require(`../models/tshirts`)
const jwt = require("jsonwebtoken")
const fs = require("fs")
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
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
const createNewSaleDocument = async (req, res, next) => {
    try {
        const {paypalPaymentID, tshirtIDs, price, customerName, customerEmail} = req.body

        let saleDetails = {
            paypalPaymentID,
            tshirtIDs,
            price,
            customerName,
            customerEmail
        }

        await salesModel.create(saleDetails)

        await tshirtsModel.updateMany(
            {_id: {$in: tshirtIDs}},
            {$inc: {quantity: -1}}
        )

        res.json({success: true})
    } catch (err) {
        return next(err)
    }
}

const getPurchesByEmail = async (req, res) => {
    try {
        const purchases = await salesModel.find({customerEmail: req.params.email})

        res.json(purchases)
    } catch (error) {
        console.error('Error fetching purchase history:', error)
        res.status(500).json({message: 'An error occurred while fetching purchase history.'})
    }
}

router.post('/sales', verifyUsersJWTPassword, createNewSaleDocument)

router.get('/purchases/byUser/:email', verifyUsersJWTPassword, getPurchesByEmail)
module.exports = router