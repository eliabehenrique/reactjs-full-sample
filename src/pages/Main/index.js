import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner, FaTimes, FaEye } from 'react-icons/fa';

import api from '../../services/api';

import { Container, Form, SubmitButton, List, ActionList } from './styles';

export default class Main extends Component {
  state = {
    newRepo: 'rocketseat/unform',
    repositories: [],
    onload: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) this.setState({ repositories: JSON.parse(repositories) });
  }

  // _ = props
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories)
      localStorage.setItem('repositories', JSON.stringify(repositories));
  }

  // Functions
  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  // Actions
  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ onload: true });
    const { newRepo, repositories } = this.state;

    try {
      const response = await api.get(`/repos/${newRepo}`);

      const existsRepo = repositories.findIndex(
        repo => repo.name === response.data.full_name
      );

      if (existsRepo !== -1) {
        alert('Este repositório já está cadastrado');
        return;
      }

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
      });
    } catch (err) {
      alert('not found');
      console.log(`eee:${err}`);
    } finally {
      this.setState({ newRepo: '', onload: false });
    }
  };

  handleDelete = repository => {
    const { repositories } = this.state;

    const index = repositories.findIndex(repo => repo.name === repository.name);

    repositories.splice(index, 1);
  };

  render() {
    const { newRepo, onload, repositories } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton onload={onload}>
            {onload ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>

              <ActionList>
                <a href="#" onClick={() => this.handleDelete(repository)}>
                  <FaTimes color="#700" size={14} />
                </a>
                <a href="/" tooltip="Detalhes">
                  <FaEye color="#75B" size={14} />
                </a>
              </ActionList>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
