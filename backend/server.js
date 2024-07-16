const dotenv = require('dotenv');
dotenv.config({ path: "config.env" });

//uncaught error caught 
//console.log(youtube) //youtube not defined aise error ke lite
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log("Server closing down")
        process.exit(1)
});

const app = require('./app');

// Mongoose connection
const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL, {
  });
  console.log("database connected");
}

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});


// //unhandles promise rejection agr kuch server ke andr glt
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`)
    console.log("Server closing down")
    server.close(()=>{
        process.exit(1);
    });
});