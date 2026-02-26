const mongoose = require('mongoose');

const database =  () => {

    mongoose.connect(process.env.MONGODB_URI,)
    .then(() => {
        console.log('MongoDB connected successfully');}
    ).catch((err) => {
            console.log('Error connactind to MongoDB',err);
        }
    )

} 

module.exports = database;