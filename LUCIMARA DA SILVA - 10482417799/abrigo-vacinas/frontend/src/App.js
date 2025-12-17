import React, { useEffect, useState } from 'react';
import { FaSyringe } from 'react-icons/fa';
import { FiSearch, FiSave, FiList, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './App.css';

function App() {
  const [vacinas, setVacinas] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [busca, setBusca] = useState('');
  const [editId, setEditId] = useState(null);

  // Carregar vacinas do backend
  const carregarVacinas = async () => {
    try {
      const res = await fetch('http://localhost:3001/vacinas');
      if (!res.ok) throw new Error('Falha ao buscar vacinas');
      const data = await res.json();
      setVacinas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar vacinas:', err);
      setVacinas([]);
    }
  };

  useEffect(() => {
    carregarVacinas();
  }, []);

  // Salvar (POST) ou Atualizar (PUT)
  const salvarVacina = async (e) => {
    e.preventDefault();
    const codigoTrim = codigo.trim();
    const nomeTrim = nome.trim();
    if (!codigoTrim || !nomeTrim) {
      alert('Preencha código e nome da vacina.');
      return;
    }

    try {
      const url = editId
        ? `http://localhost:3001/vacinas/${editId}`
        : 'http://localhost:3001/vacinas';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoTrim, nome: nomeTrim })
      });

      if (!res.ok) throw new Error(editId ? 'Falha ao atualizar' : 'Falha ao salvar');

      alert(editId ? 'Vacina atualizada com sucesso!' : 'Vacina cadastrada com sucesso!');
      setCodigo('');
      setNome('');
      setEditId(null);
      carregarVacinas();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar/atualizar vacina.');
    }
  };

  // Excluir
  const excluirVacina = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir esta vacina?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/vacinas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      alert('Vacina excluída com sucesso!');
      carregarVacinas();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir vacina.');
    }
  };

  // Editar (preenche o formulário; o PUT acontece no salvarVacina)
  const editarVacina = (vacina) => {
    setEditId(vacina.id);
    setCodigo(vacina.codigo || '');
    setNome(vacina.nome || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditId(null);
    setCodigo('');
    setNome('');
  };

  // Filtrar
  const vacinasFiltradas = vacinas.filter((v) => {
    const b = busca.toLowerCase();
    return (
      (v.codigo || '').toLowerCase().includes(b) ||
      (v.nome || '').toLowerCase().includes(b)
    );
  });

  return (
    <div className="page">
      <header className="header">
        <div className="header-title">
          <FaSyringe className="icon-xl" />
          <div>
            <h1>Cadastro de Vacinas</h1>
            <p>Buscar, cadastrar e visualizar vacinas</p>
          </div>
        </div>

        <div className="search">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Buscar por código ou nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </header>

      <main className="content">
        <section className="card">
          <h2>
            <FiSave className="icon" /> {editId ? 'Editar vacina' : 'Nova vacina'}
          </h2>
          <form className="form" onSubmit={salvarVacina}>
            <div className="form-row">
              <label>Código da vacina</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex.: VAC-0008"
              />
            </div>
            <div className="form-row">
              <label>Nome da vacina</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: V10 - Polivalente Canina"
              />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" className="btn-primary">
                <FiSave className="icon" /> {editId ? 'Atualizar' : 'Salvar'}
              </button>
              {editId && (
                <button type="button" className="btn-primary" onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <h2>
            <FiList className="icon" /> Lista de vacinas
          </h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Cadastrado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vacinasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">Nenhuma vacina encontrada</td>
                  </tr>
                ) : (
                  vacinasFiltradas.map((v) => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{v.codigo}</td>
                      <td>{v.nome}</td>
                      <td>
                        {v.cadastrado_em
                          ? new Date(v.cadastrado_em).toLocaleString()
                          : '-'}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => editarVacina(v)}
                          title="Editar"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => excluirVacina(v.id)}
                          title="Excluir"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
