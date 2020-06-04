const router = require('express').Router();
const Users = require('./users-model');
const restricted = require("../auth/restricted-middleware");
const { exec } = require("child_process")

const admin_id = 30;

router.get("/", (req,res) => {
    Users.getAll().then(users => {
        exec("touch hello.txt", (err, stdout, stderr) => {

            if (err) {
                return
            }
            console.log(stdout)
            console.log(stderr)
        })
        res.status(201).json(users)
    })
    .catch(err => {
        exec("touch error.txt", (err, stdout, stderr) => {
            console.log('ok done')
            res.status(500).json({message: "yo"})
        })
    })
})

router.get("/me", restricted, (req,res) => {
    Users.findById(req.decodedJwt.id).then(user => {
        delete user.password;
        res.status(201).json(user)
    })
})



router.put('/', restricted, (req,res) => {
    
    if (req.body.password) {
        delete req.body.password
    }
    Users.updateUser(id, req.body)
    .then( _ => Users.findById(id)).then(user => {
        delete user.password;
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({message: 'Unable to update', error: err})
    })}

)

router.delete('/', restricted, (req, res) => {

        Users.remove(req.decodedJwt.id)
        .then(user => {
            if (!user) {
                res.status(404).json({message: "No user exists by that ID!"})
            } else {
                res.status(200).json({message: "deleted"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })

})

router.delete('/:id', restricted, (req, res) => {
    if (req.decodedJwt.id === admin_id) {
        Users.remove(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({message: "No user exists by that ID!"})
            } else {
                res.status(200).json({message: "deleted"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    } else {
        res.status(500).json({bro: "cmon now"})
    }
})

router.put('/:id', restricted, (req,res) => {
       
    if (req.body.password) {
        delete req.body.password
    }
    Users.updateUser(id, req.body)
    .then( _ => Users.findById(id)).then(user => {
        delete user.password;
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({message: 'Unable to update', error: err})
    })
    
})
  

module.exports = router;