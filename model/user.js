const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/practice5').then(()=>{
    console.log('Connection successful');
}
).catch((e)=>{
    console.log("No connection");
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Reference to Product model
});

const User = mongoose.model('User', userSchema);
module.exports = User;