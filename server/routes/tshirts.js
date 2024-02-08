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
    if(typeof req.session.user === `undefined`)
    {
        res.json({errorMessage:`User is not logged in`})
    }
    else
    {
        tshirtsModel.findById(req.params.id, (error, data) =>
        {
            res.json(data)
        })
    }
})


// Add new record
router.post(`/tshirts`, (req, res) =>
{
    if(typeof req.session.user === `undefined`)
    {
        res.json({errorMessage:`User is not logged in`})
    }
    else
    {
        if(req.session.user.accessLevel !== `undefined` && req.session.user.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
        {
            if(!/^[a-zA-Z]+$/.test(req.body.style))
            {
                res.json({errorMessage:`Style must be a string`});
            }
            else if(!/^[a-zA-Z]+$/.test(req.body.color))
            {
                res.json({errorMessage:`Color must be a string`});
            }
            else if (!Array.isArray(req.body.size) || !req.body.size.every(size => ["XS", "S", "M", "L", "XL", "XXL"].includes(size)))
            {
                res.json({errorMessage:`Size must be an array containing any of ["XS", "S", "M", "L", "XL", "XXL"]`});
            }
            else if (!Array.isArray(req.body.materials) || !req.body.materials.every(material => /^[a-zA-Z]+$/.test(material)))
            {
                res.json({ errorMessage: `Materials must be an array of strings containing only letters` });
            }
            else if (!Array.isArray(req.body.photo) || !req.body.photo.every(photo => /\.(jpg|jpeg|png|gif)$/i.test(photo)))
            {
                res.json({errorMessage:`Photo must be an array containing file names with valid extensions (.jpg, .jpeg, .png, .gif)`});
            }
            else if(!/^[a-zA-Z]+$/.test(req.body.country_of_manufacture))
            {
                res.json({errorMessage:`Country of manufacture must be a string`});
            }
            else if(!/^[a-zA-Z]+$/.test(req.body.brand))
            {
                res.json({errorMessage:`Brand must be a string`});
            }
            else if(req.body.price < 0.01 || req.body.price > 100000)
            {
                res.json({errorMessage:`Price needs to be between €0.01 and €100000`});
            }
            else
            {
                tshirtsModel.create(req.body, (error, data) =>
                {
                    res.json(data)
                })
            }
        }
        else
        {
            res.json({errorMessage:`User is not an administrator, so they cannot add new records`})
        }
    }
})


// Update one record
router.put(`/tshirts/:id`, (req, res) =>
{
    if(typeof req.session.user === `undefined`)
    {
        res.json({errorMessage:`User is not logged in`})
    }
    else
    {
        if(!/^[a-zA-Z]+$/.test(req.body.style))
        {
            res.json({errorMessage:`Style must be a string`});
        }
        else if(!/^[a-zA-Z]+$/.test(req.body.color))
        {
            res.json({errorMessage:`Color must be a string`});
        }
        else if (!Array.isArray(req.body.size) || !req.body.size.every(size => ["XS", "S", "M", "L", "XL", "XXL"].includes(size)))
        {
            res.json({errorMessage:`Size must be an array containing any of ["XS", "S", "M", "L", "XL", "XXL"]`});
        }
        else if (!Array.isArray(req.body.materials) || !req.body.materials.every(material => /^[a-zA-Z]+$/.test(material)))
        {
            res.json({ errorMessage: `Materials must be an array of strings containing only letters` });
        }
        else if (!Array.isArray(req.body.photo) || !req.body.photo.every(photo => /\.(jpg|jpeg|png|gif)$/i.test(photo)))
        {
            res.json({errorMessage:`Photo must be an array containing file names with valid extensions (.jpg, .jpeg, .png, .gif)`});
        }
        else if(!/^[a-zA-Z]+$/.test(req.body.country_of_manufacture))
        {
            res.json({errorMessage:`Country of manufacture must be a string`});
        }
        else if(!/^[a-zA-Z]+$/.test(req.body.brand))
        {
            res.json({errorMessage:`Brand must be a string`});
        }
        else if(req.body.price < 0.01 || req.body.price > 100000)
        {
            res.json({errorMessage:`Price needs to be between €0.01 and €100000`});
        }
        else
        {
            tshirtsModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) =>
            {
                res.json(data)
            })
        }
    }
})


// Delete one record
router.delete(`/tshirts/:id`, (req, res) =>
{
    if(typeof req.session.user === `undefined`)
    {
        res.json({errorMessage:`User is not logged in`})
    }
    else
    {
        if(req.session.user.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
        {
            tshirtsModel.findByIdAndRemove(req.params.id, (error, data) =>
            {
                res.json(data)
            })
        }
        else
        {
            res.json({errorMessage:`User is not an administrator, so they cannot delete records`})
        }
    }

})

module.exports = router