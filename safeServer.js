/*
此為相對安全的 server 範例，
除了將 cookie 的 value 加密，
login 時將獲得一個 session，並在登出時移除
 */
const express = require('express')
const { createReadStream } = require('fs')
/*
上面那行也可以用以下兩行寫法
const fs = require('fs')
const createReadStream = fs.createReadStream
 */

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const COOKIE_SECRET = '11212sjsgsfgsf'
const USERS = {
    john: '123',
    max: '456'
}
const BALANCES = {
    john: 2323233,
    max: 434,
}
const SESSTIONS = {}
let nextSessionID = 0

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser(COOKIE_SECRET))

app.get('/', (req, res) => {
    const { sessionID } = req.signedCookies
    /*
    如果當初setting 的 cookie 沒有 sign 過，用以下attribute 取值
    const { sessionID } = req.cookies
     */
    const username = SESSTIONS[sessionID]
    if (username){
        res.send(`Hi ${username} 👀😳🤪, Your balance is ${BALANCES[username]}  <a href='/logout'>Logout</a>`)
    } else {
        createReadStream("./templates/index.html").pipe(res)  // 直接丟，比較快，不用浪費記憶體
    }
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (USERS[username] === password) {
        // res.send("WOW You Good 🤪🤪🤪")
        res.cookie('sessionID', nextSessionID, { signed: true })
        SESSTIONS[nextSessionID] = username
        nextSessionID += 1
        res.redirect('/')
    } else {
        res.send("你媽知道你在幹嘛嗎🤬🤬🤬🤬")
    }

})

app.get('/logout', (req, res) =>{ 
    const { sessionID } = req.signedCookies
    /*
    如果當初setting 的 cookie 沒有 sign 過，用以下attribute 取值
    const { sessionID } = req.cookies
     */
    delete SESSTIONS[sessionID]
    res.clearCookie('sessionID')
    res.redirect('/')
})

app.listen(4000)