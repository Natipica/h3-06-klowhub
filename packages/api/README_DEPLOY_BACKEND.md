# Instrucciones para ejecutar el proyecto con Docker y Prisma

Este archivo describe cómo levantar los contenedores de Docker para PostgreSQL, realizar la migración de Prisma y ejecutar el backend de tu proyecto.

## 1. Levantar los contenedores

En el directorio del proyecto, navega a la carpeta donde se encuentra el archivo `docker-compose.yml` que define los servicios de Docker. En este caso, el archivo se encuentra en la carpeta `docker/postgres/`.

1. Navega a la carpeta `docker/postgres/`:

    ```bash
    cd docker/postgres/
    ```

2. Levanta los contenedores con el siguiente comando:

    ```bash
    docker-compose up --build
    ```

Este comando construirá y levantará los contenedores según lo especificado en el archivo `docker-compose.yml` (incluyendo el servicio de PostgreSQL).

## 2. Ejecutar la migración de Prisma

Una vez que los contenedores estén levantados y PostgreSQL esté corriendo, realiza la migración de la base de datos utilizando Prisma.

1. Navega de nuevo al directorio raíz.

2. Ejecuta la migración de Prisma para sincronizar el esquema de la base de datos con los cambios del archivo `schema.prisma`:

    ```bash
    pnpm run prisma:migrate
    ```

Este comando aplicará las migraciones a la base de datos de desarrollo.

## 3. Ejecutar el backend en modo de desarrollo

Una vez que la migración se haya aplicado correctamente, puedes iniciar el servidor backend en modo de desarrollo.

    ```bash
    pnpm run backend:dev
    ```

Esto levantará el backend de tu aplicación y lo dejará corriendo en el entorno de desarrollo.

---

¡Con estos pasos, tu proyecto debería estar corriendo con Docker y Prisma, y listo para ser utilizado en desarrollo!