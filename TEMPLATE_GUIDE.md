# 🚀 Template Base - Guía de Reutilización

Este proyecto es un **template base reutilizable** para crear landing pages modernas y profesionales. Puedes copiarlo, modificarlo y adaptarlo para cualquier tipo de producto o servicio.

## 📋 Checklist de Personalización Rápida

### 1. **Información Básica del Proyecto**

#### `app/layout.tsx`
- [ ] Cambiar `title` en metadata
- [ ] Cambiar `description` en metadata
- [ ] Actualizar Google Analytics ID (si aplica)
- [ ] Cambiar `lang` del HTML si es necesario

#### `package.json`
- [ ] Cambiar `name` del proyecto
- [ ] Actualizar `version` si es necesario

### 2. **Contenido Principal**

#### `app/page.tsx`
- [ ] Modificar título principal (Hero Section)
- [ ] Actualizar descripción del producto
- [ ] Cambiar textos de botones CTA
- [ ] Ajustar secciones según necesidad

#### `app/components/Header.tsx`
- [ ] Cambiar nombre del logo/brand
- [ ] Actualizar enlaces de navegación
- [ ] Modificar botón de acción principal

### 3. **Componentes Específicos**

#### `app/components/HeroTransformation.tsx`
- [ ] Reemplazar imágenes en `/public/IMG/`
- [ ] Actualizar rutas de imágenes
- [ ] Ajustar animaciones si es necesario

#### `app/components/ExamplesGallery.tsx`
- [ ] Cambiar array `examples` con tus imágenes
- [ ] Actualizar títulos y descripciones
- [ ] Modificar rutas de imágenes (`/IMG/example1.jpg`, etc.)

#### `app/components/PricingCard.tsx`
- [ ] Actualizar precios y planes
- [ ] Modificar características (features)
- [ ] Cambiar badges y textos promocionales

### 4. **Colores y Estilos**

#### `app/globals.css`
- [ ] Modificar variables CSS:
  ```css
  --primary: #ff6b35;        /* Color principal */
  --secondary: #4ade80;      /* Color secundario */
  --accent: #3b82f6;        /* Color de acento */
  ```
- [ ] Ajustar paleta según tu marca

#### Buscar y reemplazar colores en componentes:
- `bg-orange-500` → Tu color principal
- `bg-red-500` → Tu color de acción
- `bg-green-500` → Tu color de éxito

### 5. **Imágenes y Assets**

#### `/public/IMG/`
- [ ] Reemplazar todas las imágenes de ejemplo
- [ ] Mantener estructura de nombres o actualizar referencias
- [ ] Optimizar imágenes para web

#### `/public/`
- [ ] Actualizar favicon
- [ ] Reemplazar logos si es necesario

### 6. **Funcionalidad Específica**

#### `app/components/ColorizationApp.tsx`
- [ ] Adaptar para tu funcionalidad específica
- [ ] Modificar lógica de procesamiento
- [ ] Actualizar mensajes y textos de UI

#### `app/api/`
- [ ] Adaptar endpoints según tu backend
- [ ] Actualizar integraciones (Polar, APIs externas, etc.)
- [ ] Modificar lógica de créditos/pagos si aplica

### 7. **Textos y Contenido**

#### Buscar y reemplazar globalmente:
- [ ] Nombre del producto/servicio
- [ ] Descripciones y copy
- [ ] Textos de botones
- [ ] Mensajes de error/éxito
- [ ] Información de contacto

### 8. **Configuración de Entorno**

#### `.env` o `env.example`
- [ ] Actualizar variables de entorno
- [ ] Configurar API keys
- [ ] Ajustar URLs de producción/desarrollo

## 🔄 Proceso de Clonación Rápida

### Paso 1: Copiar el Proyecto
```bash
# Copiar toda la carpeta my-app a tu nuevo proyecto
cp -r my-app mi-nuevo-proyecto
cd mi-nuevo-proyecto
```

### Paso 2: Limpiar Referencias Específicas
```bash
# Buscar y reemplazar en todos los archivos:
# - "Sketcha" → "Tu Producto"
# - "Colorización" → "Tu Funcionalidad"
# - URLs y referencias específicas
```

### Paso 3: Instalar Dependencias
```bash
npm install
# o
pnpm install
```

### Paso 4: Personalizar Según Checklist
Seguir el checklist de arriba punto por punto.

### Paso 5: Probar y Ajustar
```bash
npm run dev
# Revisar cada sección y ajustar según necesidad
```

## 📁 Estructura de Archivos Clave

```
my-app/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.tsx       # Navegación principal
│   │   ├── HeroTransformation.tsx  # Hero con imágenes
│   │   ├── ExamplesGallery.tsx     # Galería de ejemplos
│   │   ├── PricingCard.tsx         # Tarjetas de precios
│   │   └── ColorizationApp.tsx     # App principal (adaptar)
│   ├── page.tsx            # Página principal
│   ├── layout.tsx          # Layout global
│   └── globals.css          # Estilos globales
├── public/                 # Assets estáticos
│   └── IMG/                # Imágenes del proyecto
└── package.json            # Dependencias
```

## 🎨 Componentes Modulares

Cada componente está diseñado para ser independiente y fácilmente modificable:

- **Header**: Navegación y branding
- **HeroTransformation**: Sección hero con antes/después
- **ExamplesGallery**: Galería de ejemplos con grid
- **PricingCard**: Tarjetas de precios con animaciones
- **ColorizationApp**: Funcionalidad principal (adaptar según proyecto)

## 🔧 Personalización Avanzada

### Cambiar Tema de Colores
1. Editar `globals.css` (variables CSS)
2. Buscar clases de Tailwind en componentes
3. Usar herramienta de búsqueda global para reemplazar

### Agregar Nuevas Secciones
1. Crear nuevo componente en `app/components/`
2. Importar en `app/page.tsx`
3. Agregar con animaciones de Framer Motion

### Modificar Animaciones
- Todos los componentes usan `framer-motion`
- Ajustar `initial`, `animate`, `transition` según necesidad
- Ver documentación: https://www.framer.com/motion/

## 📝 Notas Importantes

1. **Mantener estructura**: La estructura de carpetas facilita la navegación
2. **Componentes reutilizables**: Cada componente puede usarse independientemente
3. **Tailwind CSS**: Todos los estilos usan Tailwind, fácil de modificar
4. **TypeScript**: Tipado fuerte ayuda a evitar errores
5. **Next.js 15**: Framework moderno con optimizaciones automáticas

## 🚀 Próximos Pasos

1. Copiar proyecto base
2. Seguir checklist de personalización
3. Adaptar funcionalidad específica
4. Probar en desarrollo
5. Deploy a producción

---

**Este template está diseñado para ser tu punto de partida. Modifícalo, adáptalo y hazlo tuyo! 🎨**



