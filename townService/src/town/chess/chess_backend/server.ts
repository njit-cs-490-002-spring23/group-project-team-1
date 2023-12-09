import Express from 'express';
import cors from 'cors';
import router from './router';

const app = Express();

app.use(cors());
app.use(Express.json());

app.use('/', router);

app.use('*', (req, res) => {
  const filler = req;
  res.status(404).json({ error: 'not found' });
});

export default app;
