const express = require('express')
const app = express()
const dist = require('./dictionary.json')

// app.get('/test', (req,res) => {
//     console.log(req.url)
//     res.send('good')
// })

let
    result = [],
    keysArr = [],
    flag = 0
dist.forEach(obj => {
    keysArr.push(Object.keys(obj)[0])
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

app.get('/search', (req, res) => {
    result = []
    req.query.searchContent.forEach(val => {
        if (val) {    //过滤空格
            handleData(val)
        }
    })
    flag === 1 ? res.send(result) : res.send('Not Found!')
})

app.use(express.static(require('path').join(__dirname, '.')))
app.listen(8888, () => {
    console.log('8888 started...')
})
