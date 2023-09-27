const express = require('express')
const app = express()
port=8080;

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs')

const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://wxcv3123:Cka9Ts6rg8ISgH9w@cluster0.x18a4ei.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(port,() => {
    console.log(`http://localhost:${port} 에서 서버 실행중`)
})
}).catch((err)=>{
  console.log(err)
})

app.get('/',(요청, 응답) =>{
    응답.sendFile(__dirname+"/public/html/index.html")
})
app.get('/list', async (요청, 응답) => {
   let result = await db.collection('post').find().toArray()
   console.log(result[0].title)
    응답.send('안녕')
  })
