'use strict';
const express = require('express'); 
const server = express();
const cors = require('cors');
server.use(cors());
require('dotenv').config();
const axios = require('axios');
server.use(express.json());
const PORT=process.env.PORT || 3020;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pokemon', {useNewUrlParser: true, useUnifiedTopology: true});

//create schema
const pokemonSchema = new mongoose.Schema({
    name: String,
    url:String,
  });

//create a model
const pokemonModel = mongoose.model('poke', pokemonSchema);


//http://localhost:3010/home
server.get('/home',homeHandler);

//http://localhost:3010/getAll
server.get('/getAll',getAllHandler);

//http://localhost:3010/addToFav
server.post('/addToFav',addToFavHandler);


//http://localhost:3010/getFav
server.get('/getFav',getFavHandler);


//http://localhost:3010/delete
server.delete('/delete',deleteHandler)


//http://localhost:3010/updatePokemon
server.put('/updatePokemon',updatePokemonHandler)



function homeHandler(req,res){
    res.send('hello from home')
}

function getAllHandler (req,res){
    let url='https://pokeapi.co/api/v2/pokemon';
    axios.get(url).then((result)=>{
        res.send(result.data.results);
    })
}

function addToFavHandler (req,res){
    const {name,url}=req.body;
    // console.log(name,"**",url);
    const favpokemon =new pokemonModel({
        name:name,
        url:url,
    });
    favpokemon.save();
}


function getFavHandler (req,res){
    pokemonModel.find({},(err,pkoedata)=>{
        res.send(pkoedata);
    });
}

function deleteHandler (req,res){
    const id=req.query.id;
    console.log(id);
    pokemonModel.deleteOne({_id:id},(err,pokedata)=>{
        pokemonModel.find({},(err,pkoedata)=>{
            res.send(pkoedata);
        });
    })
}

function updatePokemonHandler (req,res){
    const {name,url,id}=req.body;
    console.log(name,"//",id);

    pokemonModel.findOne({_id:id},(err,pokedata)=>{
        pokedata.name=name;
        pokedata.url=url;
        pokedata.save().then(()=>{
            pokemonModel.find({},(err,pkoedata)=>{
                res.send(pkoedata);
            });
        })
    })
}

server.listen(PORT,()=>{
    console.log(`listing on PORT:${PORT}`);
});

// pokemonModel.find({},(errdata)){
//     res.send(data);
// };