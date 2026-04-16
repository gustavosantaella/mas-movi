# Guayaba API

API Gateway + microservicios para la aplicación **Movimas**.

## Requisitos

- [Bun](https://bun.sh/) v1.x
- PostgreSQL
- Node.js (para el proxy)

## Estructura

```
guayaba-api/
├── proxy.js                  # API Gateway (puerto 4500)
├── guayaba-auth-api/         # Microservicio de autenticación (puerto 3000)
└── ...
```

## Instalación

```bash
# Instalar dependencias del proxy
bun install

# Instalar dependencias del microservicio auth
cd guayaba-auth-api && bun install
```

## Variables de entorno

Copiar el archivo `.env` en cada microservicio. Ejemplo para `guayaba-auth-api/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=""
DB_DATABASE=

JWT_SECRET=tu_secreto_aqui

GEMINI_API_KEY_SECRET=tu_api_key_de_gemini
```

## Levantar el proyecto

```bash
# Terminal 1: Proxy (API Gateway)
bun proxy.js

# Terminal 2: Microservicio Auth
cd guayaba-auth-api && bun run start:dev
```

El proxy escucha en `http://localhost:4500/api/` y redirige:

| Ruta         | Puerto | Microservicio |
| ------------ | ------ | ------------- |
| `/api/auth`  | 3000   | guayaba-auth  |

## Configuración de Firewall (Windows)

Para probar desde un dispositivo móvil en la misma red local, es necesario abrir los puertos en el firewall de Windows.

> ⚠️ Estos comandos deben ejecutarse en una terminal con **permisos de administrador**.

```bash
# Abrir puerto del API Gateway
netsh advfirewall firewall add rule name="Guayaba API Gateway" dir=in action=allow protocol=TCP localport=4500

# Abrir puerto del microservicio Auth (opcional, si se conecta directo)
netsh advfirewall firewall add rule name="Guayaba Auth API" dir=in action=allow protocol=TCP localport=3000
```

Para verificar tu IP local:

```bash
ipconfig
```

Luego en la app móvil, usar la IP de tu PC en vez de `localhost`. Ejemplo: `http://192.168.1.X:4500/api/`.

### Eliminar reglas de firewall

Si necesitas cerrar los puertos después:

```bash
netsh advfirewall firewall delete rule name="Guayaba API Gateway"
netsh advfirewall firewall delete rule name="Guayaba Auth API"
```
