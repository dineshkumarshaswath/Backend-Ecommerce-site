
const app=require("./app")

const dbConnection = require("./dbconnect")
const path=require('path')


//dotenv.config()


const PORT= process.env.PORT
const dev=process.env.NODE_ENV

dbConnection()

app.get("/",(req,res)=>{
  return res.send('server condition is  fine')
})


  const server = app.listen(PORT,()=>{
    console.log(`server listening to the localhost:${PORT} in ${dev}`)
} )

process.on('unhandledRejection',(err)=>{
   console.log(`error: ${err.message}`);
   console.log('shutting down the server due to unhandled rejection')
   server.close(()=>{
    process.exit(1)
   })
})



process.on('uncaughtException',(err)=>{
    console.log(`error: ${err.message}`);
    console.log('shutting down the server due to uncaught Exception ')
    server.close(()=>{
     process.exit(1)
    })
   })

 