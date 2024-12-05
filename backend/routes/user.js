const { addUser, signinUser, getUsers, deleteUser } = require('../controllers/user');
const router = require('express').Router();

router.post('/signup', addUser)
    .post('/signin', signinUser)
    .get('/users', getUsers)
    .delete('/user/:id', deleteUser)

module.exports = router;
