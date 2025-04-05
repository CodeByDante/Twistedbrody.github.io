# Twistedbrody.github.io

html
 ├── head
 │   ├── meta (charset, viewport)
 │   ├── link (favicon)
 │   └── title (Vite + React + TS)
 └── body
     └── div#root
         └── App
             ├── div.search-bar
             │   ├── input[type="text"] (buscador)
             │   └── button (ícono de búsqueda)
             ├── select (categoría)
             ├── select (hashtags)
             ├── button (agregar video)
             ├── div.video-list
             │   ├── div.video-card
             │   │   ├── iframe (video)
             │   │   ├── h3 (título)
             │   │   ├── p (descripción)
             │   │   ├── span (categoría)
             │   │   └── div.hashtags
             │   │       └── span (hashtags)
             │   └── ... (más tarjetas de video)
             └── div.modal (solo si está visible)
                 └── form
                     ├── input (título)
                     ├── textarea (descripción)
                     ├── input (URL del video)
                     ├── input (categoría)
                     ├── input (hashtags)
                     ├── button (guardar)
                     └── button (cancelar/cerrar)
