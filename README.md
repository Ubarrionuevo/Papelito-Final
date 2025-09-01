# 🎨 Sketcha - Colorización Inteligente de Bocetos

Una landing page moderna y elegante para un servicio de colorización de bocetos con inteligencia artificial, construida con Next.js 15, TypeScript, Tailwind CSS 4 y Framer Motion.

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

### Colores
Los colores se pueden personalizar en `app/globals.css` modificando las variables CSS:

```css
:root {
  --primary: #ff6b35;        /* Color principal */
  --secondary: #4ade80;      /* Color secundario */
  --accent: #3b82f6;        /* Color de acento */
}
```

### Contenido
El contenido se puede modificar directamente en `app/page.tsx` en los arrays `examples` y `plans`.

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

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: [Sketcha Landing Page](https://github.com/tu-usuario/sketcha)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/sketcha/issues)

---

**Sketcha** - Transformando bocetos en obras maestras con inteligencia artificial 🎨✨
