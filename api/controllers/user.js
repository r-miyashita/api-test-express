'use strict';

const {PrismaClient} = require('@prisma/client');
const User = require('../prisma/models/user');
const prisma = new PrismaClient();
const user = new User(prisma);

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
// ユーザ認証
// param: -
// return: 認証成功：next(),認証失敗：isAuth 
// ********************************
const verifyUser = async (req, res, next) => {
    try{
        const userId = req.session.userId;
        const {rtnFlg, data} = JSON.parse(JSON.stringify(await user.getUserById(userId)));
        const isAuth = Boolean(rtnFlg && data);
        const body = { isAuth: isAuth };
        if (isAuth) {
            res.locals.userName = data.name
            next();
        }
        else{
            res.json(body);
        } 
    }
    catch(err) {
        res.json(err);
    }
}

// ********************************
// ログイン
// param: {name, password}
// return: {
//     rtnFlg,
//     data{id, name},
//     errMsg?
// }
// ********************************
const signInUser = async (req, res) => {
        const {name, password} = req.body;
        const {rtnFlg, data} = JSON.parse(JSON.stringify(await user.getUserByNamePwd(name, password)));
        const resultMaker = new ResultMaker(rtnFlg, data);
        const errMsg = '検索エラー';
        const body = resultMaker.summarizeResult_query(errMsg);

        // データ照合後の判定
        if (body.rtnFlg) {

            // 検索結果0件の場合、ログイン失敗にする
            if (!body.data) {
                body.rtnFlg = false;
                body.errMsg = 'ログイン失敗';
            }

            // 検索結果が返っている（ユーザ存在）。であればセッション開始
            else req.session.userId = data.id;
        }

        res.json(body);
}

// ********************************
// ログアウト
// param: -
// return: {
//     ログアウトメッセージ
// }
// ********************************
const signOutUser = async(req, res) => {
    req.session = null;
    res.json('ログアウトしました');
}

// ********************************
// ユーザ新規登録
// 
// param: {name, password, repassword}
// return: {
//     rtnFlg,
//     data{id, name},
//     errMsg?
// }
// ********************************
const signUpUser = async(req, res) => {
    const {name, password, repassword} = req.body;
    const userChk = JSON.parse(JSON.stringify(await user.getUserByNamePwd(name, password)));
    const resultMaker_userChk = new ResultMaker(userChk.rtnFlg, userChk.data);
    const errMsg_userChk = 'データ登録前処理エラー：既存データ存在確認処理に失敗しました';
    let body = resultMaker_userChk.summarizeResult_query(errMsg_userChk);

    // データ取得成功であれば次ステップへ進む
    if (body.rtnFlg) {

        // 既存データ有りの場合、重複エラーを返す
        if (body.data) {
            body.rtnFlg = false;
            body.errMsg = 'ユーザー名重複エラー：ユーザ名が重複しています';
        }

        // 検索ヒットなしで返ってきた場合、登録ステップへ進む
        else {

            // 入力パスワードチェック。一致すれば登録処理
            if (password === repassword) {
                body.errMsg = 'password'
                const addUser = JSON.parse(JSON.stringify(await user.addUser(name, password)));
                const resultMaker_addUser = new ResultMaker(addUser.rtnFlg, addUser.data);
                const errMsg_addUser = 'データ登録エラー：ユーザ登録に失敗しました';
                body = resultMaker_addUser.summarizeResult_query(errMsg_addUser);

                // 登録成功した場合、セッション開始する
                if (body.rtnFlg && body.data) {
                    req.session.userId = body.data.id;
                }
            }

            // パスワード不一致。登録処理せずにエラーとして返す。
            else {
                body.rtnFlg = false;
                body.errMsg = 'パスワードチェックエラー：入力されたパスワードが一致しません';
            }
        }
    }

    res.json(body);
}

module.exports = {
    signInUser,
    signOutUser,
    signUpUser,
    verifyUser,
}
