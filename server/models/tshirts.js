const mongoose = require(`mongoose`)

let tshirtPhotosSchema = new mongoose.Schema(
    {
        filename: {type: String}
    })

let tshirtsSchema = new mongoose.Schema(
    {
        style: {type: String, required: true},
        color: {type: String, required: true},
        size: {type: Array, required: true},
        materials: {type: Array, required: true},
        country_of_manufacture: {type: String, required: true},
        brand: {type: String, required: true},
        price: {type: Number, required: true},
        photos: [tshirtPhotosSchema],
        quantity: {type: Number, required: true}
    },
    {
        collection: `t-shirts`
    })


module.exports = mongoose.model(`t-shirts`, tshirtsSchema)