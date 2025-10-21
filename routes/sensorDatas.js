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

// Obter todos os Sensor Datas
router.get('/', [isAuthenticated], async function(req, res, next) {
  // Pro MongoDB, é como se o banco fosse uma coleção de objetos
  const { sensorId = ''} = req.query;
  console.log(req.query);
  // Parâmetro a ser enviado é a claúsula "Where", servindo de filtro
  return res.json(
    await SensorData.find({sensorId})); 
});

// -------------------------------------------------------

// Obter um Sensor Data por ID
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

//Criar um Sensor Data
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

//Atualizar um Sensor Data
router.put('/:id', isAuthenticated, (req, res) => {
  res.json({ message: "Atualizou uma sensorData"})
});

// -------------------------------

//Deletar um Sensor Data
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
  const response = await SensorData.deleteOne(_id);
  
  console.log(response);

  //Condição para testar o deletedCount
  if ((response.deletedCount) > 0){
    console.log("Registro "+id+" deletado!");
  } else {
    console.log("Não foi excluído nenhum registro!");
  }
  
});

module.exports = router;
