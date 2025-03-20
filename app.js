const express=require('express');
const app=express();
const mongoose=require('mongoose');
const usermodel=require('./model/user');
const productmodel=require('./model/product');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',isLoggedIn(),async(req,res)=>{
    const userid=req.cookies.userid;
    const user=await usermodel.findById(userid).populate('products');
    res.render('home',{products:user.products,user:user});
    
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',async(req,res)=>{    
    const {username,email,password}=req.body;
    const user=new usermodel({
        name:username,
        email:email,
        password:password
    })
    await user.save()
    res.redirect('/');
})
app.get('/users',async(req,res)=>{
    const users=await usermodel.find();
    res.send(users);
})

app.get('/post',(req,res)=>{
    res.render('post');
})
app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/profile', isLoggedIn(), async (req, res) => {
    const userid = req.cookies.userid;

    try {
        // Populate the 'products' field
        const user = await usermodel.findById(userid).populate('products');

        // Ensure 'products' is defined
        const products = user ? user.products : [];

        // Log the products for debugging
        console.log('Products:', products);

        // Render the profile page with user and product data
        res.render('profile', { user: user, products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the profile.');
    }
});
app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const user=await usermodel.findOne({email:email,password:password});
    if(user){
        res.cookie('userid',user._id);
        res.redirect('/');
    }
    else{
      res.send('Invalid login details');
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('userid');
    res.redirect('/login');
});


app.post('/post', async (req, res) => {
    const userid = req.cookies.userid;
    const { prodname, price, category, description } = req.body;

    try {
        // Create a new product
        const product = new productmodel({
            name: prodname,
            price: price,
            userid: userid,
            category: category,
            description: description
        });

        // Save the product to the database
        await product.save();

        // Update the user's products array with the new product ID
        await usermodel.findByIdAndUpdate(
            userid,
            { $push: { products: product._id } }, // Add the product ID to the products array
            { new: true, useFindAndModify: false } // Return the updated document
        );

        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while creating the product.');
    }
});
function isLoggedIn( ){
    return (req,res,next)=>{
        if(req.cookies.userid){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
}



app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})