const mongoose = require(`mongoose`)

let tshirtPhotosSchema = new mongoose.Schema(
    {
        filename:{type:String}
    })

let tshirtsSchema = new mongoose.Schema(
   {
        style: {type: String},
        color: {type: String},
        size: {type: Array},
        materials: {type: Array},
        country_of_manufacture: {type: String},
        brand: {type: String},
        price: {type: Number},
        photos: [tshirtPhotosSchema]
   },
   {
       collection: `t-shirts`
   })

module.exports = mongoose.model(`t-shirts`, tshirtsSchema)