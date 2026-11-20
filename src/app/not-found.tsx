import Link from 'next/link';

export default function NotFound() {
  return <section className="section shell"><h1>Capítulo extraviado.</h1><p>No encontramos esta página.</p><Link href="/" className="button">Volver a inicio</Link></section>;
}
