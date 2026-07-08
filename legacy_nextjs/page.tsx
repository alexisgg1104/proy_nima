import { readFileSync } from 'fs';
import { join } from 'path';

export default function Page() {
  // Read the static HTML file
  const htmlPath = join(process.cwd(), 'public', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');

  // Return the HTML as dangerously set innerHTML (safe here because it's our own static file)
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
