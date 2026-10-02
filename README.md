# 💌 Para ti

Página romántica de una sola página: un sobre animado que se abre y revela una carta que se escribe sola, con corazones flotando de fondo y música.

HTML, CSS y JavaScript puros. No necesita instalar nada ni compilar.

## Estructura

```
para-ti/
├── index.html          # Estructura de la página
├── css/
│   └── styles.css      # Estilos y animaciones del sobre y la carta
├── js/
│   ├── config.js       # ✏️ Aquí personalizas nombre, fecha, mensaje y canción
│   ├── background.js   # Fondo: estrellas y corazones (canvas)
│   ├── music.js        # Música: melodía original o tu mp3
│   └── letter.js       # Sobre, transición y escritura de la carta
├── assets/             # Pon aquí tu canción (opcional)
├── .gitignore
└── README.md
```

## Personalizar

Edita solo `js/config.js`:

| Campo | Qué hace |
|---|---|
| `ella` | Su nombre (sobre y título de la carta) |
| `el` | Tu nombre (firma) |
| `fechaInicio` | Día en que dijo que sí, formato `AAAA-MM-DD` |
| `mensaje` | Lista de párrafos de la carta |
| `cancion` | Vacío = melodía incluida. O `"assets/cancion.mp3"` para usar tu canción |

## Probarla en tu computadora

Abre `index.html` con doble clic. También puedes usar un servidor local:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `para-ti`).
2. Sube los archivos desde la terminal:

   ```bash
   git init
   git add .
   git commit -m "Página para ti"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/para-ti.git
   git push -u origin main
   ```

   O arrastra los archivos con **Add file → Upload files** en la web de GitHub.
3. En el repositorio ve a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guarda.
5. Espera uno o dos minutos. Tu página quedará en:

   `https://TU_USUARIO.github.io/para-ti/`

Con una cuenta gratuita el repositorio debe ser público para usar Pages. Si no quieres que se vea el código, puedes usar Netlify Drop (arrastras la carpeta y listo).

## Notas

- La música intenta empezar en cuanto se abre la página. Los navegadores suelen bloquear el sonido automático, así que si no suena, empieza con el primer toque o tecla en cualquier parte de la pantalla (por ejemplo, al tocar el sobre).
- Si usas tu propio mp3 y el repositorio es público, recuerda que cualquiera podría descargarlo. Ten en cuenta los derechos de autor de la canción.
- Las tipografías vienen de Google Fonts, así que se necesita conexión a internet para verlas como están diseñadas.
- Paleta de otoño: los colores están al inicio de `css/styles.css` (variables `--sobre`, `--oro`, `--papel`...) y los corazones en `js/background.js` (`colores`).
- Respeta `prefers-reduced-motion`: con esa opción activada, las animaciones se reducen.
