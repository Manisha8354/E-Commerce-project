const db=require('../dataBaseConfig.js')

exports.cartSave = (req, res)=>{
    let productBrand = req.body.productBrand
    let productType = req.body.productType
    let productPrice = req.body.productPrice
    let productRating = req.body.productRating
    let username = req.params.username
    let image=req.body.image

    let value = [[productBrand, productType, productPrice, productRating,image]]
    let sql = `insert into ${username}(productBrand, productType, productPrice, productRating,image) values ?`
    db.query(sql, [value], (err, result)=>{
        if(err) throw err
        else{
            res.send('data submit')
        }
    })
}

exports.getCart = (req, res)=>{
    let username = req.params.username
    let sql = `select * from ${username}`
    db.query(sql, (err, result)=>{
        if(err) throw err
        else{
            res.json(result)
        }
    })
}

exports.deleteCart = (req, res)=>{
    let id = req.params.id
    let username = req.params.username

    let sql = `delete from ${username} where id = ?`

    db.query(sql, [id], (err, result)=>{
        if(err) throw err
        else{
            res.send('data deleted')
        }
    })
}