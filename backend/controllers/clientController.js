const db = require('../dataBaseConfig.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


exports.clientSave = async (req, res)=>{
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let hashPassword = await bcrypt.hash(password, 10)
    let image=req.file.filename

    let value = [[username, email, hashPassword,image]]
    let sql = 'insert into clientData(username, email, password,image) values ?'
    db.query(sql, [value], (err, result)=>{
        if(err) throw err
        else{
            res.send('data submit')
        }
    })
}

exports.clientLogin = (req, res)=>{
    try{
    let username = req.body.username
    let password = req.body.password
    let sql = 'select * from clientData where username= ?'

    db.query(sql, [username], (err, result)=>{

        if(err) throw err
        else{
            console.log(result)
            if(result.length > 0){
                bcrypt.compare(password, result[0].password, (err, isMatch)=>{
                        let token = generateToken(result[0])
                        console.log(token)
                        res.json({token, isMatch})
                    })
                }else{
                    res.send(false)
                }
            }
        })
}catch(error){
    console.log(error)
}
}


exports.getClient = (req, res)=>{
    let sql = 'select * from clientData'
    db.query(sql, (err, result)=>{
        if(err) throw err
        else{
            res.json(result)
        }
    })
}

exports.createClient=(req,res)=>{
    let username=req.params.username
    let clientTableQuery=`
    CREATE TABLE IF NOT EXISTS ${username}(
    id INT NOT NULL AUTO_INCREMENT,
    productBrand VARCHAR(255) NULL,
    productType VARCHAR(255) NULL,
    productPrice VARCHAR(255) NULL
    productRating VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    PRIMARY KEY (id));
    `
    db.query(clientTableQuery,(err,result)=>{
        if(err) throw err
        else{
            console.log("client table is created")
        }
    })
}

exports.deleteClient = (req, res)=>{
    let id = req.params.id
    let sql = 'delete from clientData where id = ?'

    db.query(sql, [id], (err, result)=>{
        if(err) throw err
        else{
            res.send('data deleted')
        }
    })
}

exports.viewClient = (req,res)=>{
    let id = req.params.id
    let sql = "select * from clientData where id = ?"
    db.query(sql, [id], (err, result)=>{
        if(err) throw err
        else{
            res.json(result)
        }
    })
}

exports.updateClient = (req, res)=>{
    let id = req.params.id
    let newData = req.body
    let sql = 'update clientData set ? where id = ?'
    db.query(sql, [newData, id], (err, result)=>{
        if(err) throw err
        else{
            res.send('data updated')
        }
    })
}


exports.profile = (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded)
        if (err) {
            return res.status(400).send('Invalid token');
        }
        db.query('SELECT * FROM clientData WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                return res.status(500).send('Database error');
            }
            res.status(200).json(results[0]);
        });
    });
}


exports.createClientTable = (req, res)=>{
    let username = req.params.username
    let createClientTable = `
CREATE TABLE IF NOT EXISTS ${username} (
    id INT NOT NULL AUTO_INCREMENT,
    productBrand VARCHAR(255) NULL,
    productType VARCHAR(255) NULL,
    productPrice VARCHAR(255) NULL,
    productRating VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    PRIMARY KEY (id));
`

db.query(createClientTable, (err, result)=>{
    if(err) throw err
    else{
        console.log("client table created successfull")
    }
})
}


exports.getUserDetails = (req, res)=>{
    let username = req.params.username
    let sql = 'select * from clientData where username = ?'
    db.query(sql, [username], (err, result)=>{
        if(err) throw err
        else{
            res.json(result)
        }
    })
}