import express from 'express';
import bodyParser from 'body-parser';
import { Config } from './config/app';
import { router } from './routes/index';

const app = express();

const PORT: number = Config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
