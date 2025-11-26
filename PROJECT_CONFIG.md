# ⚙️ Configuración del Proyecto - Áreas de Personalización

Documentación completa de todas las áreas configurables del template.

## 🎨 Sistema de Colores

### Variables CSS (`app/globals.css`)
```css
:root {
  --primary: #ff6b35;           /* Color principal - botones, acentos */
  --primary-light: #ff8a5c;     /* Variante clara del principal */
  --secondary: #4ade80;         /* Color secundario - éxito, confirmación */
  --accent: #3b82f6;            /* Color de acento - información, links */
  --background: #ffffff;        /* Fondo principal */
  --foreground: #171717;        /* Texto principal */
  --muted: #f8fafc;             /* Fondos suaves */
  --border: #e2e8f0;            /* Bordes */
}
```

### Clases Tailwind Usadas
- `bg-orange-500` / `hover:bg-orange-600` → Botones principales
- `bg-red-500` / `hover:bg-red-600` → Botones de acción importante
- `bg-green-500` / `hover:bg-green-600` → Elementos de éxito
- `bg-blue-500` / `hover:bg-blue-600` → Información secundaria
- `text-gray-900` → Texto principal
- `text-gray-600` → Texto secundario

## 📝 Contenido Textual

### Metadata (`app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  title: "Tu Título Aquí",
  description: "Tu descripción para SEO",
};
```

### Hero Section (`app/page.tsx`)
- **Línea 33-35**: Título principal
- **Línea 37-39**: Descripción
- **Línea 42-50**: Botones CTA

### Header (`app/components/Header.tsx`)
- **Línea 20**: Nombre del logo/brand
- **Línea 30-40**: Enlaces de navegación
- **Línea 50-60**: Botón de acción

### Examples Gallery (`app/components/ExamplesGallery.tsx`)
- **Línea 7-26**: Array `examples` con:
  - `title`: Título de cada ejemplo
  - `description`: Descripción
  - `image`: Ruta de la imagen

### Pricing (`app/page.tsx` + `PricingCard.tsx`)
- **Línea 95-116**: Configuración de planes
  - `title`: Nombre del plan
  - `price`: Precio
  - `credits`: Créditos/features
  - `features[]`: Array de características

## 🖼️ Imágenes y Assets

### Ubicaciones
```
public/
├── IMG/
│   ├── lineart.jpg          # Imagen original (Hero)
│   ├── resultado1.png       # Resultado 1 (Hero rotación)
│   ├── resultado2.png       # Resultado 2 (Hero rotación)
│   ├── resultado3.png       # Resultado 3 (Hero rotación)
│   ├── example1.jpg         # Ejemplo 1 (Gallery)
│   ├── example2.jpg         # Ejemplo 2 (Gallery)
│   └── example3.jpg         # Ejemplo 3 (Gallery)
└── favicon.ico              # Favicon del sitio
```

### Referencias en Código
- `HeroTransformation.tsx`: Línea 11-14 (resultado1-3.png)
- `HeroTransformation.tsx`: Línea 48 (lineart.jpg)
- `ExamplesGallery.tsx`: Línea 12, 18, 24 (example1-3.jpg)

## 🔧 Funcionalidad

### ColorizationApp (`app/components/ColorizationApp.tsx`)
**Áreas principales a adaptar:**
- **Línea 14**: Prompt por defecto
- **Línea 369-390**: Prompts predefinidos
- **Línea 246-346**: Lógica de procesamiento
- **Línea 87-115**: Sistema de créditos

### API Routes (`app/api/`)
- `colorize/route.ts`: Endpoint principal de procesamiento
- `credits/route.ts`: Gestión de créditos
- `poll-result/route.ts`: Polling de resultados
- `polar/checkout/route.ts`: Integración de pagos
- `webhooks/polar/route.ts`: Webhooks de pagos

## 📊 Analytics

### Google Analytics (`app/layout.tsx`)
- **Línea 31**: ID de Google Analytics
- **Línea 35-40**: Script de configuración

### Analytics Custom (`app/utils/analytics.ts`)
- Funciones de tracking personalizadas
- Eventos: `appOpened`, `colorizationStarted`, `creditUsed`, etc.

## 🎭 Animaciones

### Framer Motion
Todos los componentes usan animaciones configurables:

```typescript
// Ejemplo de animación estándar
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Personalizar Animaciones
- **Duración**: `duration: 0.6` → Cambiar valor
- **Delay**: `delay: 0.2` → Agregar retraso
- **Tipo**: `ease`, `easeIn`, `easeOut`, etc.

## 🔗 Enlaces y Navegación

### Smooth Scroll (`app/components/SmoothScroll.tsx`)
- Navegación suave entre secciones
- IDs de secciones: `#pricing`, `#contact`, etc.

### Enlaces Externos
- **Header**: Botón principal (línea 50+)
- **Pricing**: Botón de compra
- **Contact**: Email de contacto

## 📧 Contacto

### Sección Contact (`app/page.tsx`)
- **Línea 152-157**: Email de contacto
- **Línea 160**: Mensaje de respuesta

## 💳 Sistema de Pagos

### Polar Integration
- Configuración en `app/api/polar/`
- Variables de entorno necesarias
- Webhooks configurados

### Créditos
- Sistema de créditos en `app/api/credits/`
- Gestión de planes (free, paid)
- Límites y restricciones

## 🌐 SEO y Metadata

### Open Graph (Agregar si es necesario)
```typescript
// En layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Tu Título",
    description: "Tu Descripción",
    images: ["/og-image.jpg"],
  },
};
```

### Schema Markup
- Agregar según necesidad del proyecto
- JSON-LD en componentes específicos

## 🔐 Variables de Entorno

### Archivo `.env` o `env.example`
```env
# API Keys
NEXT_PUBLIC_API_KEY=tu_api_key

# Polar
POLAR_ACCESS_TOKEN=tu_token
POLAR_WEBHOOK_SECRET=tu_secret

# Otros servicios
ANALYTICS_ID=tu_id
```

## 📱 Responsive Breakpoints

### Tailwind Defaults
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Uso en Componentes
- Grids: `grid md:grid-cols-2 lg:grid-cols-3`
- Texto: `text-2xl sm:text-4xl lg:text-6xl`
- Padding: `p-4 sm:p-6 lg:p-8`

## 🎯 Checklist de Configuración Completa

### Información Básica
- [ ] Nombre del proyecto
- [ ] Descripción
- [ ] Metadata SEO
- [ ] Favicon

### Branding
- [ ] Colores principales
- [ ] Logo/Imágenes
- [ ] Tipografía (si se cambia)

### Contenido
- [ ] Textos hero
- [ ] Descripciones
- [ ] Ejemplos/Galería
- [ ] Precios/Planes

### Funcionalidad
- [ ] Adaptar lógica principal
- [ ] Configurar APIs
- [ ] Sistema de pagos (si aplica)
- [ ] Analytics

### Assets
- [ ] Imágenes de ejemplo
- [ ] Imágenes hero
- [ ] Favicon
- [ ] Logos

---

**Usa este documento como referencia para personalizar cada aspecto del template.**


