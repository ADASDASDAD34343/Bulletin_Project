const express = require('express');
const app = express();
const port = 8080;
const { MongoClient } = require('mongodb');
const winston = require('winston');
const bodyParser = require('body-parser');

// Winston 로그 설정
const logOptions = {
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // 콘솔 출력
        new winston.transports.File({ filename: 'app.log' }) // 파일로 저장
    ]
};

const logger = winston.createLogger(logOptions);

// Console에 모든 로그 출력을 추가
console.log = (...args) => {
    logger.info(args.join(' '));
    // 원래 console.log를 유지하려면 아래 주석을 해제하세요.
    // originalConsoleLog(...args);
};

app.set('view engine', 'ejs');
app.use('/public', express.static('public/css'));
app.use('/yu', express.static('views/public/css'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info(`접속한 IP 주소: ${clientIp}`);
    next();
});

const url = 'mongodb+srv://wxcv3123:Cka9Ts6rg8ISgH9w@cluster0.x18a4ei.mongodb.net/?retryWrites=true&w=majority';

let db;

(async () => {
    try {
        const client = await MongoClient.connect(url);
        logger.info('DB 연결 성공');
        db = client.db('forum');
        
        app.listen(port, () => {
            logger.info(`http://localhost:${port} 에서 서버 실행 중`);
        });
    } catch (err) {
        logger.error('DB 연결 실패', err);
    }
})();

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html");
});

app.get('/list', async (req, res) => {
    try {
        const result = await db.collection('post').find().toArray();
        logger.info('데이터베이스에서 목록을 성공적으로 가져옴');
        res.render('list.ejs', { 글목록: result });
    } catch (err) {
        logger.error('데이터베이스에서 목록을 가져오는 중 오류 발생', err);
        res.status(500).send('서버 오류');
    }
});
app.get('/write',(req,res) =>{
  res.render('write.ejs')
})
app.get('/error',(req,res) =>{
    res.render('error.ejs')
  })
app.post('/add',async (요청,응답) =>{
  if (요청.body.title == '') {
    return 응답.redirect('/error');
  } else {
    await db.collection('post').insertOne({ title : 요청.body.title, content : 요청.body.content })
    응답.redirect('/list') 
  }
})