import credits from '@/data/credits.json';
import { photo } from '@/lib/utils';

type Credit = { title: string; author: string; license: string; source: string };

export default function Creditos() {
  const entries = Object.entries(credits as Record<string, Credit>);
  return (
    <div className="container-x max-w-4xl pt-8">
      <h1 className="text-[34px] font-bold">Créditos de fotos</h1>
      <p className="mt-2 text-[15px] text-huerta-900/70">Las fotografías de productos provienen de Wikimedia Commons y se usan según sus licencias libres. Gracias a sus autores.</p>
      <ul className="card mt-6 divide-y divide-huerta-900/10">
        {entries.map(([slug, c]) => (
          <li key={slug} className="flex items-center gap-3 p-3">
            <img src={slug.startsWith('hero') ? `/img/hero/${slug}.webp` : photo(slug)} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1 text-[13px]">
              <a href={c.source} target="_blank" rel="noreferrer" className="block truncate font-semibold hover:underline">
                {c.title}
              </a>
              <span className="text-huerta-900/60">
                {c.author || 'Autor desconocido'} · {c.license}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
