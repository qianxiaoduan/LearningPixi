const uuid = require('uuid')
const db = require('./sequelize');
const Op = db.Op

global.uuid = uuid
global.db = db
global.Op = Op

global.where = function (data) {
    let where = {}
    let ignoreArr = ['_t', 'column', 'order', 'limit', 'offset']
    for (let i in data) {
        if (ignoreArr.indexOf(i) == -1) {
            if (/^%.*%$/.test(data[i])) {
                where[i] = {
                    [Op.like]: data[i]
                }
            } else {
                where[i] = data[i]
            }
        }
    }
    return where
}

//树的封装
global.getmenu = (pid, arr, res) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].parentId == pid || (pid == '' && arr[i].parentId == null)) {
            res.push({
                ...arr[i],
                title: arr[i].name,
                value: arr[i].id,
                key: arr[i].id,
                route: arr[i].url
            })
            arr.splice(i, 1)
            i--
        }
    }
    res.map(r => {
        r.children = []
        getmenu(r.id, arr, r.children)
        if (r.children.length == 0) {
            delete r.children
        }
    })
    return res
}