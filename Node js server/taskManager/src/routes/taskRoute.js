const express = require('express')
const router = express.Router()
const {verifyUser} = require('../middlewares/verifyUser');

const {getTasks, addTask, deleteTask, updateTask, getTaskById} = require('../controllers/taskController')

router.get('/', verifyUser, getTasks)
router.get('/:id', verifyUser, getTaskById)
router.post('/', verifyUser, addTask)
router.delete('/:id', verifyUser, deleteTask)
router.put('/:id', verifyUser, updateTask)

module.exports = router

