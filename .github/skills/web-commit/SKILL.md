---
name: web-commit
description: 'Obligatorio para cualquier commit o push en la web anderbggo.github.io. Use when: hacer commit, commitear, guardar cambios, subir, publicar, desplegar, push, git commit, git push en este repositorio. Todo el historial se reescribe en un único commit llamado "update" y se hace force push a master.'
---

# Commit y push de la web

En este repositorio el historial **siempre** es un único commit con el mensaje exacto `update`.
Cada vez que el usuario pida hacer commit, subir o publicar cambios, se sustituye todo el historial
por un solo commit nuevo con el estado actual y se hace force push. Nunca se crean commits
adicionales ni con otros mensajes, y no se añaden trailers (`Co-authored-by`, etc.).

## Procedimiento

Ejecutar desde la raíz del repositorio (`anderbggo.github.io`), en PowerShell:

1. Validar que la web compila:
   ```powershell
   npm run build
   ```
   Si falla, detenerse y avisar al usuario; no hacer commit.
2. Revisar qué se va a incluir y confirmar que no hay secretos ni archivos no deseados:
   ```powershell
   git status --short
   ```
3. Crear un único commit raíz `update` con todo el contenido actual y mover `master` a él
   (no modifica los archivos de trabajo):
   ```powershell
   git add -A
   $tree = git write-tree
   $commit = git commit-tree $tree -m "update"
   git reset --soft $commit
   ```
4. Comprobar que solo existe ese commit:
   ```powershell
   git --no-pager log --oneline master
   ```
   Debe mostrar exactamente una línea: `<hash> update`.
5. Publicar sobrescribiendo el remoto:
   ```powershell
   git push --force origin master
   ```
6. El push a `master` dispara el workflow `.github/workflows/deploy.yml`, que despliega en GitHub Pages.
   Si el usuario necesita confirmarlo, revisar el estado del workflow en GitHub Actions.
