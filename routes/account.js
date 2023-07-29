import Router from 'express';


const account = Router();

//path to asign to /account 

// requires session setup and authentication action
account.post('/login', (req, res, next)=>{
    res.send("action on login");
});

// adding user to database
account.post('/register', (req, res, next)=>{
    res.send("post action on submit");
})

account.get('/auth', (req, res, next)=>{
    res.send("auth for redirect session callback");
});

//get account details
account.get('/', (req, res, next)=>{
    res.send("user account page");
});

account.put('/edit', (req, res, next)=>{
    res.send("update details /account/edit");
});

account.delete('/delete', (req, res, next)=>{
    res.send("soft delete account/edit/delete")
})


export default account;

