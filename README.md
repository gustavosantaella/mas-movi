<p align="center">
  <img src="assets/images/guayaba-logo.png" alt="Guayaba" width="100" />
</p>

<h1 align="center">Guayaba</h1>

<p align="center">
  <b>Mobility as a Service</b> — Plataforma de transporte inteligente<br/>
  React Native · Expo SDK 54 · TypeScript
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54.0-blue?logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green" />
</p>

---

## 📋 Tabla de contenido

- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Compilación](#-compilación)
- [Convención de commits](#-convención-de-commits)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Scripts disponibles](#-scripts-disponibles)

---

## ✅ Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js     | 18+           |
| npm         | 9+            |
| EAS CLI     | 18.3+         |
| Xcode       | 15+ (iOS)     |
| Android Studio | Hedgehog+ (Android) |

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Verificar versión
eas --version
```

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd mas

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

---

## 🔨 Compilación

### Development Build (recomendado)

Los **development builds** incluyen todos los módulos nativos (`expo-camera`, `expo-image-picker`, `react-native-maps`, etc.) y permiten depuración completa.

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

Una vez compilado, instala el `.ipa` o `.apk` en tu dispositivo y conéctalo al servidor Metro local con `npm start`.

### Preview Build

Para distribución interna (QA, testing):

```bash
eas build --profile preview --platform all
```

### Production Build

Para publicación en App Store / Google Play:

```bash
eas build --profile production --platform all
```

### Publicar actualización OTA (sin recompilar)

```bash
eas update --branch production --message "Descripción del cambio"
```

---

## 📝 Convención de commits

Seguimos una convención basada en **Conventional Commits** adaptada al proyecto. Cada mensaje de commit debe seguir este formato:

```
<tipo>(<ámbito>): <descripción corta>
```

### Tipos de commit

| Tipo     | Uso                                        | Ejemplo                                          |
|----------|--------------------------------------------|--------------------------------------------------|
| `feat`   | Nueva funcionalidad                        | `feat(auth): agregar pantalla de registro`        |
| `fix`    | Corrección de errores                      | `fix(login): corregir validación de email`        |
| `core`   | Cambios en lógica core, servicios o config | `core(api): configurar cliente HTTP con tokens`   |
| `adv`    | Mejora avanzada, optimización o refactor   | `adv(profile): optimizar carga de bottom sheet`   |
| `style`  | Cambios de estilos (sin lógica)            | `style(auth): ajustar colores al tema oficial`    |
| `docs`   | Documentación                              | `docs(readme): actualizar guía de instalación`    |
| `chore`  | Tareas de mantenimiento                    | `chore(deps): actualizar expo a SDK 54`           |
| `test`   | Agregar o modificar tests                  | `test(payment): agregar tests de recarga`         |

### Ámbitos comunes

| Ámbito      | Descripción                          |
|-------------|--------------------------------------|
| `auth`      | Login, registro, sesión              |
| `home`      | Pantalla principal                   |
| `payment`   | Pagos y recargas                     |
| `profile`   | Perfil de usuario                    |
| `ai-route`  | Ruta inteligente con IA              |
| `map`       | Mapa y geolocalización               |
| `theme`     | Sistema de diseño y colores          |
| `ui`        | Componentes reutilizables            |
| `api`       | Servicios y llamadas al backend      |
| `deps`      | Dependencias                         |
| `config`    | Configuración general                |

### Ejemplos reales

```bash
# Nueva funcionalidad
git commit -m "feat(auth): implementar registro multi-step con verificación de identidad"

# Corrección de error
git commit -m "fix(auth): corregir crash de expo-image-picker en Expo Go"

# Cambio en core/infraestructura
git commit -m "core(theme): agregar colores salmon y peach al sistema de diseño"

# Mejora avanzada / refactor
git commit -m "adv(profile): agregar swipe-to-dismiss al bottom sheet con PanResponder"

# Estilos
git commit -m "style(auth): migrar login y register al tema claro oficial"

# Mantenimiento
git commit -m "chore(deps): instalar expo-image-picker"
```

### Reglas

1. **Descripción en minúsculas** — no iniciar con mayúscula
2. **Sin punto final** — no terminar con `.`
3. **Imperativo** — "agregar", no "agregado" ni "agrega"
4. **Máximo 72 caracteres** en la primera línea
5. **Ámbito obligatorio** — siempre incluir entre paréntesis

---

## 📁 Estructura del proyecto

```
src/
├── app/                    # Rutas (Expo Router file-based)
│   ├── (auth)/             # Pantallas de autenticación
│   │   ├── _layout.tsx
│   │   ├── index.tsx       # Redirige a login
│   │   ├── login.tsx
│   │   └── register.tsx    # Registro multi-step
│   ├── (tabs)/             # Navegación con tabs
│   │   ├── index.tsx       # Home
│   │   └── payment.tsx     # Pagos
│   ├── _layout.tsx         # Layout raíz
│   ├── profile.tsx         # Perfil (modal)
│   └── trip-history.tsx    # Historial de viajes
├── components/
│   └── ui/                 # Componentes reutilizables
│       ├── GradientButton.tsx
│       ├── GradientScreen.tsx
│       ├── GlassCard.tsx
│       └── ScreenLayout.tsx
├── features/               # Módulos por funcionalidad
│   ├── auth/
│   │   ├── components/     # StepRole, StepIdentity, StepCredentials...
│   │   └── styles.ts
│   ├── payment/
│   └── profile/
├── theme/                  # Sistema de diseño
│   ├── colors.ts
│   ├── typography.ts
│   └── index.ts
└── constants/
    └── index.ts            # URLs, constantes globales
```

---

## 🛠️ Scripts disponibles

| Comando           | Descripción                           |
|-------------------|---------------------------------------|
| `npm start`       | Inicia Metro Bundler                  |
| `npm run ios`     | Compila y ejecuta en iOS              |
| `npm run android` | Compila y ejecuta en Android          |
| `npm run web`     | Abre en el navegador                  |
| `npm run lint`    | Ejecuta ESLint                        |

---

<p align="center">
  <sub>Hecho con ❤️ por el equipo de <b>Guayaba</b></sub>
</p>
