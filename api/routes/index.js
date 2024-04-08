// 変数
const express = require('express');
const UserController = require('../controllers/user');
const TaskController = require('../controllers/task');
const router = express.Router();

// router.route('/').get((req, res) => {
//     res.json('hello')
// })

router.route('/')
    .get(UserController.verifyUser, TaskController.readAllTasks)
;

// task登録
router.route('/task/add')
    .post(TaskController.createTask)
;

// task編集
router.route('/task/edit')
    .post(TaskController.updateTask)
;

// task削除
router.route('/task/delete')
    .post(TaskController.deleteTask)
;

// ログイン
router.route('/signin')
    .post(UserController.signInUser)
;

// ユーザ登録
router.route('/signup')
    .post(UserController.signUpUser)
;

// ログアウト
router.route('/signout')
    .get(UserController.signOutUser)
;

router.use('/test', require('./test'));
module.exports = router;