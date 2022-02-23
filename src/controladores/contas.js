let { banco, contas, saques, depositos, transferencias, } = require('../bancodedados');
const { format } = require('date-fns');

let numeroConta = 1;

const listarContas = (req, res) => {
    return res.status(200).json(contas);
}

const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const objetoConta = {
        numero: numeroConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    contas.push(objetoConta);
    return res.status(201).json();
}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (Number(numeroConta) !== Number(numeroConta)) {
        return res.status(400).json({
            mensagem: 'Informe um número de conta válido.'
        })
    }

    const procurarConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numeroConta);
    })

    if (!procurarConta) {
        return res.status(404).json({
            mensagem: 'Não existe conta com o número informado.'
        })
    }

    procurarConta.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    return res.status(204).json();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    if (Number(numeroConta) !== Number(numeroConta)) {
        return res.status(400).json({
            mensagem: 'Informe um número de conta válido.'
        })
    }

    const procurarConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numeroConta);
    })

    if (!procurarConta) {
        return res.status(404).json({
            mensagem: 'Não existe conta com o número informado.'
        })
    }

    if (procurarConta.saldo !== 0) {
        return res.status(400).json({
            mensagem: 'A conta só pode ser removida se o saldo for zero!'
        });
    }
    const indiceConta = contas.indexOf(procurarConta);
    contas.splice(indiceConta, 1);

    return res.status(204).json();
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({
            mensagem: 'Informe o número da conta'
        });
    }
    if (!senha) {
        return res.status(400).json({
            mensagem: 'Informe a senha'
        });
    }

    const procurarConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta);
    })

    if (!procurarConta) {
        return res.status(404).json({
            mensagem: 'Conta bancária não encontrada!'
        });
    }

    if (Number(procurarConta.usuario.senha) !== Number(senha)) {
        return res.status(403).json({
            mensagem: 'Senha incorreta'
        });
    }

    const mostrarSaldo = {
        saldo: procurarConta.saldo
    }
    return res.status(200).json(mostrarSaldo);
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({
            mensagem: 'Informe o número da conta'
        });
    }
    if (!senha) {
        return res.status(400).json({
            mensagem: 'Informe a senha'
        });
    }

    const procurarConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta);
    })

    if (!procurarConta) {
        return res.status(404).json({
            mensagem: 'Conta bancária não encontrada!'
        });
    }

    if (Number(procurarConta.usuario.senha) !== Number(senha)) {
        return res.status(403).json({
            mensagem: 'Senha incorreta'
        });
    }

    const procurarDepositos = depositos.filter((numero) => {
        return numero.numero_conta === numero_conta;
    });

    const procurarSaques = saques.filter((numero) => {
        return numero.numero_conta === numero_conta;
    });

    const procurarTransferenciaEnviada = transferencias.filter((numero) => {
        return numero.numero_conta_origem === numero_conta;
    })

    const procurarTransferenciaRecebia = transferencias.filter((numero) => {
        return numero.numero_conta_destino === numero_conta;
    })

    const objExtrato = {
        depositos: procurarDepositos,
        saques: procurarSaques,
        transferenciasEnviadas: procurarTransferenciaEnviada,
        transferenciasRecebidas: procurarTransferenciaRecebia
    }
    res.status(200).json(objExtrato);
}

module.exports = {
    listarContas,
    criarContaBancaria,
    atualizarUsuario,
    excluirConta,
    saldo,
    extrato
}