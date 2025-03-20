const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/practice5').then(()=>console.log("Connection Successful")).catch((err)=>console.log(err));

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    description: { type: String },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;