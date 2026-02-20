// server.js
const express = require('express');
const multer = require('multer'); // gestione upload
const axios = require('axios');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const GITHUB_TOKEN = 'IL_TUO_PERSONAL_ACCESS_TOKEN';
const REPO = 'tuo-username/tuo-repo';
const BRANCH = 'main';

app.post('/upload', upload.single('file'), async (req, res) => {
  const fileContent = req.file.buffer.toString('base64');
  const path = req.file.originalname;

  try {
    await axios.put(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      {
        message: `Upload file ${path}`,
        content: fileContent,
        branch: BRANCH,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.send('File caricato con successo!');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Errore nel caricamento su GitHub');
  }
});

app.listen(3000, () => console.log('Server avviato su http://localhost:3000'));
