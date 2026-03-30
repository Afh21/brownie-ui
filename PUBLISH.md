# 📦 Publicar en npm

## Primer publicación

### 1. Login
```bash
npm login
```

### 2. Crear organización
Ve a https://www.npmjs.com/org/create y crea `brownie-ui`

### 3. Publicar packages
```bash
# En orden de dependencias
cd packages/core && pnpm publish --access public && cd ../..
cd packages/button && pnpm publish --access public && cd ../..
cd packages/gauge && pnpm publish --access public && cd ../..
cd packages/card && pnpm publish --access public && cd ../..
```

## Actualizar versión (usando changesets)

```bash
# Crear changeset
pnpm changeset

# Versionar packages
pnpm version-packages

# Publicar
pnpm release
```

## Verificar publicación

```bash
npm view @brownie-ui/core versions
npm view @brownie-ui/button versions
npm view @brownie-ui/gauge versions
npm view @brownie-ui/card versions
```

## Instalar desde npm

```bash
npm install @brownie-ui/button @brownie-ui/core
# o
pnpm add @brownie-ui/button @brownie-ui/core
```
