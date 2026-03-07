'use client';

import { useEffect, useMemo, useState } from 'react';

type MemeItem = {
  id: string;
  title: string;
  image: string;
  width: number;
  height: number;
  likes?: number;
  views?: number;
  age?: string;
};

type ImgflipResponse = {
  success: boolean;
  data?: {
    memes: Array<{ id: string; name: string; url: string; width: number; height: number }>;
  };
};

type Layer = { id: string; text: string; x: number; y: number };

const fallbackTemplates: MemeItem[] = [
  { id: '30b1gx', title: 'Drake Hotline Bling', image: 'https://i.imgflip.com/30b1gx.jpg', width: 1200, height: 1200 },
  { id: '1ur9b0', title: 'Distracted Boyfriend', image: 'https://i.imgflip.com/1ur9b0.jpg', width: 1200, height: 800 },
];

const short = (text: string) => (text.length > 28 ? `${text.slice(0, 28)}…` : text);

export default function Page() {
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<'Suositut' | 'Uusimmat' | 'Blank'>('Suositut');
  const [templates, setTemplates] = useState<MemeItem[]>(fallbackTemplates);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MemeItem>(fallbackTemplates[0]);

  const [layers, setLayers] = useState<Layer[]>([
    { id: 'top', text: '', x: 50, y: 8 },
    { id: 'bottom', text: '', x: 50, y: 82 },
  ]);
  const [selectedLayer, setSelectedLayer] = useState('top');

  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(52);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeSize, setStrokeSize] = useState(3);
  const [bold, setBold] = useState(true);
  const [caps, setCaps] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        setTemplateError('');

        const response = await fetch('https://api.imgflip.com/get_memes');
        const json = (await response.json()) as ImgflipResponse;

        if (!response.ok || !json.success || !json.data?.memes?.length) {
          throw new Error('Ei meemipohjia');
        }

        const apiTemplates: MemeItem[] = json.data.memes.map((m) => ({
          id: m.id,
          title: m.name,
          image: m.url,
          width: m.width,
          height: m.height,
        }));

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

  const filtered = useMemo(() => {
    const bySearch = templates.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

    if (quickFilter === 'Blank') {
      return bySearch.filter((t) => t.title.toLowerCase().includes('blank') || t.title.toLowerCase().includes('empty'));
    }

    if (quickFilter === 'Uusimmat') {
      return [...bySearch].reverse();
    }

    return bySearch;
  }, [templates, search, quickFilter]);

  const latest = useMemo(
    () =>
      templates.slice(8, 20).map((m, i) => ({
        ...m,
        id: `latest-${m.id}-${i}`,
        likes: 50 + i * 14,
        views: 850 + i * 290,
        age: `${(i % 9) + 1} h sitten`,
      })),
    [templates],
  );

  const visibleLayers = layers.filter((l) => l.text.trim().length > 0);

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
          <div className="logo"><span className="logo-mark" />MEEMIMYLLY</div>
          <input className="input" placeholder="Hae meemipohjaa..." aria-label="Hae meemipohjaa" />
          <nav className="links"><a href="#suositut">Suositut</a><a href="#uusimmat">Uusimmat</a><a href="#editori">Luo meemi</a></nav>
        </div>
      </header>

      <section className="hero container">
        <h1>Tee meemi sekunneissa</h1>
        <p>Valitse pohja tai lataa oma kuva ja lisää teksti.</p>
        <div className="hero-actions">
          <button className="btn btn-primary">Aloita meeminteko</button>
          <button className="btn btn-soft">Lataa oma kuva</button>
        </div>
      </section>

      <section id="editori" className="container editor">
        <aside className="card left">
          <p className="section-title">Valitse pohja</p>
          <input className="input" placeholder="Etsi pohjaa..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="light-filter">
            {(['Suositut', 'Uusimmat', 'Blank'] as const).map((f) => (
              <button key={f} className={f === quickFilter ? 'active' : ''} onClick={() => setQuickFilter(f)}>{f}</button>
            ))}
          </div>

          <button className="btn" style={{ marginTop: 10, width: '100%', fontWeight: 600 }}>Lataa oma kuva</button>
          {isLoadingTemplates ? <p className="helper">Haetaan meemipohjia Imgflip API:sta...</p> : null}
          {templateError ? <p className="helper">{templateError}</p> : null}

          <div className="template-grid">
            {filtered.slice(0, 14).map((t) => (
              <button key={t.id} className="template-card" onClick={() => setSelectedTemplate(t)} aria-label={`Valitse ${t.title}`}>
                <img src={t.image} alt={t.title} loading="lazy" />
                <span>{short(t.title)}</span>
              </button>
            ))}
          </div>

          <div className="ad" style={{ height: 250, marginTop: 12 }}>Google AdSense 300x250</div>
        </aside>

        <section className="card center">
          <div className="canvas-toolbar">
            <div className="toolbar-group">
              <button className="icon-btn" title="Kumoa" aria-label="Kumoa">↶</button>
              <button className="icon-btn" title="Tee uudelleen" aria-label="Tee uudelleen">↷</button>
            </div>
            <div className="toolbar-group">
              <button className="icon-btn" title="Loitonna" aria-label="Loitonna">－</button>
              <button className="icon-btn" title="Lähennä" aria-label="Lähennä">＋</button>
              <button className="icon-btn" title="Nollaa näkymä" aria-label="Nollaa näkymä">⟲</button>
            </div>
            <div className="toolbar-group">
              <button className="icon-btn" title="Lisää tekstikenttä" aria-label="Lisää tekstikenttä">T</button>
              <button className="icon-btn" title="Lisää emoji" aria-label="Lisää emoji">😊</button>
            </div>
          </div>

          <div className="canvas-wrap">
            <div className="canvas" style={{ aspectRatio: `${selectedTemplate.width}/${selectedTemplate.height}` }}>
              <img src={selectedTemplate.image} alt={selectedTemplate.title} />

              {visibleLayers.length === 0 ? (
                <div className="canvas-empty">Lisää teksti oikealta paneelista.<br />Voit vetää tekstiä suoraan kuvan päällä.</div>
              ) : null}

              {layers.map((layer) => {
                if (!layer.text.trim()) return null;

                return (
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
                      fontSize: `clamp(22px, ${(fontSize / 42).toFixed(2)}vw, ${fontSize}px)`,
                      textShadow: `${strokeSize}px ${strokeSize}px 0 ${strokeColor}, -${strokeSize}px -${strokeSize}px 0 ${strokeColor}, -${strokeSize}px ${strokeSize}px 0 ${strokeColor}, ${strokeSize}px -${strokeSize}px 0 ${strokeColor}, 0 ${strokeSize + 1}px 0 ${strokeColor}, ${strokeSize + 1}px 0 0 ${strokeColor}`,
                      fontWeight: bold ? 800 : 600,
                    }}
                  >
                    {caps ? layer.text.toUpperCase() : layer.text}
                    {selectedLayer === layer.id ? (
                      <>
                        <span className="handle tl" />
                        <span className="handle tr" />
                        <span className="handle bl" />
                        <span className="handle br" />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="helper">Vinkki: Vedä tekstiä suoraan kuvan päällä</p>
          <div className="mobile-sticky"><button className="btn btn-primary" style={{ width: '100%' }}>Lataa meemi</button></div>
        </section>

        <aside className="right">
          <section className="card compact-group">
            <h3>Teksti & tyyli</h3>
            {layers.slice(0, 2).map((l, i) => (
              <label key={l.id} style={{ display: 'block', marginBottom: 7 }}>
                Teksti {i + 1}
                <input className="input" value={l.text} placeholder={`Kirjoita teksti ${i + 1}`} onChange={(e) => updateLayer(l.id, { text: e.target.value })} onFocus={() => setSelectedLayer(l.id)} />
              </label>
            ))}

            <div className="row2" style={{ marginTop: 6 }}>
              <label>Fontti<select className="input" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}><option>Impact</option><option>Anton</option><option>Arial Black</option></select></label>
              <label>Koko<input type="range" min="24" max="78" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></label>
            </div>

            <div className="row2" style={{ marginTop: 6 }}>
              <label>Tekstiväri<input type="color" className="input" value={textColor} onChange={(e) => setTextColor(e.target.value)} /></label>
              <label>Reunaväri<input type="color" className="input" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} /></label>
            </div>

            <label style={{ display: 'block', marginTop: 6 }}>Reunan paksuus<input type="range" min="1" max="8" value={strokeSize} onChange={(e) => setStrokeSize(Number(e.target.value))} /></label>

            <div className="row2" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setBold((v) => !v)}>Bold</button>
              <button className="btn" onClick={() => setCaps((v) => !v)}>CAPS</button>
            </div>

            <div className="row2" style={{ marginTop: 8 }}>
              {(['Ylös', 'Keskelle', 'Alas', 'Vapaa'] as const).map((p) => <button key={p} className="btn" onClick={() => placeLayer(p)}>{p}</button>)}
            </div>
          </section>

          <section className="card compact-group actions">
            <h3>Toiminnot</h3>
            <button className="btn btn-primary" onClick={() => showToast('Meemin lataus tulossa pian MVP:n seuraavassa versiossa')}>Lataa meemi</button>
            <button className="btn btn-soft" onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Linkki kopioitu leikepöydälle'); }}>Kopioi linkki</button>
            <button className="btn btn-soft" onClick={() => showToast('Jakaminen lisätään seuraavaksi')}>Jaa</button>
            <button className="btn btn-soft" onClick={() => showToast('Luonnos tallennettu paikallisesti')}>Tallenna luonnos</button>
          </section>

          <section className="card compact-group">
            <h3>AI-apuri</h3>
            <p style={{ color: 'var(--muted)', margin: '0 0 8px' }}>Generoi hauska meemiteksti yhdellä klikkauksella.</p>
            <button className="btn" onClick={() => {
              setLayers((prev) => prev.map((l, i) => ({ ...l, text: i === 0 ? 'MINÄ MAANANTAINA 08:59' : 'KUN PALAVERI ALKAAKIN 09:30' })));
              showToast('AI-ehdotus lisätty');
            }}>Generoi ehdotus</button>
          </section>
        </aside>
      </section>

      <section id="suositut" className="container gallery">
        <h2>🔥 Suosituimmat meemipohjat</h2>
        <div className="gallery-grid">
          {templates.slice(0, 8).map((m) => (
            <article className="card meme-card" key={`popular-${m.id}`}>
              <img src={m.image} alt={m.title} loading="lazy" />
              <div className="body"><strong>{m.title}</strong><div style={{ display: 'flex', gap: 8, marginTop: 10 }}><button className="btn">Käytä pohjaa</button><button className="btn">Remix</button></div></div>
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
                <div className="meta">👀 {m.views} • ❤️ {m.likes} • {m.age}</div>
                <div style={{ display: 'flex', gap: 8 }}><button className="btn">Avaa</button><button className="btn">Jaa</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: 24 }}>
        <div className="ad" style={{ height: 90 }}>Google AdSense 728x90</div>
      </section>

      <footer className="footer">
        <div className="container foot-row">
          <div><strong>MEEMIMYLLY</strong><div>Suomen suosituin meemikone.</div></div>
          <div style={{ display: 'flex', gap: 14 }}><a href="#">Tietoa</a><a href="#">Ohjeet</a><a href="#">Yhteystiedot</a></div>
        </div>
      </footer>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
