const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./modules/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/asdF', 
	{
	 useNewUrlParser: true,
	 useUnifiedTopology: true,

	})
.then(()=>{
	console.log('connected');
	})
.catch((e)=>{
	console.log("Something went wrong", e);
	})

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }));
app.use(session({secret:'blahblah'}));

const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/signin')
    }else
        next();
}

app.get('/profile', requireLogin, (req, res) => {
    res.render('profile')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/signout', (req, res) => {
    res.render('signout')
})

app.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        email,
        password:hash
    })
    await user.save()
    res.redirect('/signin')
    
})

app.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    const user = await User({email, password});
    // console.log(user);
    if(! user){ /// checks if email is not avalible in the DB (null)
        // console.log(user);
        return res.send('sorry ...');
    }
    const validPw = await bcrypt.compare(password, user.password);
    if(! user){
        return res.send('sorry')
    } else {
        req.session.user_id = user._id;
        // res.send(req.session.user_id)
        res.redirect('/profile')
    }
})

app.post('/signout', (req, res) => {
    // req.session.user_id = null;
    req.session.destroy();
    res.redirect('/signin')
})
app.listen(3000)