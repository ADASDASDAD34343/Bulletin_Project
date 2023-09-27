const express = require('express')
const app = express()
port=8080;
app.listen(port,() => {
    console.log(`http://localhost:${port} 에서 서버 실행중`)
})
app.get('/',(요청, 응답) =>{
    응답.send('반갑습니다')
})