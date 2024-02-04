const router = require(`express`).Router()

const tshirtsModel = require(`../models/tshirts`)


// read all records
router.get(`/tshirts`, (req, res) =>
{   
    //user does not have to be logged in to see tshirt details
    tshirtsModel.find((error, data) =>
    {
        res.json(data)
    })
})


// Read one record
router.get(`/tshirts/:id`, (req, res) =>
{
    tshirtsModel.findById(req.params.id, (error, data) =>
    {
        res.json(data)
    })
})


// Add new record
router.post(`/tshirts`, (req, res) =>
{
    tshirtsModel.create(req.body, (error, data) =>
    {
        res.json(data)
    })
})


// Update one record
router.put(`/tshirts/:id`, (req, res) =>
{
    tshirtsModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) =>
    {
        res.json(data)
    })        
})


// Delete one record
router.delete(`/tshirts/:id`, (req, res) =>
{
    tshirtsModel.findByIdAndRemove(req.params.id, (error, data) =>
    {
        res.json(data)
    })       
})

module.exports = router