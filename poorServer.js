/*
此為不安全的 server 範例，
只要在 Application/Cookies 裡，
更改 username 的 Value，就能看到其他用戶的資訊 
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

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.get('/', (req, res) => {
    const { username } = req.cookies
    if (username){
        res.send(`Hi ${username} 👀😳🤪, Your balance is ${BALANCES[username]} ʕ•ᴥ•ʔ <a href='/logout'>Logout</a>`)
    } else {
        createReadStream("./templates/index.html").pipe(res)  // 直接丟，比較快，不用浪費記憶體
    }
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (USERS[username] === password) {
        // res.send("WOW You Good 🤪🤪🤪")
        res.cookie('username', username)
        res.redirect('/')
    } else {
        res.send("你媽知道你在幹嘛嗎🤬🤬🤬🤬")
    }

})

app.get('/logout', (req, res) =>{
    res.clearCookie('username')
    res.redirect('/')
})

app.listen(4000)