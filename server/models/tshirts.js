const mongoose = require(`mongoose`)

let tshirtsSchema = new mongoose.Schema(
   {
        style: {type: String},
        color: {type: String},
       size: {type: Array},
       materials: {type: Array},
       photo: {type: Array},
       country_of_manufacture: {type: String},
        brand: {type: String},
        price: {type: Number}
   },
   {
       collection: `t-shirts`
   })

module.exports = mongoose.model(`t-shirts`, tshirtsSchema)