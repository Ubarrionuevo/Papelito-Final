# ✅ Checklist de Personalización

Usa este checklist para personalizar el template en cada nuevo proyecto.

## 📋 Información Básica

### Metadata y Configuración
- [ ] `app/layout.tsx` - Cambiar `title` en metadata
- [ ] `app/layout.tsx` - Cambiar `description` en metadata
- [ ] `app/layout.tsx` - Actualizar Google Analytics ID (línea 31)
- [ ] `app/layout.tsx` - Cambiar `lang` del HTML si es necesario (línea 27)
- [ ] `package.json` - Cambiar `name` del proyecto
- [ ] `package.json` - Actualizar `version` si es necesario

## 🎨 Branding y Colores

### Colores Principales
- [ ] `app/globals.css` - Cambiar `--primary` (línea 6)
- [ ] `app/globals.css` - Cambiar `--primary-light` (línea 7)
- [ ] `app/globals.css` - Cambiar `--secondary` (línea 8)
- [ ] `app/globals.css` - Cambiar `--accent` (línea 9)

### Buscar y Reemplazar Colores en Código
- [ ] Buscar `bg-orange-500` → Reemplazar con tu color principal
- [ ] Buscar `bg-red-500` → Reemplazar con tu color de acción
- [ ] Buscar `bg-green-500` → Reemplazar con tu color de éxito
- [ ] Buscar `bg-blue-500` → Reemplazar con tu color de información

## 📝 Contenido Textual

### Hero Section
- [ ] `app/page.tsx` - Título principal (línea 33-35)
- [ ] `app/page.tsx` - Descripción (línea 37-39)
- [ ] `app/page.tsx` - Texto botón 1 (línea 44-46)
- [ ] `app/page.tsx` - Texto botón 2 (línea 47-50)

### Header
- [ ] `app/components/Header.tsx` - Nombre del logo/brand (línea 20)
- [ ] `app/components/Header.tsx` - Enlaces de navegación (línea 30-40)
- [ ] `app/components/Header.tsx` - Texto botón principal (línea 50+)

### Examples Gallery
- [ ] `app/components/ExamplesGallery.tsx` - Título sección (línea 38-39)
- [ ] `app/components/ExamplesGallery.tsx` - Descripción sección (línea 41-43)
- [ ] `app/components/ExamplesGallery.tsx` - Ejemplo 1: título y descripción (línea 10-12)
- [ ] `app/components/ExamplesGallery.tsx` - Ejemplo 2: título y descripción (línea 15-17)
- [ ] `app/components/ExamplesGallery.tsx` - Ejemplo 3: título y descripción (línea 20-23)
- [ ] `app/components/ExamplesGallery.tsx` - Texto botón CTA (línea 91)

### Pricing
- [ ] `app/page.tsx` - Título sección pricing (línea 79-80)
- [ ] `app/page.tsx` - Descripción pricing (línea 82-84)
- [ ] `app/page.tsx` - Nombre del plan (línea 96)
- [ ] `app/page.tsx` - Precio (línea 97)
- [ ] `app/page.tsx` - Período (línea 98)
- [ ] `app/page.tsx` - Créditos/Features (línea 99)
- [ ] `app/page.tsx` - Array de características (línea 100-107)
- [ ] `app/page.tsx` - Badge texto (línea 110)

### Contact
- [ ] `app/page.tsx` - Título sección contact (línea 132-134)
- [ ] `app/page.tsx` - Descripción contact (línea 135-137)
- [ ] `app/page.tsx` - Email de contacto (línea 153-157)
- [ ] `app/page.tsx` - Mensaje de respuesta (línea 160)

## 🖼️ Imágenes y Assets

### Imágenes Hero
- [ ] `public/IMG/lineart.jpg` - Reemplazar imagen original
- [ ] `public/IMG/resultado1.png` - Reemplazar resultado 1
- [ ] `public/IMG/resultado2.png` - Reemplazar resultado 2
- [ ] `public/IMG/resultado3.png` - Reemplazar resultado 3
- [ ] `app/components/HeroTransformation.tsx` - Verificar rutas (línea 11-14, 48)

### Imágenes Gallery
- [ ] `public/IMG/example1.jpg` - Reemplazar ejemplo 1
- [ ] `public/IMG/example2.jpg` - Reemplazar ejemplo 2
- [ ] `public/IMG/example3.jpg` - Reemplazar ejemplo 3
- [ ] `app/components/ExamplesGallery.tsx` - Verificar rutas (línea 12, 18, 24)

### Otros Assets
- [ ] `public/favicon.ico` - Reemplazar favicon
- [ ] Logos si es necesario

## ⚙️ Funcionalidad

### ColorizationApp (Adaptar según proyecto)
- [ ] `app/components/ColorizationApp.tsx` - Prompt por defecto (línea 14)
- [ ] `app/components/ColorizationApp.tsx` - Prompts predefinidos (línea 369-390)
- [ ] `app/components/ColorizationApp.tsx` - Mensajes de UI
- [ ] `app/components/ColorizationApp.tsx` - Lógica de procesamiento (si aplica)

### API Routes (Adaptar según backend)
- [ ] `app/api/colorize/route.ts` - Endpoint principal
- [ ] `app/api/credits/route.ts` - Sistema de créditos
- [ ] `app/api/poll-result/route.ts` - Polling
- [ ] `app/api/polar/checkout/route.ts` - Pagos
- [ ] `app/api/webhooks/polar/route.ts` - Webhooks

### Variables de Entorno
- [ ] Crear/actualizar `.env` con tus API keys
- [ ] Configurar URLs de producción/desarrollo
- [ ] Configurar tokens de servicios externos

## 🔍 Búsqueda y Reemplazo Global

### Textos Específicos del Proyecto
- [ ] Buscar "Sketcha" → Reemplazar con nombre de tu producto
- [ ] Buscar "Colorización" → Reemplazar con tu funcionalidad
- [ ] Buscar "Colorize" → Reemplazar con tu acción
- [ ] Buscar referencias a emails/contacto específicos

### URLs y Referencias
- [ ] Actualizar URLs de producción
- [ ] Actualizar enlaces externos
- [ ] Verificar rutas de imágenes

## 🎭 Animaciones (Opcional)

### Personalizar Animaciones
- [ ] Ajustar duraciones si es necesario
- [ ] Modificar delays si es necesario
- [ ] Cambiar tipos de easing si es necesario

## 📊 Analytics y Tracking

### Google Analytics
- [ ] `app/layout.tsx` - Actualizar ID (línea 31)
- [ ] Verificar que el script funcione

### Analytics Custom
- [ ] `app/utils/analytics.ts` - Adaptar eventos según necesidad

## ✅ Testing

### Verificación Final
- [ ] Probar navegación entre secciones
- [ ] Verificar que todas las imágenes carguen
- [ ] Probar responsive en mobile/tablet/desktop
- [ ] Verificar que los colores se apliquen correctamente
- [ ] Probar funcionalidad principal (si aplica)
- [ ] Verificar enlaces y botones
- [ ] Revisar textos y ortografía

## 🚀 Deploy

### Preparación
- [ ] Build de producción sin errores (`npm run build`)
- [ ] Verificar variables de entorno en producción
- [ ] Configurar dominio si es necesario
- [ ] Configurar SSL/HTTPS

---

**Una vez completado este checklist, tu proyecto estará personalizado y listo para usar! 🎉**


