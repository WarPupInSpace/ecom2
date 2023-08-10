import mongoose from 'mongoose';

//dbconn
const MONGO_DB_ID = 'mongodb://127.0.0.1/ecom2';

const conn = mongoose.connect(MONGO_DB_ID,
    {
        useNewUrlParser: true,
        socketTimeoutMS: 1000,
    }
);

mongoose.connection.on("error", console.error.bind(console, "connection error: "))
mongoose.connection.once("open", function () {
    console.log("Connected successfully");
});
mongoose.connection.on('closed', function () {
    console.log("connection closed");
})

export default conn;