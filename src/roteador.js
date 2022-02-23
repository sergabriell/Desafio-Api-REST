const express = require('express');
const { listarContas, criarContaBancaria, atualizarUsuario, excluirConta, saldo, extrato } = require('./controladores/contas');
const { depositar, sacar, transferir } = require('./controladores/transacoes');
const { senhaBanco } = require('./intermediarios/senhabanco');
const { validarRequisicoes, verificarRepeticao } = require('./intermediarios/validacoes');

const rotas = express();

rotas.get('/contas', senhaBanco, listarContas);
rotas.post('/contas', validarRequisicoes, verificarRepeticao, criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', validarRequisicoes, verificarRepeticao, atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;