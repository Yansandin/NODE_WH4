const express = require('express');
const joi = require('joi');
const fs = require('fs');

const app = express();

app.use(express.json())
const usersFilePath = './users.json';

const users = [];

let usersID = 0;

const readUsersFromFile = () => {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    }
    return [];
};

const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};





const userSchema = joi.object({
    firstName: joi.string().min(3).required(),
    secondName: joi.string().min(3).required(),
    age: joi.number().min(0).max(100).required(),
    city: joi.string().min(1),
})
app.get('/users',(req,res) =>{
    res.send({users});
});

app.get('/users/:id',(req,res) =>{
    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);

    if(user) {
        res.send({ user })
    } else {
        res.status(404);
        res.send({user:null})
    }
});


app.post('/users',(req,res) =>{
    usersID+=1;
    users.push({
        id: usersID,
        ...req.body
    });
    res.send({id:usersID});
});

app.put('/users/:id',(req,res) =>{
    const result = userSchema.validate(req.body);
    if(result.error) {
        return res.status(404).send({error: result.error.details});
    }
    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);

    if(user) {
        const { firstName,secondName, age, city} = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.age = age;
        user.city = city;
        res.send({ user })
    } else {
        res.status(404);
        res.send({user:null})
    }
});


app.delete('/users/:id',(req,res) =>{
    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);

    if(user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex,1);
        res.send({ user })
    } else {
        res.status(404);
        res.send({user:null})
    }
});

app.listen(3000);