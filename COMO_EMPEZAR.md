# 🎮 Cómo Crear un Proyecto Nuevo - Guía Súper Simple

¡Hola! Esta guía te explica cómo crear un proyecto nuevo usando este template, explicado de forma muy fácil. 😊

## 🎯 ¿Qué vas a hacer?

Vas a **copiar** este proyecto y **cambiarlo** para que sea tu proyecto nuevo. Es como copiar un dibujo y luego pintarlo de otros colores.

---

## 📋 Paso 1: Copiar la Carpeta

### ¿Qué hacer?
1. Ve a tu escritorio
2. Busca la carpeta `IAColorize`
3. Abre la carpeta `my-app`
4. **Copia toda la carpeta** (Click derecho → Copiar, o Ctrl+C)
5. Pega la carpeta en otro lugar (Click derecho → Pegar, o Ctrl+V)
6. **Renombra** la carpeta nueva con el nombre de tu proyecto
   - Ejemplo: Si tu proyecto se llama "Mi Tienda", renombra la carpeta a `mi-tienda`

✅ **Listo!** Ya tienes una copia del proyecto.

---

## 📂 Paso 2: Abrir el Proyecto

### ¿Qué hacer?
1. Abre tu editor de código (VS Code, Cursor, etc.)
2. Abre la carpeta nueva que acabas de crear
3. Abre una terminal en la carpeta (en VS Code: Terminal → New Terminal)

✅ **Listo!** Ya tienes el proyecto abierto.

---

## 📦 Paso 3: Instalar las Cosas Necesarias

### ¿Qué hacer?
En la terminal, escribe esto y presiona Enter:

```bash
npm install
```

**¿Qué hace esto?** Descarga todas las herramientas que necesita tu proyecto para funcionar.

⏳ **Espera** a que termine (puede tardar 1-2 minutos)

✅ **Listo!** Ya tienes todo instalado.

---

## ✏️ Paso 4: Cambiar el Nombre del Proyecto

### ¿Qué hacer?
1. Abre el archivo llamado `package.json`
2. Busca la línea que dice `"name": "my-app"`
3. Cámbiala por el nombre de tu proyecto
   - Ejemplo: `"name": "mi-tienda"`

✅ **Listo!** Ya cambiaste el nombre.

---

## 📝 Paso 5: Cambiar los Textos Principales

### 5.1 Cambiar el Título Grande (Hero)

1. Abre el archivo `app/page.tsx`
2. Busca la línea que dice algo como `"Bring Your Sketches to Life"`
3. Cámbiala por el título de tu proyecto
   - Ejemplo: `"Mi Tienda Online"`

### 5.2 Cambiar la Descripción

1. En el mismo archivo, busca la descripción (el texto que explica qué hace tu proyecto)
2. Cámbiala por la descripción de tu proyecto

### 5.3 Cambiar el Nombre en el Header

1. Abre el archivo `app/components/Header.tsx`
2. Busca el nombre del logo (probablemente dice "Sketcha" o algo similar)
3. Cámbialo por el nombre de tu proyecto

✅ **Listo!** Ya cambiaste los textos principales.

---

## 🎨 Paso 6: Cambiar los Colores

### ¿Qué hacer?
1. Abre el archivo `app/globals.css`
2. Busca estas líneas:

```css
--primary: #ff6b35;        /* Este es el color naranja */
--secondary: #4ade80;      /* Este es el color verde */
--accent: #3b82f6;        /* Este es el color azul */
```

3. Cambia los números después del `#` por los colores que quieras
   - Puedes buscar colores en: https://htmlcolorcodes.com/
   - Ejemplo: `--primary: #ff0000;` (rojo)

✅ **Listo!** Ya cambiaste los colores.

---

## 🖼️ Paso 7: Cambiar las Imágenes

### ¿Qué hacer?
1. Ve a la carpeta `public/IMG/`
2. Reemplaza las imágenes que están ahí con tus propias imágenes
3. **IMPORTANTE:** Mantén los mismos nombres de archivo
   - Si hay una imagen llamada `example1.jpg`, tu nueva imagen también debe llamarse `example1.jpg`
   - O cambia el nombre en el código (pero eso es más complicado)

✅ **Listo!** Ya cambiaste las imágenes.

---

## 🚀 Paso 8: Probar que Funcione

### ¿Qué hacer?
1. En la terminal, escribe esto y presiona Enter:

```bash
npm run dev
```

2. Espera a que aparezca un mensaje que dice algo como:
   ```
   Local: http://localhost:3000
   ```

3. Abre tu navegador (Chrome, Firefox, etc.)
4. Escribe en la barra de direcciones: `http://localhost:3000`
5. Presiona Enter

✅ **¡Listo!** Deberías ver tu proyecto funcionando.

---

## 🎉 Paso 9: ¡Ya Está!

¡Felicidades! Ya tienes tu proyecto nuevo funcionando.

### ¿Qué puedes hacer ahora?

- **Ver tu proyecto:** Abre `http://localhost:3000` en el navegador
- **Hacer cambios:** Edita los archivos y verás los cambios automáticamente
- **Cambiar más cosas:** Sigue el archivo `CUSTOMIZATION_CHECKLIST.md` para cambiar más detalles

---

## ❓ ¿Algo no funciona?

### Problema: "npm install no funciona"
**Solución:** Asegúrate de tener Node.js instalado. Descárgalo de: https://nodejs.org/

### Problema: "No veo los cambios"
**Solución:** 
1. Guarda el archivo (Ctrl+S)
2. Recarga la página en el navegador (F5)

### Problema: "Las imágenes no aparecen"
**Solución:** 
1. Verifica que las imágenes estén en la carpeta `public/IMG/`
2. Verifica que tengan el nombre correcto
3. Recarga la página

---

## 📚 ¿Quieres Cambiar Más Cosas?

Si quieres cambiar más cosas (precios, botones, secciones, etc.), abre el archivo:

**`CUSTOMIZATION_CHECKLIST.md`**

Ahí encontrarás una lista de TODO lo que puedes cambiar, paso a paso.

---

## 🎯 Resumen Rápido

1. ✅ Copiar carpeta `my-app`
2. ✅ Renombrar la carpeta nueva
3. ✅ Abrir en editor
4. ✅ Escribir `npm install` en terminal
5. ✅ Cambiar nombre en `package.json`
6. ✅ Cambiar textos en `app/page.tsx`
7. ✅ Cambiar colores en `app/globals.css`
8. ✅ Cambiar imágenes en `public/IMG/`
9. ✅ Escribir `npm run dev` en terminal
10. ✅ Abrir `http://localhost:3000` en navegador

**¡Y listo! 🎉**

---

**¿Tienes dudas?** Revisa los otros archivos de documentación o pregunta. 😊



