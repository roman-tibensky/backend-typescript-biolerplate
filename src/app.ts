/**
 * Created by aRTie on 21/08/2017.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bodyparser = require('body-parser');

const messages= [
    {
        updateBy: 'nobody',
        text: 'nothing is working now'
    },
    {
        updateBy: 'nobody',
        text: 'nope, still nothing is working'
    }
];

const users: any[] = [{
    user: 'doop',
    email: 'noop',
    pass: 'coop'
}];

app.use(bodyparser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    next();
});

const api = express.Router();
const auth = express.Router();

api.get('/', (req, res) => {
    res.send('sup homie');
});

api.get('/release', (req, res) => {
    res.json(messages);
});

api.get('/release/:user', (req, res) => {
    const result = messages.filter(oneUpdate => oneUpdate.updateBy === req.params.user)
    res.json(result);
});

api.post('/oneupdate', (req, res) => {
    console.log(req.body);
    messages.push(req.body.oneMessage);
    res.json(req.body.oneMessage);
});

api.get('/current-user', isAuthenticated ,(req, res) => {
    console.log(req.userId);
    res.json(users[req.userId]);
})

api.post('/current-user', isAuthenticated ,(req, res) => {
    const user: any= users[req.userId];

    user.firstName= req.body.firstName;
    user.lastName= req.body.lastName;
    res.json(user);
})


auth.post('/register', (req, res) =>{
    const index = users.push(req.body) -1;
    users[index].id = index;
    // const tuhken =jwt.sign(users[index].id,'123'); // ->never hardcode this stuff
    // console.log(tuhken);
    res.json({user:users[index].user, tuhken: sendToken(users[index])});


});

auth.post('/login', (reg,res)=>{
    const foundUser = users.find(oneUser => (oneUser.user === reg.body.user && oneUser.pass === reg.body.pass));

    if(!foundUser) {
        return res.json({success: false})
    } else {
        return res.json({success: true, user: foundUser.user, tuhken: sendToken(foundUser)})
    }
})

function sendToken(user) {
    return jwt.sign(user.id, 'imastand1nkey')
}

function isAuthenticated(req, res, next) {
    if(!req.header('authorization')){
        return res.status(401).send({success: false, message:'Unauthorised access: no header'})
    }

    const token = req.header('authorization').split(' ')[1];

    const payload = jwt.decode(token, 'imastand1nkey');

    if(!payload){
        return res.status(401).send({success: false, message:'Unauthorised access: header invalid'})
    }

    req.userId = payload;

    next();
}


app.use('/api', api);
app.use('/auth', auth);

app.listen(8888, ()=>{
    console.log('okay, we in homie')
});
