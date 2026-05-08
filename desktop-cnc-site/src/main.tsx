import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/css/bootstrap.css'
import { MantineProvider} from '@mantine/core';
import { createShikiAdapter, CodeHighlightAdapterProvider } from '@mantine/code-highlight';
import '@mantine/core/styles.css';

async function loadShiki() {
  const { createHighlighter } = await import('shiki');
  const shiki = await createHighlighter({
    langs: ['tsx', 'scss', 'html', 'bash', 'json'],
   
    themes: [],
  });

  return shiki;
}

const root = document.getElementById('root');
if (root) {
  root.style.height = "100%";
}

const shikiAdapter = createShikiAdapter(loadShiki);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider> 
      <CodeHighlightAdapterProvider adapter={shikiAdapter}>
        <App />
      </CodeHighlightAdapterProvider>
    </MantineProvider>
  </StrictMode>,
)
