let { contas } = require('../bancodedados');

const validarRequisicoes = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({
            mensagem: 'Informe o nome'
        })
    }
    if (!cpf) {
        return res.status(400).json({
            mensagem: 'Informe o cpf'
        })
    }
    if (!data_nascimento) {
        return res.status(400).json({
            mensagem: 'Informe a data de nascimento'
        })
    }
    if (!telefone) {
        return res.status(400).json({
            mensagem: 'Informe o telefone'
        })
    }
    if (!email) {
        return res.status(400).json({
            mensagem: 'Informe o email'
        })
    }
    if (!senha) {
        return res.status(400).json({
            mensagem: 'Informe a senha'
        })
    }
    next();
}

const verificarRepeticao = (req, res, next) => {
    const { cpf, email } = req.body;

    const verificarCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });
    const verificarEmail = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (verificarCpf) {
        return res.status(400).json({
            mensagem: 'Já existe uma conta com o cpf informado!'
        });
    }
    if (verificarEmail) {
        return res.status(400).json({
            mensagem: 'Já existe uma conta com o email informado!'
        });
    }
    next();
}

module.exports = {
    validarRequisicoes,
    verificarRepeticao
}