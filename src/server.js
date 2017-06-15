const express = require('express')
const app = express()
const dist = require('./dictionary.json')
const request = require('request')

let
    promiseArr = [],
    responseArr = []
app.get('/queryData', (req, res) => {
    let keyWordsArr = req.query.keyWords
    keyWordsArr.forEach(keyword => {
        let url = `http://api.tmkoo.com/search.php?keyword=${keyword}&apiKey=4399320012393234&apiPassword=331nd3342d&pageSize=30&pageNo=1`
        promiseArr.push(new Promise((resolve, reject) => {
            request(encodeURI(url), (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    responseArr.push(body)
                    resolve()
                }
            })
        }))
    })
    Promise.all(promiseArr).then(() => {
        console.log(responseArr)
        res.send(responseArr)
    }).catch((err) => {
        console.log(err)
        res.send('error')
    })
})


let
    result = [],
    keysArr = [],
    flag = 0
dist.forEach(obj => {
    keysArr.push(Object.keys(obj)[0])
})

app.get('/search', (req, res) => {
    result = []
    req.query.searchContent.forEach(val => {
        if (val) { //过滤空格
            handleData(val)
        }
    })
    flag === 1 ? res.send(result) : res.send('0')
})

function handleData(inputVal) {
    for (let i = 0; i < keysArr.length; i++) {
        let key = keysArr[i]
        if (inputVal === key) {
            for (let j = 0; j < dist.length; j++) {
                if (dist[j][key]) {
                    let tempObj = {}
                    tempObj.key = key
                    tempObj.value = dist[j][key]
                    result.push(tempObj)
                    flag = 1
                    break
                }
            }
            if (flag === 1) {
                break
            }
        } else {
            flag = 0
        }
    }
}

app.use(express.static(require('path').join(__dirname, '.')))
app.listen(8888, () => {
    console.log('8888 started...')
})
