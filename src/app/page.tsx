'use client';

import { useEffect, useMemo, useState } from 'react';

type MemeItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  width: number;
  height: number;
  trending?: boolean;
  likes?: number;
  views?: number;
  age?: string;
};

type ImgflipMeme = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

type ImgflipResponse = {
  success: boolean;
  data?: {
    memes: ImgflipMeme[];
  };
};

type Layer = {
  id: string;
  text: string;
  x: number;
  y: number;
};

const categories = ['Suosituimmat', 'Reaktiot', 'Suomi', 'Urheilu', 'Työelämä', 'Blank'];

const fallbackTemplates: MemeItem[] = [
  {
    id: 'fallback-1',
    title: 'Drake Hotline Bling',
    category: 'Suosituimmat',
    image: 'https://i.imgflip.com/30b1gx.jpg',
    width: 1200,
    height: 1200,
    trending: true,
  },
  {
    id: 'fallback-2',
    title: 'Distracted Boyfriend',
    category: 'Reaktiot',
    image: 'https://i.imgflip.com/1ur9b0.jpg',
    width: 1200,
    height: 800,
  },
];

const inferCategory = (name: string): string => {
  const n = name.toLowerCase();

  if (n.includes('blank') || n.includes('empty')) {
    return 'Blank';
  }

  if (
    n.includes('football') ||
    n.includes('soccer') ||
    n.includes('nba') ||
    n.includes('sport') ||
    n.includes('olympic')
  ) {
    return 'Urheilu';
  }

  if (
    n.includes('office') ||
    n.includes('work') ||
    n.includes('meeting') ||
    n.includes('boss') ||
    n.includes('business')
  ) {
    return 'Työelämä';
  }

  if (
    n.includes('angry') ||
    n.includes('drake') ||
    n.includes('cat') ||
    n.includes('boyfriend') ||
    n.includes('gru') ||
    n.includes('doge') ||
    n.includes('kermit') ||
    n.includes('change my mind')
  ) {
    return 'Reaktiot';
  }

  return 'Suosituimmat';
};

const toMemeItems = (memes: ImgflipMeme[]): MemeItem[] =>
  memes.map((m, i) => ({
    id: m.id,
    title: m.name,
    category: inferCategory(m.name),
    image: m.url,
    width: m.width,
    height: m.height,
    trending: i < 10,
  }));

