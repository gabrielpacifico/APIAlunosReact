import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import logoCadastro from './assets/register.jpg';

function App() {
    
    const baseUrl = "https://localhost:44384/api/alunos";

    
    const [data, setData] = useState([]);
    const [modalIncluir, setModalIncluir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [updateData, setUpdateData] = useState(true);
    
    const [alunoSelecionado, setAlunoSelectionado] = useState({
      id: '',
      nome: '',
      email: '',
      idade: ''
    })

    const selecionarAluno = (aluno, opcao) => {
      setAlunoSelectionado(aluno);
      (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();
    }
    
    const abrirFecharModalEditar =()=> {
      setModalEditar(!modalEditar);
    }

    const abrirFecharModalIncluir =()=> {
      setModalIncluir(!modalIncluir);
    }

    const abrirFecharModalExcluir =()=> {
      setModalExcluir(!modalExcluir);
    }
    
    // Request GET (todos os dados do banco de dados)
    const requestGet = async()=>{
      await axios.get(baseUrl)
      .then(response=>{
        setData(response.data);
      }).catch(error=>{
        console.error(error);
      })
    }

    useEffect(()=> {
      if(updateData){
        requestGet();
        setUpdateData(false);
      }
    }, [updateData])

    const handleChange = e =>{
      const {name, value} = e.target;
      setAlunoSelectionado({
        ...alunoSelecionado, [name]:value
      });
      console.log(alunoSelecionado);
    }
    
    // Request POST modal
    const requestPost= async() => {
      delete alunoSelecionado.id;
      alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
      await axios.post(baseUrl, alunoSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
    }

    // Request PUT
    const requestPut = async() => {
      alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
      await axios.put(baseUrl + "/" + alunoSelecionado.id, alunoSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAux = data;
        dadosAux.map(aluno => {
          if(aluno.id === alunoSelecionado.id){
            aluno.nome = resposta.nome;
            aluno.email = resposta.email;
            aluno.idade = resposta.idade;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
    }

    // Request DELETE
    const requestDelete = async() => {
      await axios.delete(baseUrl + "/" + alunoSelecionado.id)
      .then(response=> {
        setData(data.filter(aluno => aluno.id !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
    }

  return (

    <div className="App">
      <h3 className="titulo">Cadastro de Alunos</h3>
      <img src={logoCadastro} className="img-cadastro"></img>
        <button className="btn btn-success mb-5 mt-5" id="btn-cadastro" onClick={() => abrirFecharModalIncluir()}>Adicionar novo aluno</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(aluno=>(
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className="btn btn-primary" id='btn-edit' onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button>
                <button className="btn btn-danger" id='btn-remove' onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader> Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> Nome: </label>
            <br/>
            <input type="text" className="form-control" autoComplete="off" name="nome" onChange={handleChange}/>
            <br/>
            <label> Email: </label>
            <br/>
            <input type="text" className="form-control" autoComplete="off" name="email" onChange={handleChange}/>
            <br/>
            <label> Idade: </label>
            <br/>
            <input type="number" className="form-control" autoComplete="off" name="idade" onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary"onClick={() => requestPost()}>Adicionar</button>
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="number" className="form-control" readOnly value={alunoSelecionado && alunoSelecionado.id}/>
            <br/>
            <label> Nome: </label>
            <br/>
            <input type="text" className="form-control" name="nome" autoComplete="off" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.nome}/>
            <br/>
            <label> Email: </label>
            <br/>
            <input type="text" className="form-control" name="email" autoComplete="off" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.email}/>
            <br/>
            <label> Idade: </label>
            <br/>
            <input type="number" className="form-control" name="idade" autoComplete="off" onChange={handleChange} value={alunoSelecionado && alunoSelecionado.idade}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => requestPut()}>Editar</button>
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a): {alunoSelecionado && alunoSelecionado.nome}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => requestDelete()}>Sim</button>
          <button className="btn btn-primary" onClick={() => abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>

    </div>

  );
}

export default App;
