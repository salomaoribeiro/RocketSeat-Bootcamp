const express = require('express');

const server = express();

server.use(express.json());

// Middleware
server.use((req, res, next) => {
  console.log(`Método: ${req.method} \nURL: ${req.url}`)

  // return next() para continuar o fluxo.
  return next();
});

function CheckUserExists(req, res, next) {
  if(!req.body.nome) 
    return res.status(400).json({error: "Usuário não encontrado no body"});
  
  return next();
}

function UsuarioExiste(req, res, next) {
  const usuario = usuarios[req.params.id];
  
  if (!usuario)
    return res.status(400).json({error: "Id não corresponde a nenhum usuário"})
  
  req.usuario = usuario;
  return next();
}

// Tipos de parâmetros
// Query params = /teste?nome=salomao
// Route params = /user/1
// Request body = {"name" = "salomao", "email" : "salomao@se.pa" }

var usuarios = ["salomao", "Kalleb", "Stefanie"];

server.get('/users', (req, res) => {
  res.json(usuarios);
});

server.get('/users/:id', UsuarioExiste, (req, res) => {
//return res.send("Tudo funcionando");
// Query params
//const parametro = req.query.nome;
//return res.json({message: 'Tudo funcionando ' + parametro});

  // Route Params
  //const nome = req.params.nome;
  //const { id } = req.params;
  res.json({usuario: `${req.usuario}`});  
})

server.post('/users', CheckUserExists, (req, res) => {
  const { nome } = req.body;
  usuarios.push(nome);
  res.json(usuarios);
});

server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  
  usuarios[id] = nome;
  res.json(usuarios);
});

server.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  usuarios.splice(id, 1);
  res.json(usuarios);
});

server.listen(3000)

