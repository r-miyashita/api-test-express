'use strict';

class User {
    constructor(prisma) {
        this.prisma = prisma;
    }

    ///////////////////////////////////
    // データ取得
    // 
    // param: id
    // return: {
    //     rtnFlg,
    //     data{id, name, password} or {err}
    // }
    ///////////////////////////////////
    getUserById = async (val) => {
        const results = {
            rtnFlg: false,
            data: null
        }
        try {
            results.data = await this.prisma.User.findUnique({where: {id: val}});
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    }

    ///////////////////////////////////
    // データ取得
    // 
    // param: name, password
    // return: {
    //     rtnFlg,
    //     data{id, name} or {err}
    // }
    ///////////////////////////////////
    getUserByNamePwd = async (name, password) => {
        const results = {
            rtnFlg: false,
            data: null
        }
        try {
            results.data = await this.prisma.User.findUnique({
                where: {
                    name: String(name),
                    password: String(password)
                },
                select: {
                    id: true,
                    name: true
                },
            });
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    }

    ///////////////////////////////////
    // データ登録
    // 
    // param: name, password
    // return: {
    //     rtnFlg,
    //     data{id, name, password} or {err}
    // }
    ///////////////////////////////////
    addUser = async (name, password) => {
        const results = {
            rtnFlg: false,
            data: null
        }
        try {
            results.data = await this.prisma.User.create({
                data: {
                    name: name,
                    password: password
                },
            });
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    }
}

module.exports = User;