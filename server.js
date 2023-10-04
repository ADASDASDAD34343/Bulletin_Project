const express = require('express')
const app = express()
port=8080;



app.set('view engine','ejs')
app.use('/public', express.static('public/css'));
app.use('/yu', express.static('views/public/css'));

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
    응답.render('list.ejs',{글목록 :result })
  })


  const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

logger.log('info', '정보 로그 메시지');
logger.error('에러 로그 메시지');
