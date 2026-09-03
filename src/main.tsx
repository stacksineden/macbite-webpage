import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages ship real markup; anything else mounts fresh.
// Checked against firstElementChild rather than hasChildNodes(), because the
// un-prerendered template leaves an <!--app-html--> comment behind and a
// comment node would otherwise send us down the hydrate path with nothing to
// hydrate against.
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
