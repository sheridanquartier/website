# Bilder für Sheridan Quartier

Dieser Ordner sollte die Bilder für die Website enthalten.

## Erwartete Struktur:

```
public/images/
├── SheridanParkUndJunia/
│   ├── IMG_9669_hero.jpg
│   ├── IMG_8623_hero.jpg
│   ├── IMG_8623_gallery1.jpg
│   ├── IMG_8624_gallery2.jpg
│   └── IMG_9669_gallery3.jpg
├── Wagnis/
│   └── (Bilder für wagnisSHARE)
└── Wogenau/
    └── (Bilder für WOGENAU)
```

## Bilder hinzufügen:

Falls Sie einen `Bilder/` Ordner außerhalb dieses Projekts haben:

```bash
cp -r /pfad/zum/Bilder/* public/images/
```

## Platzhalter-Bilder:

Aktuell werden Platzhalter-Bildpfade in der Anwendung referenziert. Sobald echte Bilder vorhanden sind, sollten diese die entsprechenden Dateinamen haben oder die Pfade in den Components angepasst werden.

## Bildoptimierung:

Next.js optimiert alle Bilder automatisch:
- WebP-Format für moderne Browser
- Responsive Größen
- Lazy Loading
- Blur-Placeholder

Keine manuelle Optimierung nötig!
