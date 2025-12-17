const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Ajuste a senha aqui (volVis20$)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'volVis20$',
  database: 'abrigo_vacinas'
});

// Opcional: log de conexão
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

// Rotas
app.get('/vacinas', (req, res) => {
  db.query('SELECT * FROM vacinas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/vacinas', (req, res) => {
  const { codigo, nome } = req.body;
  if (!codigo || !nome) {
    return res.status(400).json({ error: 'Código e nome são obrigatórios.' });
  }
  db.query(
    'INSERT INTO vacinas (codigo, nome) VALUES (?, ?)',
    [codigo, nome],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, codigo, nome });
    }
  );
});

app.put('/vacinas/:id', (req, res) => {
  const { id } = req.params;
  const { codigo, nome } = req.body;
  db.query(
    'UPDATE vacinas SET codigo = ?, nome = ? WHERE id = ?',
    [codigo, nome, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Vacina atualizada com sucesso!' });
    }
  );
});

app.delete('/vacinas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM vacinas WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Vacina excluída com sucesso!' });
  });
});

app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});
