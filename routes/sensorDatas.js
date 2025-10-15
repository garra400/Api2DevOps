// ----- Importação de bibliotecas
var express = require('express');
const SensorData = require("../models/SensorData.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { default: mongoose } = require('mongoose');
var router = express.Router();


// -------------------------------------------------------

// ----- Definição de variáveis e constantes
const sensorDatas = []; // Array de usuários ("Banco de dados");

// -------------------------------------------------------

// -----  Criação das rotas / Definição dos Endpoints

// Obter todos os usuários ou por nome
router.get('/', [isAuthenticated], async function(req, res, next) {
  // Pro MongoDB, é como se o banco fosse uma coleção de objetos
  const { name = ''} = req.query;
  console.log(req.query);
  // Parâmetro a ser enviado é a claúsula "Where", servindo de filtro
  return res.json(
    await SensorData.find({name: { $regex: '.*' + name + '.*' } })); 
});

// Obter um usuário por ID
//(params) => {instruções que precisam ser executas} // Arrow Function
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  console.log(req.query);

  let _id = null;

  try {
    _id = new mongoose.Types.ObjectId(id);
  } catch(error) {
    return res.status(400).json({message: "ID inválido"});
  }

  const sensorData = await SensorData.findById(id);
  return sensorData 
    ? res.json(sensorData)
    : res.status(404).json({ message: "SensorData não ecxiste!!" });
});

// -------------------------------

//Criar um usuário
router.post('/', async (req, res) => {
  // Obter o JSON vindo pelo Body da requisição HTTP
  const json = req.body;

  //Adicionar ao banco de dados
  //sensorDatas.push(sensorData);
  const sensorData = new SensorData(json);

  console.log("SensorData: ", sensorData);

  const hasErros = sensorData.validateSync(); // Faz validação 

  return hasErros 
    ? res.status(400).json(hasErros) // Envia a resp. com os erros
    : res.json(await sensorData.save()); // Salva o usuário e envia a resposta
});

// -------------------------------

//Atualizar um usuário
router.put('/:id', isAuthenticated, (req, res) => {
  res.json({ message: "Atualizou uma sensorData"})
});

// -------------------------------

//Deletar um usuário
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  console.log(req.query);

  let _id = null;

  try {
    _id = new mongoose.Types.ObjectId(id);
  } catch(error) {
    return res.status(400).json({message: "ID inválido"});
  }
  
  //res.json({ message: "Deletou uma sensorData"})
  await SensorData.delete(_id);

});

module.exports = router;
