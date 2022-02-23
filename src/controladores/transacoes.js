let { banco, contas, saques, depositos, transferencias, } = require('../bancodedados');
const { format } = require('date-fns');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!numero_conta) {
        return res.status(400).json({
            mensagem: 'Informe o número da conta'
        });
    }
    if (!valor) {
        return res.status(400).json({
            mensagem: 'Informe o valor de deposito'
        });
    }

    const procurarConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta);
    })

    if (!procurarConta) {
        return res.status(404).json({
            mensagem: 'Não existe conta com o número informado.'
        });
    }

    if (Number(valor) <= 0 || Number(valor) !== Number(valor)) {
        return res.status(400).json({
            mensagem: 'Infome um valor de deposito válido'
        });
    }

    procurarConta.saldo = valor + procurarConta.saldo;
    const deposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    depositos.push(deposito);
    return res.status(201).json();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if (!numero_conta) {
        return res.status(400).json({
            mensagem: 'Informe o número da conta'
        });
    }
    if (!valor) {
        return res.status(400).json({
            mensagem: 'Informe o valor de saque'
        });
    }

    if (!senha) {
        return res.status(400).json({
            mensagem: 'Informe a senha da conta'
        });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({
            mensagem: 'O valor não pode ser menor que zero!'
        });
    }

    const procurarConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta);
    })

    if (!procurarConta) {
        return res.status(404).json({
            mensagem: 'Não existe conta com o número informado.'
        });
    }

    if (Number(procurarConta.usuario.senha) !== Number(senha)) {
        return res.status(403).json({
            mensagem: 'Senha incorreta'
        });
    }
    if (procurarConta.saldo - valor < 0) {
        return res.status(400).json({
            mensagem: 'Não há saldo suficiente para o saque'
        });
    }
    procurarConta.saldo -= valor;

    const saque = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    saques.push(saque)
    return res.status(204).json();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({
            mensagem: 'Informe o número da sua conta'
        });
    }
    if (!senha) {
        return res.status(400).json({
            mensagem: 'Informe a sua senha'
        });
    }
    if (!numero_conta_destino) {
        return res.status(400).json({
            mensagem: 'Informe o número da conta de destino'
        });
    }
    if (!valor) {
        return res.status(400).json({
            mensagem: 'Informe o valor da transferência'
        });
    }

    const procurarContaOrigem = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_origem);
    })

    if (!procurarContaOrigem) {
        return res.status(404).json({
            mensagem: 'Não existe conta com o número informado.'
        });
    }

    const procurarContaDestino = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_destino);
    })

    if (!procurarContaDestino) {
        return res.status(404).json({
            mensagem: 'A conta informada para a transferência não existe'
        });
    }

    if (Number(procurarContaOrigem.usuario.senha) !== Number(senha)) {
        return res.status(403).json({
            mensagem: 'Senha incorreta'
        });
    }

    if (numero_conta_origem === numero_conta_destino) {
        return res.status(400).json({
            mensagem: 'Não é possivel fazer transferência para a mesma conta.'
        })
    }

    if (procurarContaOrigem.saldo - valor < 0) {
        return res.status(400).json({
            mensagem: 'Não há saldo suficiente para transferência'
        });
    }

    procurarContaOrigem.saldo -= valor;
    procurarContaDestino.saldo += valor;

    const transferencia = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(transferencia);

    return res.status(204).json();
}

module.exports = {
    depositar,
    sacar,
    transferir
}