export default function Page() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Suosituimmat');
  const [templates, setTemplates] = useState<MemeItem[]>(fallbackTemplates);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MemeItem>(fallbackTemplates[0]);
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'top', text: 'KUN KAHVI OSUU HETI', x: 50, y: 8 },
    { id: 'bottom', text: 'JA DEADLINE EI ENÄÄ PELOTA', x: 50, y: 82 },
  ]);
  const [selectedLayer, setSelectedLayer] = useState('top');
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(46);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeSize, setStrokeSize] = useState(2);
  const [bold, setBold] = useState(true);
  const [caps, setCaps] = useState(true);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        setTemplateError('');

        const response = await fetch('https://api.imgflip.com/get_memes');
        const json = (await response.json()) as ImgflipResponse;

        if (!response.ok || !json.success || !json.data?.memes?.length) {
          throw new Error('Imgflip API ei palauttanut meemipohjia.');
        }

        const apiTemplates = toMemeItems(json.data.memes);
        setTemplates(apiTemplates);
        setSelectedTemplate(apiTemplates[0]);
        showToast(`Ladattu ${apiTemplates.length} meemipohjaa Imgflip API:sta`);
      } catch {
        setTemplateError('Imgflip-yhteys epäonnistui. Käytetään varapohjia.');
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, []);

  const latest = useMemo(
    () =>
      templates.slice(8, 20).map((m, i) => ({
        ...m,
        id: `latest-${m.id}-${i}`,
        likes: 40 + i * 17,
        views: 900 + i * 311,
        age: `${(i % 8) + 1} h sitten`,
      })),
    [templates],
  );

  const filtered = useMemo(
    () =>
      templates.filter(
        (t) =>
          (category === 'Suosituimmat' || t.category === category) &&
          t.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [templates, search, category],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const updateLayer = (id: string, patch: Partial<Layer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const placeLayer = (mode: 'Ylös' | 'Keskelle' | 'Alas' | 'Vapaa') => {
    if (mode === 'Vapaa') return;
    const y = mode === 'Ylös' ? 8 : mode === 'Keskelle' ? 48 : 84;
    updateLayer(selectedLayer, { y });
  };

  return (
    <main>
      <header className="topbar">
        <div className="container nav">
          <div className="logo">
            <span className="logo-mark" />MEEMIMYLLY
          </div>
          <input className="input" placeholder="Hae meemipohjaa..." aria-label="Hae meemipohjaa" />
          <nav className="links">
            <a href="#suositut">Suositut</a>
            <a href="#uusimmat">Uusimmat</a>
            <a href="#editori">Luo meemi</a>
          </nav>
        </div>
      </header>

      <section className="hero container">
        <h1>Tee meemi sekunneissa</h1>
        <p>Valitse pohja tai lataa oma kuva ja lisää teksti.</p>
        <div className="hero-actions">
          <button className="btn btn-primary">Aloita meeminteko</button>
          <button className="btn">Lataa oma kuva</button>
        </div>
      </section>

      <section id="editori" className="container editor">
        <aside className="card left">
          <p className="section-title">Valitse pohja</p>
          <input
            className="input"
            placeholder="Etsi pohjaa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${cat === category ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoadingTemplates ? (
            <p className="helper">Haetaan meemipohjia Imgflip API:sta...</p>
          ) : null}
          {templateError ? <p className="helper">{templateError}</p> : null}

          <div className="template-grid">
            {filtered.map((t) => (
              <button
                key={t.id}
                className="template-card"
                onClick={() => setSelectedTemplate(t)}
                aria-label={`Valitse ${t.title}`}
              >
                {t.trending ? <span className="trending">Trending</span> : null}
                <img src={t.image} alt={t.title} loading="lazy" />
                <span>{t.title}</span>
              </button>
            ))}
          </div>
          <button className="btn" style={{ marginTop: 12, width: '100%' }}>
            Lataa oma kuva
          </button>
          <div className="ad" style={{ height: 250, marginTop: 12 }}>
            Google AdSense 300x250
          </div>
        </aside>

        <section className="card center">
          <div className="canvas-toolbar">
            {['↶', '↷', '－', '＋', '⟲', 'T', '😊'].map((i) => (
              <button key={i} className="icon-btn" aria-label={`Työkalu ${i}`}>
                {i}
              </button>
            ))}
          </div>
          <div className="canvas-wrap">
            <div className="canvas" style={{ aspectRatio: `${selectedTemplate.width}/${selectedTemplate.height}` }}>
              <img src={selectedTemplate.image} alt={selectedTemplate.title} />
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className={`layer ${selectedLayer === layer.id ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const origX = layer.x;
                    const origY = layer.y;
                    setSelectedLayer(layer.id);
                    const onMove = (ev: MouseEvent) => {
                      updateLayer(layer.id, {
                        x: Math.min(92, Math.max(8, origX + (ev.clientX - startX) / 4)),
                        y: Math.min(92, Math.max(4, origY + (ev.clientY - startY) / 4)),
                      });
                    };
                    const onUp = () => {
                      window.removeEventListener('mousemove', onMove);
                      window.removeEventListener('mouseup', onUp);
                    };
                    window.addEventListener('mousemove', onMove);
                    window.addEventListener('mouseup', onUp);
                  }}
                  onClick={() => setSelectedLayer(layer.id)}
                  style={{
                    top: `${layer.y}%`,
                    left: `${layer.x}%`,
                    color: textColor,
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    textShadow: `-${strokeSize}px -${strokeSize}px 0 ${strokeColor}, ${strokeSize}px -${strokeSize}px 0 ${strokeColor}, -${strokeSize}px ${strokeSize}px 0 ${strokeColor}, ${strokeSize}px ${strokeSize}px 0 ${strokeColor}`,
                    fontWeight: bold ? 800 : 500,
                    textAlign: align,
                  }}
                >
                  {caps ? layer.text.toUpperCase() : layer.text}
                </div>
              ))}
            </div>
          </div>
          <p className="helper">Vinkki: Vedä tekstiä suoraan kuvan päällä</p>
          <div className="mobile-sticky">
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Lataa meemi
            </button>
          </div>
        </section>

        <aside className="right">
          <section className="card ctrl-section">
            <h3>Tekstit</h3>
            {layers.slice(0, 2).map((l, i) => (
              <label key={l.id} style={{ display: 'block', marginBottom: 8 }}>
                Teksti {i + 1}
                <input
                  className="input"
                  value={l.text}
                  onChange={(e) => updateLayer(l.id, { text: e.target.value })}
                />
              </label>
            ))}
            <button
              className="btn"
              onClick={() =>
                setLayers((p) => [...p, { id: String(Date.now()), text: 'UUSI TEKSTI', x: 50, y: 50 }])
              }
            >
              + Lisää tekstikenttä
            </button>
          </section>

          <section className="card ctrl-section">
            <h3>Tyyli</h3>
            <label>
              Fontti
              <select className="input" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option>Impact</option>
                <option>Anton</option>
                <option>Arial Black</option>
              </select>
            </label>
            <label>
              Fonttikoko
              <input
                type="range"
                min="24"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </label>
            <div className="grid2">
              <label>
                Tekstin väri
                <input
                  type="color"
                  className="input"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </label>
              <label>
                Reunan väri
                <input
                  type="color"
                  className="input"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                />
              </label>
            </div>
            <label>
              Reunan paksuus
              <input
                type="range"
                min="0"
                max="6"
                value={strokeSize}
                onChange={(e) => setStrokeSize(Number(e.target.value))}
              />
            </label>
            <div className="grid2">
              <button className="btn" onClick={() => setBold((v) => !v)}>
                Bold
              </button>
              <button className="btn" onClick={() => setCaps((v) => !v)}>
                CAPS
              </button>
              <button className="btn" onClick={() => setAlign('center')}>
                Center
              </button>
            </div>
          </section>

          <section className="card ctrl-section">
            <h3>Sijoittelu</h3>
            <div className="grid2">
              {(['Ylös', 'Keskelle', 'Alas', 'Vapaa'] as const).map((p) => (
                <button key={p} className="btn" onClick={() => placeLayer(p)}>
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section className="card ctrl-section actions">
            <h3>Toiminnot</h3>
            <button
              className="btn btn-primary"
              onClick={() => showToast('Meemin lataus tulossa pian MVP:n seuraavassa versiossa')}
            >
              Lataa meemi
            </button>
            <button
              className="btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Linkki kopioitu leikepöydälle');
              }}
            >
              Kopioi linkki
            </button>
            <button className="btn" onClick={() => showToast('Jakaminen lisätään seuraavaksi')}>
              Jaa
            </button>
            <button className="btn" onClick={() => showToast('Luonnos tallennettu paikallisesti')}>
              Tallenna luonnos
            </button>
          </section>

          <section className="card ctrl-section">
            <h3>AI-apuri</h3>
            <p style={{ color: 'var(--muted)', marginTop: 0 }}>
              Generoi hauska meemiteksti yhdellä klikkauksella.
            </p>
            <button
              className="btn"
              onClick={() => {
                setLayers((prev) =>
                  prev.map((l, i) => ({
                    ...l,
                    text: i === 0 ? 'MINÄ MAANANTAINA 08:59' : 'KUN PALAVERI ALKAAKIN 09:30',
                  })),
                );
                showToast('AI-ehdotus lisätty');
              }}
            >
              Generoi ehdotus
            </button>
          </section>
        </aside>
      </section>

      <section id="suositut" className="container gallery">
        <h2>🔥 Suosituimmat meemipohjat</h2>
        <div className="gallery-grid">
          {templates.slice(0, 8).map((m) => (
            <article className="card meme-card" key={`popular-${m.id}`}>
              <img src={m.image} alt={m.title} loading="lazy" />
              <div className="body">
                <strong>{m.title}</strong>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn">Käytä pohjaa</button>
                  <button className="btn">Remix</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="uusimmat" className="container gallery">
        <h2>🆕 Uusimmat meemit</h2>
        <div className="gallery-grid">
          {latest.slice(0, 8).map((m) => (
            <article className="card meme-card" key={m.id}>
              <img src={m.image} alt={m.title} loading="lazy" />
              <div className="body">
                <strong>{m.title}</strong>
                <div className="meta">
                  👀 {m.views} • ❤️ {m.likes} • {m.age}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn">Avaa</button>
                  <button className="btn">Jaa</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: 24 }}>
        <div className="ad" style={{ height: 90 }}>
          Google AdSense 728x90
        </div>
      </section>

      <footer className="footer">
        <div className="container foot-row">
          <div>
            <strong>MEEMIMYLLY</strong>
            <div>Suomen suosituin meemikone.</div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <a href="#">Tietoa</a>
            <a href="#">Ohjeet</a>
            <a href="#">Yhteystiedot</a>
          </div>
        </div>
      </footer>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
