const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

app.options('*', cors());

const pool = new Pool({
  user: 'applicant',
  host: 'ec2-54-169-182-174.ap-southeast-1.compute.amazonaws.com',
  database: 'FSD_2022_CENA',
  password: 'OxzdeuEXBM85=+xQnCV7U',
  port: 5432,
});

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.get('/history', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM history');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.post('/history', async (req, res) => {
  try {
    const { formula, result } = req.body;
    const new_history = await pool.query('INSERT INTO history(formula, result) VALUES($1, $2) RETURNING *', [formula, result]);
    res.status(201).json(new_history.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.delete('/history', async (_, res) => {
  try {
    const deleted_history = await pool.query('DELETE FROM history RETURNING *');
    res.json({ message: `${deleted_history.count} history deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
