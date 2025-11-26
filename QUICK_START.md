# ⚡ Quick Start - Configuración Rápida

Guía rápida para personalizar este template en 10 minutos.

## 🎯 Cambios Esenciales (5 minutos)

### 1. Nombre del Proyecto
```bash
# En package.json
"name": "tu-proyecto-nuevo"

# En app/layout.tsx
title: "Tu Proyecto - Descripción"
description: "Tu descripción aquí"
```

### 2. Colores Principales
```css
/* app/globals.css */
--primary: #TU_COLOR_PRINCIPAL;
--secondary: #TU_COLOR_SECUNDARIO;
```

### 3. Textos Principales
- `app/page.tsx` - Línea 33-38: Título y descripción hero
- `app/components/Header.tsx` - Línea 20: Nombre del logo

### 4. Imágenes
- Reemplazar imágenes en `/public/IMG/`
- Actualizar rutas en `HeroTransformation.tsx` y `ExamplesGallery.tsx`

## 🔄 Búsqueda y Reemplazo Global

Buscar estos términos y reemplazarlos:

| Buscar | Reemplazar con |
|--------|----------------|
| "Sketcha" | "Tu Producto" |
| "Colorización" | "Tu Funcionalidad" |
| "Colorize" | "Tu Acción" |
| `bg-orange-500` | `bg-TU_COLOR-500` |
| `bg-red-500` | `bg-TU_COLOR-500` |

## 📦 Comandos Rápidos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm start
```

## ✅ Checklist Mínimo

- [ ] Cambiar nombre en `package.json`
- [ ] Actualizar metadata en `layout.tsx`
- [ ] Modificar título hero en `page.tsx`
- [ ] Cambiar colores en `globals.css`
- [ ] Reemplazar imágenes en `/public/IMG/`
- [ ] Actualizar textos principales

## 🎨 Personalización Rápida de Colores

### Opción 1: Variables CSS
```css
/* app/globals.css */
:root {
  --primary: #ff6b35;  /* Cambiar aquí */
}
```

### Opción 2: Buscar en código
```bash
# Buscar todas las instancias de un color
grep -r "orange-500" app/
# Reemplazar con tu color
```

## 📱 Estructura Mínima a Modificar

```
app/
├── layout.tsx          ← Metadata y configuración global
├── page.tsx            ← Contenido principal
├── globals.css         ← Colores y estilos
└── components/
    ├── Header.tsx      ← Navegación
    └── [otros]         ← Componentes específicos
```

---

**¡Listo! Tu proyecto base está configurado. Ahora personaliza según tu necesidad específica.**


