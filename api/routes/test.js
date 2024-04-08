const router = require('express').Router();
const { PrismaClient } = require("@prisma/client");
const User = require('../prisma/models/user');
const Task = require('../prisma/models/task');

// Prismaを使う準備
const prisma = new PrismaClient();
const user = new User(prisma);
const task = new Task(prisma);

// const checkSesisonState = (res, req, next) => {
//     res.error = '1';
//     next();
// };



// router.get('/',test,(req, res) => {
//     const isAuth = req.isAuth();
//     res.json(isAuth);
// });

// router.route('/db/user')
//     .get(checkSesisonState, async (req, res) => {
//         const result = 1;
//         res.json(result);
//     })
// ;

// router.get('/db', checkSesisonState, async(req, res) => {
//     // const result = res.authId;
//     res.send(res.error);
// })


// router.route('/etc')
//     .post(async (req, res) => {
//         const id = req.body.id;
//         const {rtnFlg, data} = await task.getAllTaskById(id);
//         const body = {
//             rtnFlg: rtnFlg,
//             data: data
//         }
//         if (!rtnFlg) {
//             body.rtnFlg = false;
//             body.errMsg = 'データ取得エラー';
//         }
        
//         res.json(body);
//     })
//     .get(async(req, res) => {
//         // ユーザ重複判定
//         const results = await user.getUserByNamePwd('name', 'userA');
        
//         res.json(results);
//     })
// ;

module.exports = router;

// debug ////////////////////////////////////////////////////////////////////////////
// クラス
class ResultMaker {
    /*  クエリー結果を受け取って返却用のbodyを作る
        @param: rtnFlg   boolean    クエリー結果フラグ
        @param: data    object      結果データ or エラー情報
    */
        constructor(rtnFlg, data) {
            this.rtnFlg = rtnFlg;
            this.data = data;
        }
    
        summarizeResult_query = (errMsg) => {
        /*  クエリー結果がエラーの場合にエラーメッセージを追加する。
            @param: errMsg: string  格納したいエラーメッセージ
            @rturn: body:   object  正常系はクエリー結果そのまま。異常系はエラーメッセージを付加。
        */
            const body = {
                rtnFlg: this.rtnFlg,
                data: this.data
            };
            if (!this.rtnFlg) body.errMsg = errMsg;
            return body;
        }
    }


(async () => {
        // セッションのUIDを利用してデータ取得
        const userId = 1;
        const {rtnFlg, data} = JSON.parse(JSON.stringify(await task.getAllTaskByUserId(userId)));
        const resultMaker = new ResultMaker(rtnFlg, data);
        const errMsg = 'データ取得エラー';
        const body =  resultMaker.summarizeResult_query(errMsg);
        // res.json(body);
    console.log(body)
})();
