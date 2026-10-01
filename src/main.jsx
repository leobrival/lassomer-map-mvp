import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

const logo = 'https://www.lassomer.fr/wp-content/uploads/2019/03/Logo-assomer.png';

const scienceDives = [
  { title: 'Adopte un corail sauvage', tag: 'Cartographie', text: 'Suivi photographique et géolocalisé des coraux en mer autour de la Martinique.', href: '#map-section' },
  { title: 'Pontes coralliennes', tag: 'Observation', text: 'Calendrier Sciences Dive, clubs partenaires et remontées terrain pendant les épisodes de ponte.', href: '#events' },
  { title: 'Sentinelles récifales', tag: 'Participation', text: 'Ressources pédagogiques pour contribuer, documenter et comprendre l’évolution des récifs.', href: '#contribute' }
];

const events = [
  'Sciences Dive avec Plongée Passion le 01/10/2026',
  'Sciences Dive avec Natiyabel le 02/10/2026',
  'Sciences Dive avec O Fil de L’eau le 02/10/2026',
  'Campagne scientifique ZEPAL 2026'
];

const corals = [
  {
    id: 'ACR-001',
    name: 'Acropora — Anse Dufour',
    commune: 'Les Anses-d’Arlet',
    lat: 14.5278,
    lng: -61.0878,
    observer: 'Maya R.',
    status: 'validé',
    observations: [
      { date: '2026-09-12', health: 'Bon état général', note: 'Croissance visible sur les extrémités. Eau claire, faible houle.', photo: 'https://www.lassomer.fr/wp-content/uploads/2024/09/2024-06-29-ACROPORA-Preparation-Sciences-Dives-Secteur-Sainte-Anne-Marin-sites-Ti-Mur_Boucaniers_credits_©Gipsy_Tramoni_LAsso-Mer_SportDiver_20240629_111723-768x1024.jpg' },
      { date: '2026-07-02', health: 'Stress léger', note: 'Léger blanchissement localisé à recontrôler au prochain passage.', photo: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=900&q=80' }
    ]
  },
  {
    id: 'ACR-002',
    name: 'Corail sauvage — Rocher du Diamant',
    commune: 'Le Diamant',
    lat: 14.4395,
    lng: -61.0402,
    observer: 'Sciences Dive Club',
    status: 'validé',
    observations: [
      { date: '2026-09-20', health: 'À surveiller', note: 'Présence d’algues à proximité. Photo et commentaire validés.', photo: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=900&q=80' }
    ]
  },
  {
    id: 'ACR-003',
    name: 'Acropora — Baie du Robert',
    commune: 'Le Robert',
    lat: 14.6812,
    lng: -60.9078,
    observer: 'L’Asso-Mer',
    status: 'validé',
    observations: [
      { date: '2026-08-29', health: 'Stable', note: 'Observation conforme au relevé précédent.', photo: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=900&q=80' }
    ]
  }
];

function formatDate(value) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(value));
}

function useStats() {
  return useMemo(() => ({
    corals: corals.length,
    communes: new Set(corals.map(c => c.commune)).size,
    observers: new Set(corals.map(c => c.observer)).size,
  }), []);
}

function App() {
  const [selected, setSelected] = useState(corals[0]);
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const stats = useStats();
  const currentObservation = selected.observations[index] || selected.observations[0];

  React.useEffect(() => {
    const map = L.map('map', { scrollWheelZoom: false, zoomControl: true }).setView([14.62, -61.02], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    corals.forEach((coral) => {
      const marker = L.circleMarker([coral.lat, coral.lng], {
        radius: 11,
        color: '#005E79',
        fillColor: '#FFD800',
        fillOpacity: 0.95,
        weight: 4
      }).addTo(map);
      marker.bindTooltip(coral.name);
      marker.on('click', () => {
        setSelected(coral);
        setIndex(0);
      });
    });

    return () => map.remove();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return <>
    <header className="site-header">
      <a className="brand" href="https://www.lassomer.fr/"><img src={logo} alt="L’Asso-Mer" /></a>
      <nav><a>Qui sommes nous ?</a><a>Nos actions</a><a>Nous soutenir</a><a>Calendrier</a><a>Animations</a></nav>
    </header>
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">Association Martinique · Sciences participatives</div>
          <h1>Acropora, s’engager pour nos récifs</h1>
          <p>Prototype de page dédiée aux Sciences Dive : valoriser les ressources, visualiser les observations de coraux et collecter de nouvelles données après validation par L’Asso-Mer.</p>
          <div className="actions"><a href="#map-section">Explorer la carte</a><a href="#contribute" className="secondary">Remonter une observation</a></div>
        </div>
        <div className="hero-visual" aria-hidden="true"><div className="orbit"></div><strong>ASSOCIATION<br/>MARTINIQUE</strong></div>
      </section>

      <section className="intro">
        <span>Notre raison d’être</span>
        <h2>L’étude et la protection de la vie marine</h2>
        <p>La DA reprend les codes publics du site : bleu profond #005E79, jaune solaire #FFD800, typographies Viga/Voces, grands blancs, cartes arrondies et ton pédagogique.</p>
      </section>

      <section className="dives">
        {scienceDives.map((item, i) => <article key={item.title}>
          <small>Science Dive 0{i + 1} · {item.tag}</small><h3>{item.title}</h3><p>{item.text}</p><a href={item.href}>Découvrir</a>
        </article>)}
      </section>

      <section id="map-section" className="map-layout">
        <div className="section-title"><span>Cartographie interactive</span><h2>Adopte un corail sauvage</h2><p>Un point correspond à un corail. Les observations validées sont consultables par ordre chronologique, de la plus récente à la plus ancienne.</p></div>
        <div className="map-card"><div id="map" /></div>
        <aside className="panel">
          <div className="stats">
            <div><strong>{stats.corals}</strong><span>coraux suivis</span></div>
            <div><strong>{stats.communes}</strong><span>communes</span></div>
            <div><strong>{stats.observers}</strong><span>contributeurs</span></div>
          </div>
          <h2>{selected.name}</h2>
          <p className="meta">{selected.commune} · {selected.id} · statut {selected.status}</p>
          <img src={currentObservation.photo} alt={`Observation ${selected.name}`} />
          <div className="observation">
            <b>{formatDate(currentObservation.date)}</b>
            <p>{currentObservation.health}</p>
            <small>{currentObservation.note}</small>
          </div>
          <div className="pager" aria-label="Observations du corail">
            {selected.observations.map((obs, i) => <button key={obs.date} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>Obs. {i + 1}</button>)}
          </div>
        </aside>
      </section>

      <section id="events" className="events">
        <div><span>Calendrier</span><h2>Sciences Dive à venir</h2></div>
        <ul>{events.map(e => <li key={e}>{e}<small>sciences@lassomer.fr</small></li>)}</ul>
      </section>

      <section id="contribute" className="form-section">
        <div><span className="kicker">Validation avant publication</span><h2>Formulaire de remontée</h2><p>La V1 simule le statut “en attente”. Dans WordPress, ce flux peut être branché sur JetEngine / JetFormBuilder, avec validation éditoriale avant affichage sur la carte.</p></div>
        <form onSubmit={handleSubmit}>
          <input required placeholder="Nom du contributeur" />
          <input required placeholder="Commune ou zone" />
          <div className="grid"><input required type="number" step="any" placeholder="Latitude" /><input required type="number" step="any" placeholder="Longitude" /></div>
          <input required type="date" />
          <textarea required placeholder="État du corail, remarques, contexte…" />
          <input type="url" placeholder="URL de la photo pour le prototype" />
          <button>Envoyer pour validation</button>
          {submitted && <p className="success">Observation enregistrée en attente de validation.</p>}
        </form>
      </section>
    </main>
    <footer><img src="https://www.lassomer.fr/wp-content/uploads/2025/02/Logo-LASSOMER-blanc_02.svg" alt="L’Asso-Mer"/><p>Association à but non lucratif · Martinique</p></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
