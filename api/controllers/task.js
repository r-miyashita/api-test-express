'use strict';

const {PrismaClient} = require('@prisma/client');
const Task = require('../prisma/models/task');
const prisma = new PrismaClient();
const task = new Task(prisma);

// クラス
class ResultMaker {
    // ****************************************************************
    //  クエリー結果を受け取って返却用のbodyを作る
    // 
    //  @param: rtnFlg   boolean    クエリー結果フラグ
    //  @param: data    object      結果データ or エラー情報
    // ****************************************************************
    constructor(rtnFlg, data) {
        this.rtnFlg = rtnFlg;
        this.data = data;
    }
    
    // ****************************************************************
    //  クエリー結果がエラーの場合にエラーメッセージを追加する。
    // 
    //  @param: errMsg: string  格納したいエラーメッセージ
    //  @rturn: body:   object  正常系はクエリー結果そのまま。異常系はエラーメッセージを付加。
    // ****************************************************************
    summarizeResult_query = (errMsg) => {
        const body = {
            rtnFlg: this.rtnFlg,
            data: this.data
        };
        if (!this.rtnFlg) body.errMsg = errMsg;
        return body;
    }
}

// ********************************
// タスク取得
// 
// param: ー
// return: {
//     rtnFlg,
//     data{id, user_id, task},
//     errMsg?
// }
// ********************************
const readAllTasks = async (req, res) => {
    // セッションのUIDを利用してデータ取得
    const userId = req.session.userId;
    const {rtnFlg, data} = JSON.parse(JSON.stringify(await task.getAllTaskByUserId(userId)));
    const resultMaker = new ResultMaker(rtnFlg, data);
    const errMsg = 'データ取得エラー';
    const body =  resultMaker.summarizeResult_query(errMsg);
    if (body.rtnFlg) {
        body.isAuth = true;
        body.userName = res.locals.userName;
    } 
    res.json(body);
};

// ********************************
// タスク登録
// 
// param: task
// return: {
//     rtnFlg,
//     data{id, user_id, task},
//     errMsg?
// }
// ********************************
const createTask = async (req, res) => {
    // セッションのUIDを利用してデータ取得
    const userId = req.session.userId;
    const addition = req.body.task;
    // データ登録
    const addTask = JSON.parse(JSON.stringify(await task.addTask(userId, addition)))
    const resultMakaker_addTask = new ResultMaker(addTask.rtnFlg, addTask.data);
    const errMsg_addTask = 'データ登録エラー';
    let body = resultMakaker_addTask.summarizeResult_query(errMsg_addTask);
    if (resultMakaker_addTask.rtnFlg) {
        // データ登録OKの場合はデータ再取得を行い、レスポンス内容の更新を行なう
        const getTasks = JSON.parse(JSON.stringify(await task.getAllTaskByUserId(userId)));
        const resultMaker_getTasks = new ResultMaker(getTasks.rtnFlg, getTasks.data);
        const errMsg_getTasks = 'データ登録後、一覧再取得エラー';
        body = resultMaker_getTasks.summarizeResult_query(errMsg_getTasks);
    }
    res.json(body);
}

// ********************************
// タスク編集
// 
// param: taskId, task
// return: {
//     rtnFlg,
//     data{id, user_id, task},
//     errMsg?
// }
// ********************************
const updateTask = async (req, res) => {
    // セッションのUIDを利用してデータ取得
    const userId = req.session.userId;
    const newTask = req.body.task;
    const taskId = req.body.taskId;
    const {rtnFlg, data} = JSON.parse(JSON.stringify(await task.editTask(taskId, userId, newTask)));
    const resultMaker = new ResultMaker(rtnFlg, data);
    const errMsg = 'データ更新エラー';
    const body = resultMaker.summarizeResult_query(errMsg);
    res.json(body);
}

// ********************************
// タスク削除
// 
// param: taskId
// return: {
//     rtnFlg,
//     data{id, user_id, task},
//     errMsg?
// }
// ********************************
const deleteTask = async (req, res) => {
    // セッションのUIDを利用してデータ取得
    const userId = req.session.userId;
    const deletion = req.body.task;
    const taskId = req.body.taskId;
    const {rtnFlg, data} = JSON.parse(JSON.stringify(await task.delTask(taskId, userId, deletion)));
    const resultMaker = new ResultMaker(rtnFlg, data);
    const errMsg = 'データ削除エラー';
    const body = resultMaker.summarizeResult_query(errMsg);
    res.json(body);
}

module.exports = {
    readAllTasks,
    createTask,
    updateTask,
    deleteTask,
}
