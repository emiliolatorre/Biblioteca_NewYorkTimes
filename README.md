![Header Image](assets/header2.png)
# JS_Biblioteca_NYTimes

## Descripción

Este proyecto consiste en la creación de una libreria por categorías nutrida por la [API de New York Times](https://developer.nytimes.com/), construida de forma dinámica y con un sistema de autenticación y favoritos basado en Firebase. Proyecto desplegado en Pages: https://emiliolatorre.github.io/JS_Biblioteca_NYTimes/

## Objetivos

- ✔️ **Fetch de la API New York Times:** identificar endpoints y fetch para traer datos de categorías y libros.
- ✔️ **Construcción dinámica de la web:** tanto las categorías como sus respectivos libros.
- ✔️ **Sistema de Autenticación de usuarios:** implementación de login con email basado en módulo Auth de Firebase.
- ✔️ **Sistema de Favoritos:** guardado de libros favoritos en módulo Firestore de Firebase, y visualización dinámica.
- ✔️ **Sistema de Imgen de Perfil:** guardado de imagen en el módulo Cloud Storage de Firebase y visualización dinámica.
- ✔️ **Diseño minimalista y responsive:** basado en el estilo de New York Times, construido con flex y responsive.

## Assumptions

- Los alumnos pueden cursar diferentes bootcamps en diferentes promociones y modalidades; no al mismo tiempo.
- Los docentes pueden impartir el mismo bootcamp en diferentes promociones y modalidades.
- La modalidad de los alumnos se deja por completar ya que no se nos ha proporcionado el dato. Interesante para escalabilidad.
- Las docentes Rosalva Ayuso y Angelica Corral estan asociadas a programas sin alumnos, y por tanto sin promocion asociada; no los incluimos hasta tener los datos completos.

## Modelo Entidad-Relación (E/R)

![assets/Modelo_Entidad_Relacion.png](assets/Modelo_Entidad_Relacion.png)

## Modelo Lógico de la Base de Datos

![assets/Modelo_Logico.png](assets/Modelo_Logico.png)

## Estructura de la Base de Datos

La base de datos está compuesta por las siguientes tablas:

- **alumnos**: Almacena información sobre los alumnos.
- **docentes**: Almacena información sobre los docentes.
- **programa_alumnos**: Relaciona los alumnos con los programas en los que están inscritos.
- **programa_docentes**: Relaciona los docentes con los programas en los que enseñan.
- **programas**: Almacena información sobre los programas académicos.
- **promociones**: Almacena información sobre las promociones de los programas.
- **notas**: Almacena las notas de los alumnos en los distintos programas.

## Descripción de las Tablas

### alumnos

- **alumnoid**: Identificador único del alumno (integer).
- **nombre**: Nombre del alumno (text).
- **email**: Dirección de correo electrónico del alumno (text).

### docentes

- **docenteid**: Identificador único del docente (integer).
- **nombre**: Nombre del docente (text).
- **rol**: Rol del docente en la institución (text).

### programa_alumnos

- **programaal_id**: Identificador único de cada programa cursado por cada alumno (integer).
- **alumnoid**: Identificador del alumno (integer).
- **programaid**: Identificador del programa (integer).
- **modalidad**: Modalidad del programa (text).

### programa_docentes

- **programado_id**: Identificador único de cada programa cursado por cada docente (integer).
- **docenteid**: Identificador del docente (integer).
- **programaid**: Identificador del programa (integer).
- **modalidad**: Modalidad del programa (text).

### programas

- **programaid**: Identificador único del programa [vertical - sede - promocion] (integer).
- **vertical**: Identificador del área vertical del programa (text).
- **promocionid**: Identificador de la promoción del programa (integer).
- **sede**: Sede del programa (text).

### promociones

- **promocionid**: Identificador único de la promoción (integer).
- **mes**: Mes de inicio de la promoción (text).
- **fechainicio**: Fecha de inicio de la promoción (text).

### notas

- **programaal_id**: Identificador de la relación programa-alumno (integer).
- **proyecto 1 - 9**: nota de cada proyecto (Apto / No Apto / Null) (text).
- **nombre**: nombre completo del alumno (text).
  

## Queries test
#### Consultar todas las notas de cada alumno (ordenado por vertical y nombre):
```sql
SELECT al.alumnoid, al.nombre, pr.vertical, n.proyecto_hlf, n.proyecto_eda, n.proyecto_bbdd, n.proyecto_deployment,
n.proyecto_webdev, n.proyecto_frontend, n.proyecto_backend, n.proyecto_react, n.proyecto_fullstack
FROM alumnos al
INNER JOIN programa_alumnos pral ON pral.alumnoid = al.alumnoid
INNER JOIN programas pr ON pr.programaid = pral.programaid
INNER JOIN notas n ON n.programaal_id = pral.programaal_id
ORDER BY pr.vertical, al.nombre
```

#### Consultar las notas de un Data Science:
```sql
SELECT al.alumnoid, al.nombre, pr.vertical, n.proyecto_hlf, n.proyecto_eda, n.proyecto_bbdd, n.proyecto_deployment
FROM alumnos al
INNER JOIN programa_alumnos pral ON pral.alumnoid = al.alumnoid
INNER JOIN programas pr ON pr.programaid = pral.programaid
INNER JOIN notas n ON n.programaal_id = pral.programaal_id
WHERE pr.vertical = 'Data Science'
```

#### Consultar la vertical que imparte cada docente:
```sql
SELECT d.docenteid, d.nombre, d.rol, pro.vertical
FROM docentes d
INNER JOIN programa_docentes prd ON prd.docenteid = d.docenteid
INNER JOIN programas pro ON pro.programaid = prd.programaid
INNER JOIN promociones pr ON pr.promocionid = pro.promocionid
```

#### Consultar todos los docentes que imparten una vertical específica:
```sql
SELECT d.docenteid, d.nombre, d.rol, pro.vertical
FROM docentes d
INNER JOIN programa_docentes prd ON prd.docenteid = d.docenteid
INNER JOIN programas pro ON pro.programaid = prd.programaid
INNER JOIN promociones pr ON pr.promocionid = pro.promocionid
WHERE pro.vertical = 'Full Stack'
```

#### Consultar todos los docentes que tienen un rol específico:
```sql
SELECT d.docenteid, d.nombre, d.rol, pro.vertical
FROM docentes d
INNER JOIN programa_docentes prd ON prd.docenteid = d.docenteid
INNER JOIN programas pro ON pro.programaid = prd.programaid
INNER JOIN promociones pr ON pr.promocionid = pro.promocionid
WHERE d.rol = 'TA'
```

#### Consultar a qué promoción está apuntado cada alumno y en qué día empezó:
```sql
SELECT al.alumnoid, al.nombre, pr.mes, pr.fechainicio
FROM alumnos al
INNER JOIN programa_alumnos pral ON pral.alumnoid = al.alumnoid
INNER JOIN programas pro ON pro.programaid = pral.programaid
INNER JOIN promociones pr ON pr.promocionid = pro.promocionid
```

#### Consultar cuantos alumnos le corresponde a cada docente:
```sql
SELECT DISTINCT doc.docenteid AS "DocenteID", doc.nombre AS "NombreProfesor", count(al.alumnoid) AS "AlumnosPorDocente"
FROM alumnos al
INNER JOIN programa_alumnos pral ON pral.alumnoid = al.alumnoid
INNER JOIN programas pro ON pro.programaid = pral.programaid
INNER JOIN programa_docentes prd ON prd.programaid = pro.programaid
INNER JOIN docentes doc ON doc.docenteid = prd.docenteid
GROUP BY  doc.docenteid, doc.nombre
```
