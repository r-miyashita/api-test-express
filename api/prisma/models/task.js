'use strict';

class Task {
    constructor(prisma) {
        this.prisma = prisma;
    }

    ///////////////////////////////////
    // データ取得
    // 
    // param: id
    // return: {
    //     rtnFlg,
    //     data{[{task}]} or {err}
    // }
    ///////////////////////////////////
    getAllTaskByUserId = async (id) => {
        const results = {
            rtnFlg: false,
            data: null
        };
        try {
            results.data = await this.prisma.Task.findMany({where: {user_id: Number(id)}});
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    };

    ///////////////////////////////////
    // データ登録
    // 
    // param: {user_id, task} 
    // return: {
    //     rtnFlg,
    //     data{[{task}]} or {err}
    // }
    ///////////////////////////////////
    addTask = async (userId, task) => {
        const results = {
            rtnFlg: false,
            data: null
        };
        try {
            results.data = await this.prisma.Task.create({
                data: {
                    user_id: Number(userId),
                    task: task
                }
            });
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    };

    ///////////////////////////////////
    // データ編集
    // 
    // param: {id, user_id, task} 
    // return: {
    //     rtnFlg,
    //     data{[{task}]} or {err}
    // }
    ///////////////////////////////////
    editTask = async (id, userId, task) => {
        const results = {
            rtnFlg: false,
            data: null
        };
        try {
            results.data = await this.prisma.Task.update({
                where: {
                    id: Number(id),
                    user_id: Number(userId)
                },
                data: {
                    task: task
                }
            });
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    };
    
    ///////////////////////////////////
    // データ削除
    // 
    // param: {id, user_id, task} 
    // return: {
    //     rtnFlg,
    //     data{[{task}]} or {err}
    // }
    ///////////////////////////////////
    delTask = async (id, userId, task) => {
        const results = {
            rtnFlg: false,
            data: null
        };
        try {
            results.data = await this.prisma.Task.delete({
                where: {
                    id: Number(id),
                    user_id: Number(userId),
                    task: task
                }
            });
            results.rtnFlg = true;
            return results;
        }
        catch(err) {
            results.data = err;
            return results;
        }
    };

}

module.exports = Task;