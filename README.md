# Twistedbrody.github.io
# 📂 Estructura del Proyecto - TwsitedBrody

Este documento describe la estructura de archivos y carpetas del proyecto.

## 📁 Estructura de directorios

```plaintext
twsitedbrody_extracted/
└── project/
    ├── .bolt/                  # Configuración interna
    │   ├── config.json
    │   ├── prompt
    ├── src/                     # Código fuente principal
    │   ├── App.tsx              # Componente principal
    │   ├── main.tsx             # Punto de entrada de React
    │   ├── index.css            # Estilos globales
    │   ├── vite-env.d.ts        # Tipos de Vite
    ├── .gitignore               # Archivos ignorados por Git
    ├── index.html               # Punto de entrada HTML
    ├── package.json             # Dependencias y scripts de npm
    ├── package-lock.json        # Registro de versiones de dependencias
    ├── postcss.config.js        # Configuración de PostCSS
    ├── tailwind.config.js       # Configuración de Tailwind CSS
    ├── tsconfig.json            # Configuración principal de TypeScript
    ├── tsconfig.app.json        # Configuración específica para la app
    ├── tsconfig.node.json       # Configuración para Node.js
    ├── vite.config.ts           # Configuración de Vite
```
> [!IMPORTANT]
> Instalar Node.js es esencial para gestionar dependencias, ejecutar el servidor local. Sin él, no podrás ejecutarla web correctamente.
```bash
cd ruta/donde/esta/twsitedbrody_extracted/project
```
```bash
npm install
```
```bash
npm run dev
```
> [!NOTE]
> Abre el enlace en tu navegador y listo, ya debería funcionar.
```
Local: http://localhost:5173/
```


