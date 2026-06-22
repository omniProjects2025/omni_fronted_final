import 'zone.js/node';

import * as express from 'express';
import { join } from 'path';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { AppServerModule } from './src/main.server';

const app = express();

const distFolder = join(process.cwd(), 'dist/omni-project-frontend/browser');

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModule,
  }),
);

app.set('view engine', 'html');
app.set('views', distFolder);

app.get(
  '*.*',
  express.static(distFolder, {
    maxAge: '1y',
  }),
);

app.get('*', (req: express.Request, res: express.Response) => {
  res.render('index', { req });
});

const port = process.env['PORT'] || 4000;

app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
