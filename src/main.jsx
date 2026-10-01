import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

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
      { date: '2026-09-12', health: 'Bon état général', note: 'Croissance visible sur les extrémités.', photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80' },
      { date: '2026-07-02', health: 'Stress léger', note: 'Léger blanchissement localisé.', photo: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80' }
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
      { date: '2026-09-20', health: 'À surveiller', note: 'Présence d’algues à proximité.', photo: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=900&q=80' }
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
    const map = L.map('map', { scrollWheelZoom: false }).setView([14.62, -61.02], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    corals.forEach((coral) => {
      const marker = L.circleMarker([coral.lat, coral.lng], {
        radius: 10,
        color: '#006b84',
        fillColor: '#f6c84c',
        fillOpacity: 0.9,
        weight: 3
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

  return <main>
    <section className="hero">
      <div className="eyebrow">Science participative marine</div>
      <h1>Valoriser les Sciences Dive de L’Asso-Mer</h1>
      <p>Un MVP de page interactive pour explorer les coraux suivis en Martinique, consulter les observations chronologiques et collecter de nouvelles remontées à valider.</p>
      <div className="actions"><a href="#map-section">Voir la carte</a><a href="#contribute" className="secondary">Soumettre une observation</a></div>
    </section>

    <section className="dives">
      {['Adopte un corail sauvage', 'Suivi récifal participatif', 'Sentinelles du littoral'].map((title, i) => <article key={title}>
        <span>Science Dive 0{i + 1}</span><h2>{title}</h2><p>Encart éditorial prêt à remplacer par les ressources, consignes et supports pédagogiques fournis par L’Asso-Mer.</p>
      </article>)}
    </section>

    <section id="map-section" className="map-layout">
      <div className="map-card"><div id="map" /></div>
      <aside className="panel">
        <div className="stats">
          <strong>{stats.corals}</strong><span>coraux suivis</span>
          <strong>{stats.communes}</strong><span>communes</span>
          <strong>{stats.observers}</strong><span>contributeurs</span>
        </div>
        <h2>{selected.name}</h2>
        <p className="meta">{selected.commune} · {selected.id}</p>
        <img src={currentObservation.photo} alt={`Observation ${selected.name}`} />
        <div className="observation">
          <b>{formatDate(currentObservation.date)}</b>
          <p>{currentObservation.health}</p>
          <small>{currentObservation.note}</small>
        </div>
        <div className="pager">
          {selected.observations.map((obs, i) => <button key={obs.date} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>{i + 1}</button>)}
        </div>
      </aside>
    </section>

    <section id="contribute" className="form-section">
      <div><span className="eyebrow">Validation avant publication</span><h2>Formulaire de remontée</h2><p>Dans cette V1, la soumission simule le statut “en attente”. En WordPress, ce flux serait relié à JetEngine/JetFormBuilder ou à un CPT avec modération.</p></div>
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
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
