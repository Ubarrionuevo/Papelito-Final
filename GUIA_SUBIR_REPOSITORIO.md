# Guía para Subir el Proyecto a un Nuevo Repositorio

## Pasos para subir a un nuevo repositorio

### 1. Crear un nuevo repositorio en GitHub/GitLab/Bitbucket

- Ve a GitHub (github.com), GitLab (gitlab.com) o tu plataforma preferida
- Crea un nuevo repositorio (NO inicialices con README, .gitignore o licencia)
- Copia la URL del repositorio (ejemplo: `https://github.com/tu-usuario/tu-repositorio.git`)

### 2. Cambiar el remoto del proyecto

Abre una terminal en la carpeta `my-app` y ejecuta:

```bash
# Ver remotos actuales
git remote -v

# Opción A: Reemplazar el remoto 'origin' con tu nuevo repositorio
git remote set-url origin https://github.com/tu-usuario/tu-nuevo-repositorio.git

# Opción B: Agregar un nuevo remoto (sin reemplazar origin)
git remote add nuevo-nombre https://github.com/tu-usuario/tu-nuevo-repositorio.git
```

### 3. Subir el código al nuevo repositorio

```bash
# Asegúrate de estar en la rama principal (master o main)
git branch

# Si estás en master y el nuevo repo usa 'main', puedes renombrar:
git branch -M main

# Subir el código
git push -u origin main
# O si mantuviste master:
git push -u origin master

# Si agregaste un remoto con otro nombre:
git push -u nuevo-nombre main
```

### 4. Verificar que se subió correctamente

- Ve a tu repositorio en GitHub/GitLab
- Deberías ver todos tus archivos allí

## Comandos útiles adicionales

```bash
# Ver el estado del repositorio
git status

# Ver los commits
git log --oneline

# Ver los remotos configurados
git remote -v

# Eliminar un remoto (si es necesario)
git remote remove nombre-del-remoto
```

## Nota importante

- El archivo `.gitignore` ya está configurado para ignorar:
  - `node_modules/`
  - Archivos `.env`
  - `.next/` (build de Next.js)
  - Y otros archivos temporales

- Asegúrate de tener un archivo `.env.example` o documentación sobre las variables de entorno necesarias.

