const crud = require("../crud");
const nomeTabela = "Products";

// import fetch from 'node-fetch';

//1 - receber dados: Name, Price
//2 - verificar campo Name
//3 - verificar campo Price
//4 - Retornar um erro caso não atenda as condições
//5 - Cadastrar Produto
//6 - Retornar o sucesso do cadastro


async function cadastrarProduct(dados = { name: "", price: 0, description: "", userCPF: "", userPassword: ""}) {
    if (!dados.name) {
        return {
            error: "0001", message: "É necessario preencher os parâmetros da requisição!",
            camposNecessarios: ["name"]
        }
    }
    if (!dados.description) {
        return {
            error: "0001", message: "É necessario preencher os parâmetros da requisição!",
            camposNecessarios: ["description"]
        }
    }
    if (!dados.userCPF) {
        return {
            error: "0001", message: "É necessario preencher os parâmetros da requisição!",
            camposNecessarios: ["User"]
        }
    }
    if (!dados.userPassword) {
        return {
            error: "0001", message: "É necessario preencher os parâmetros da requisição!",
            camposNecessarios: ["Senha"]
        }
    }
    if (!dados.price || !(dados.price > 0)) {
        return {
            error: "0001", message: "É necessario preencher os parâmetros da requisição!",
            camposNecessarios: ["Price"]
        }
    }
    if (typeof (dados.price) != "number") {
        return {
            error: "0002", message: "O Tipo de dado passado não corresponde ao esperado!",
            tipoDeDado: typeof dados.price, tipoEsperado: "number"
        }
    }

    const login = await verificarLogin(dados.userCPF, dados.userPassword);
    delete dados.userPassword
    if (login) {
        const Product = await crud.save(nomeTabela, undefined, dados);
        return Product;
    } else {
        return "Usuario não cadastrado"
    }
}

async function verificarLogin(userCPF, userPassword) {
    const body = { CPF: userCPF, Password: userPassword };

    const fetch = require('node-fetch');
    const response = await fetch('http://destino:3000/api/Users', {
        method: 'put',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log(data)

    return data;
}

async function buscarProduct() {
    const dados = await crud.get(nomeTabela);
    return dados;
}

async function removerProduct(id) {
    const dados = await crud.remove(nomeTabela, id);
    return dados;
}

async function buscarProductId(id) {
    const dados = await crud.getById(nomeTabela, id);
    return dados;
}

async function trocarProduct(id, dado) {
    const dados = await crud.remove(nomeTabela, id);
    const dadosNovos = await crud.save(nomeTabela, id, dado);
    return dadosNovos;
}


module.exports = {
    cadastrarProduct,
    buscarProduct,
    removerProduct,
    buscarProductId,
    trocarProduct
}