# 🚀 Template Base - Landing Page Moderna

**Este es un template base reutilizable** para crear landing pages profesionales y modernas. Diseñado para ser copiado, modificado y adaptado para cualquier tipo de producto o servicio.

Construido con Next.js 15, TypeScript, Tailwind CSS 4 y Framer Motion.

## ✨ Características

- **Diseño Minimalista**: Interfaz limpia y moderna con paleta de colores relajante
- **Animaciones Fluidas**: Transiciones suaves y efectos de hover con Framer Motion
- **Responsive**: Optimizado para todos los dispositivos
- **Performance**: Construido con Next.js 15 y Turbopack para máxima velocidad
- **Accesibilidad**: Navegación por teclado y semántica HTML

## 🚀 Tecnologías Utilizadas

- **Framework**: Next.js 15.5.2
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Fuentes**: Geist Sans & Geist Mono

## 📁 Estructura del Proyecto

```
my-app/
├── app/
│   ├── components/
│   │   ├── Button.tsx          # Componente de botón reutilizable
│   │   ├── ExampleCard.tsx     # Tarjeta de ejemplo con animaciones
│   │   ├── Header.tsx          # Header con navegación y efectos de scroll
│   │   ├── PricingCard.tsx     # Tarjeta de precios con hover effects
│   │   └── SmoothScroll.tsx    # Navegación suave entre secciones
│   ├── globals.css             # Estilos globales y variables CSS
│   ├── layout.tsx              # Layout principal de la aplicación
│   └── page.tsx                # Página principal con todas las secciones
├── public/                     # Archivos estáticos
├── package.json                # Dependencias del proyecto
└── README.md                   # Este archivo
```

## 🎯 Secciones de la Landing Page

1. **Header**: Navegación fija con logo y menú responsive
2. **Hero Section**: Título principal y botones de llamada a la acción
3. **Ejemplos**: Muestra de transformaciones antes/después
4. **CTA Section**: Llamada a la acción con diseño atractivo
5. **Precios**: Planes de suscripción con características detalladas
6. **Footer**: Enlaces de contacto y información legal

## 🎨 Paleta de Colores

- **Primario**: Naranja (#ff6b35) - Para acentos y botones principales
- **Secundario**: Verde (#4ade80) - Para elementos de éxito
- **Acento**: Azul (#3b82f6) - Para información y enlaces
- **Neutro**: Grises para texto y fondos
- **Fondo**: Blanco puro para máxima claridad

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd my-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

### Scripts Disponibles
- `npm run dev` - Servidor de desarrollo con Turbopack
- `npm run build` - Construcción optimizada para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificación de código con ESLint

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🎭 Animaciones

- **Entrada**: Fade-in con desplazamiento vertical
- **Hover**: Escalado y elevación de elementos
- **Scroll**: Animaciones basadas en viewport
- **Transiciones**: Suaves entre estados

## 🔧 Personalización

### Guías de Personalización

Este template incluye guías completas para personalización:

- **[TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)** - Guía completa de reutilización
- **[QUICK_START.md](./QUICK_START.md)** - Configuración rápida en 10 minutos
- **[PROJECT_CONFIG.md](./PROJECT_CONFIG.md)** - Documentación de todas las áreas configurables

### Personalización Rápida

1. **Colores**: Modificar variables CSS en `app/globals.css`
2. **Contenido**: Actualizar textos en `app/page.tsx` y componentes
3. **Imágenes**: Reemplazar archivos en `/public/IMG/`
4. **Metadata**: Cambiar título y descripción en `app/layout.tsx`

Ver [QUICK_START.md](./QUICK_START.md) para configuración en 5 minutos.

## 📈 Performance

- **Lazy Loading**: Componentes se cargan solo cuando son visibles
- **Optimización de Imágenes**: Next.js Image component
- **Code Splitting**: Automático con Next.js
- **Turbopack**: Compilación ultra rápida en desarrollo

## 🌐 SEO

- Meta tags optimizados
- Estructura HTML semántica
- Open Graph tags preparados
- Schema markup para mejor indexación

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📚 Documentación Adicional

- **[TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)** - Guía completa de reutilización del template
- **[QUICK_START.md](./QUICK_START.md)** - Configuración rápida paso a paso
- **[PROJECT_CONFIG.md](./PROJECT_CONFIG.md)** - Referencia completa de configuración

## 🎯 Uso como Template Base

Este proyecto está diseñado para ser tu **pipeline de código base**. 

### Proceso de Reutilización:
1. Copiar el proyecto completo
2. Seguir el checklist en [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)
3. Personalizar según tu proyecto específico
4. Adaptar funcionalidad según necesidad

### Características del Template:
- ✅ Estructura modular y reutilizable
- ✅ Componentes independientes
- ✅ Fácil personalización de colores y contenido
- ✅ Sistema de animaciones listo para usar
- ✅ Responsive design incluido
- ✅ SEO optimizado
- ✅ Performance optimizado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Úsalo libremente para tus proyectos.

---

**Template Base** - Tu punto de partida para landing pages profesionales 🚀✨
