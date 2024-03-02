const router = require(`express`).Router()

const salesModel = require(`../models/sales`)
const tshirtsModel = require(`../models/tshirts`)


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


router.post('/sales', createNewSaleDocument)

module.exports = router