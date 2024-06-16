![Header Image](assets/header2.png)
# Proyecto de Biblioteca dinámica con API New York Times en JS
## Descripción

Este proyecto consiste en la creación de una libreria por categorías nutrida por la [API de New York Times](https://developer.nytimes.com/), construida de forma dinámica y con un sistema de autenticación y favoritos basado en Firebase. Proyecto desplegado en Pages: https://emiliolatorre.github.io/JS_Biblioteca_NYTimes/

## Objetivos

- ✔️ **Fetch de la API New York Times:** identificar endpoints y fetch para traer datos de categorías y libros.
- ✔️ **Construcción dinámica de la web:** tanto las categorías como sus respectivos libros.
- ✔️ **Filtros de Categorías y Libros:** implementación de filtros de ordenación, selector múltiple y búsqueda.
- ✔️ **Sistema de Autenticación de usuarios:** implementación de login con email basado en módulo Auth de Firebase.
- ✔️ **Sistema de Favoritos:** guardado de libros favoritos en módulo Firestore de Firebase, y visualización dinámica.
- ✔️ **Sistema de Imagen de Perfil:** guardado de imagen en el módulo Cloud Storage de Firebase y visualización dinámica.
- ✔️ **Diseño minimalista y responsive:** basado en el estilo de New York Times, construido con flex y responsive.
- ✔️ **Paginación:** paginación implementada en la vista de libros.
- ✔️ **Despliegue en Github Pages:** proyecto desplegado en el servicio Pages de GitHub.

## Uso de la Web
### Vista de Categorías
La landing page muestra todas las categorías de libros disponibles en tiempo real en la API New York Times. En la parte superior, el usuario puede filtrar las categorías por temporalidad de actualización, por fecha de última actualización, por fecha de actualización mas antigua, por orden alfabético o por selector de categorías.

### Vista de Libros
Clickando en el boton READ MORE! en una categoría concreta, la vista cambia de forma dinámica mostrando los libros disponibles de esa categoría específico, mostrando asimismo los filtros para libros. Aquí el usuario puede filtrar por keywords de Título, de Autor y por orden alfabético de titulos. Los resultados se muestras paginados de cuatro en cuatro.

### Login y Favoritos
El usuario asimismo puede registrarse o logearse para guardar sus libros favoritos, quedando marcado así el icono de favorito al guardar un libro, y pudiendo ver todos sus favoritos desde el boton VER FAVORITOS. Un usuario no logeado no puede utlilizar esta funcionalidad.

### Foto de Perfil
Finalmente, el usuario logeado puede subir una foto de perfil que se mostrará en la esquina superior derecha.

## Scritp: principales funcionalidades
### Vista dinámica de Categorías (Books similar)
Utilización de async / await para traer el json de las categorías, y print dinámico

```javascript
const getIndex = async (url) => {
    try {
        loaderOn();
        const resp = await fetch(url);
        if (resp.ok) {
            const resultado = await resp.json();
            return resultado
        } else {
            throw 'El estado o el stage no son correctos.'
        }
    } catch (error) {
        throw error
    } finally {
        loaderOff();
    }
};

getIndex(`${urlIndex}`)
    .then((resp) => {
        const indexArray = resp.results
        printIndex(indexArray)
        printHeadCategory(indexArray)
    })
    .catch((error) => { console.error(error) })
```

### Filtros para vistas de categorías y libros

```javascript
// Event Index - Filter weekly/monthly
selectUpdated.addEventListener('change', (event) => {...}

// Event Index - Filter Oldest
selectOldest.addEventListener('change', (event) => {...}

// Event Index - Filter Newest
selectNewest.addEventListener('change', (event) => {...}

// Event Index - Filter AZ
selectAZ.addEventListener('change', (event) => {...}

// Event Index - Filter Categories
formCategories.addEventListener('submit', (event) => {...}

// Event Books - Filter Title
formTitulo.addEventListener('submit', (event) => {...}

// Event Book - Filter Author
formAutor.addEventListener('submit', (event) => {...}

// Event Books - Filter AZ
selectAZAutor.addEventListener('change', (event) => {...}

```

### Firebase Configuration

```javascript
const firebaseConfig = {
    apiKey: "<your-api-key>",
    authDomain: "js-biblioteca-nytimes.firebaseapp.com",
    projectId: "js-biblioteca-nytimes",
    storageBucket: "js-biblioteca-nytimes.appspot.com",
    messagingSenderId: "560392236769",
    appId: "1:560392236769:web:00d575e7a78ba0844b51a0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Initialize Firestore
const auth = firebase.auth(); // Initialize Authentication
```


### Firebase Authentication - Registro / Login
Implementación del modulo Auth para crear usuarios y logearse.

```javascript
const createUser = (user) => {
    db.collection("users")
        .add(user)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => console.error("Error adding document: ", error));
};

const signUpUser = (email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            // Saves user in firestore
            createUser({
                id: user.uid,
                email: user.email
            });
            divRegisterContainer.classList.remove('show')

        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
};

// Listener de usuario en el sistema
firebase.auth().onAuthStateChanged(function (user) {
```

### Firebase Firestore - guardado de Libros Favoritos
Implementación del modulo Firestore y diseño de modelo de datos para guardar favoritos.
```javascript
const addBookFav = (uid, bookData) => {
    db.collection("users").where("id", "==", uid)
        .get()
        .then((docs) => {
            docs.forEach(async (doc) => {
                const docId = doc.id;
                const userRef = db.collection('users').doc(docId);

                await userRef.update({ favourites: firebase.firestore.FieldValue.arrayUnion(bookData) })
                    .then(() => {
                        alert('Libro guardado en Favoritos.')
                    })
                    .catch((error) => {
                        throw `Error agregando el libro a favoritos: ${error}`;
                    });
            });
        })
        .catch((error) => {
            alert(error);
        });
};

```

### Firebase Cloud Storage - Foto de Perfil
Implementación del modulo Cloud Storage para almacenar cada user su foto de Perfil.
```javascript
function uploadFile() {
    const user = firebase.auth().currentUser;

    if (user) {
        const uid = user.uid;

    var storageRef = firebase.storage().ref();
    console.log("storage ref", storageRef);
    var file = document.getElementById("files").files[0];
    console.log(file);

    var fixedFileName = 'foto_perfil.jpg';
    var thisRef = storageRef.child(`images/${uid}/${fixedFileName}`);

    thisRef.put(file).then(function (snapshot) {
        alert("File Uploaded")
        console.log('Uploaded a blob or file!');
    });
}
}
```
