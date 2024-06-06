//**** AUTHENTICATION ****

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9hBu4RiD1Mway_n7S2N7q9wu6ffHAJEs",
    authDomain: "js-biblioteca-nytimes.firebaseapp.com",
    projectId: "js-biblioteca-nytimes",
    storageBucket: "js-biblioteca-nytimes.appspot.com",
    messagingSenderId: "560392236769",
    appId: "1:560392236769:web:00d575e7a78ba0844b51a0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
const db = firebase.firestore();// db representa mi BBDD //inicia Firestore
const auth = firebase.auth();



//**** CONSTANTS ****

// API NYTimes
const apiKey = '6M27vjBFvWMv2cJNyYVuFobzfRm0quel'
const urlIndex = `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel`

const containerListas = document.querySelector('#containerListas')
const fragment = document.createDocumentFragment()
const titleLista = document.querySelector('#titleLista')
const btnAtras = document.querySelector('#btnAtras')
const selectUpdated = document.querySelector('#updated')
const selectOldest = document.querySelector('#oldest')
const selectNewest = document.querySelector('#newest')
const selectAZ = document.querySelector('#az')
const formCategories = document.querySelector('#formCategories')
const selectCategories = document.querySelector('#selectCategories')
const loader = document.querySelector('#loader')
const sectionFiltrosIndex = document.querySelector('#sectionFiltrosIndex');
const sectionFiltrosBooks = document.querySelector('#sectionFiltrosBooks');
const formTitulo = document.querySelector('#formTitulo');
const formAutor = document.querySelector('#formAutor');
const selectAZAutor = document.querySelector('#azAutor');
const btnFavPrint = document.querySelector('#btnFavPrint');

sectionFiltrosBooks.style.display = 'none';


//**** EVENTS ****

// Events Delegation - Buttons
document.addEventListener('click', (event) => {
    if (event.target.matches('.btnLista')) {
        sectionFiltrosIndex.style.display = 'none';
        sectionFiltrosBooks.style.display = 'flex';
        containerListas.innerHTML = '';
        const lista = event.target.id;
        const listaArray = lista.split(' ');
        const listaGuiones = listaArray.join('-');
        urlBooks = `https://api.nytimes.com/svc/books/v3/lists/${listaGuiones}.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel`;
        getBooks(urlBooks)
            .then((resp) => {
                const booksArray = resp.results
                printBooks(booksArray)
            })
            .catch((error) => { console.error(error) })
    }

    if (event.target.matches('#btnAtras')) {
        titleLista.innerHTML = '';
        containerListas.innerHTML = '';
        sectionFiltrosIndex.style.display = 'flex';
        sectionFiltrosBooks.style.display = 'none';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                printIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    }

    if (event.target.matches('.btnBuy')) {
        const amazonURL = event.target.id;
        window.open(amazonURL, '_blank');
    }

    if (event.target.matches('#btnFooter')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Event Index - Filter weekly/monthly
selectUpdated.addEventListener('change', (event) => {
    if (event.target.value === 'Todas') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                printIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'Monthly') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoMonthly = arrayResultado.filter(element => element.updated === 'MONTHLY')
                printIndex(resultadoMonthly)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'Weekly') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoMonthly = arrayResultado.filter(element => element.updated === 'WEEKLY')
                printIndex(resultadoMonthly)
            })
            .catch((error) => { console.error(error) })
    }
    selectOldest.value = 'Todas'
    selectNewest.value = 'Todas'
    selectAZ.value = 'Todas'
    selectCategories.value = 'Todas'
});

// Event Index - Filter Oldest
selectOldest.addEventListener('change', (event) => {
    if (event.target.value === 'Todas') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                printIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'Ascendente') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoAscendente = arrayResultado.sort((a, b) => new Date(a.oldest_published_date) - new Date(b.oldest_published_date));
                printIndex(resultadoAscendente)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'Descendente') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoDescendente = arrayResultado.sort((a, b) => new Date(b.oldest_published_date) - new Date(a.oldest_published_date));
                printIndex(resultadoDescendente)
            })
            .catch((error) => { console.error(error) })
    }
    selectUpdated.value = 'Todas'
    selectNewest.value = 'Todas'
    selectAZ.value = 'Todas'
    selectCategories.value = 'Todas'
});

// Event Index - Filter Newest
selectNewest.addEventListener('change', (event) => {
    if (event.target.value === 'Todas') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                printIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'Ascendente') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoAscendente = arrayResultado.sort((a, b) => new Date(a.newest_published_date) - new Date(b.newest_published_date));
                printIndex(resultadoAscendente)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'Descendente') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoDescendente = arrayResultado.sort((a, b) => new Date(b.newest_published_date) - new Date(a.newest_published_date));
                printIndex(resultadoDescendente)
            })
            .catch((error) => { console.error(error) })
    }
    selectUpdated.value = 'Todas'
    selectOldest.value = 'Todas'
    selectAZ.value = 'Todas'
    selectCategories.value = 'Todas'
});

// Event Index - Filter AZ
selectAZ.addEventListener('change', (event) => {
    if (event.target.value === 'Todas') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                printIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'AZ') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoAZ = arrayResultado.sort((a, b) => a.list_name.localeCompare(b.list_name));
                printIndex(resultadoAZ)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'ZA') {
        containerListas.innerHTML = '';
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const arrayResultado = resp.results
                const resultadoZA = arrayResultado.sort((a, b) => b.list_name.localeCompare(a.list_name));
                printIndex(resultadoZA)
            })
            .catch((error) => { console.error(error) })
    }
    selectUpdated.value = 'Todas'
    selectOldest.value = 'Todas'
    selectNewest.value = 'Todas'
    selectCategories.value = 'Todas'
});

// Event Index - Filter Categories
formCategories.addEventListener('submit', (event) => {
    event.preventDefault();
    const select = document.querySelector('#selectCategories');
    const selectedOptions = Array.from(select.selectedOptions);
    const values = selectedOptions.map(option => option.value);
    containerListas.innerHTML = '';

    getIndex(`${urlIndex}`)
        .then((resp) => {
            const arrayResultado = resp.results;
            if (values.includes('Todas')) {
                printIndex(arrayResultado)
            } else {
                const resultadoCategories = arrayResultado.filter(element => values.includes(element.list_name));
                printIndex(resultadoCategories)
            }
        })
        .catch((error) => { console.error(error) })

    selectUpdated.value = 'Todas'
    selectOldest.value = 'Todas'
    selectNewest.value = 'Todas'
    selectAZ.value = 'Todas'
});

// Event Books - Filter Title
formTitulo.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputTitulo = [formTitulo.titulo.value.toUpperCase()];
    console.log(inputTitulo)
    getBooks(urlBooks)
        .then((resp) => {
            const resultsArray = resp.results
            const booksArray = resultsArray.books
            const matchTitulo = booksArray.filter(element => element.title.includes(inputTitulo))
            console.log(matchTitulo)
            printBooksFiltered(matchTitulo)
        })
        .catch((error) => { console.error(error) })
    formAutor.reset()
});

// Event Book - Filter Author
formAutor.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputAutor = [formAutor.autor.value];
    getBooks(urlBooks)
        .then((resp) => {
            const resultsArray = resp.results
            const booksArray = resultsArray.books
            const matchTitulo = booksArray.filter(element => element.author.includes(inputAutor))
            console.log(matchTitulo)
            printBooksFiltered(matchTitulo)
        })
        .catch((error) => { console.error(error) })
    formTitulo.reset()
});

// Event Books - Filter AZ
selectAZAutor.addEventListener('change', (event) => {
    // const lista = document.querySelector('#h1Lista')
    //     const listaArray = lista.split(' ');
    //     const listaGuiones = listaArray.join('-');
    // urlBooks = `https://api.nytimes.com/svc/books/v3/lists/${listaGuiones}.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel`;
    if (event.target.value === 'Todas') {
        containerListas.innerHTML = '';
        getBooks(urlBooks)
            .then((resp) => {
                const arrayResultados = resp.results
                const BooksArray = arrayResultados.books
                printBooksFiltered(BooksArray)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'AZ') {
        containerListas.innerHTML = '';
        getBooks(urlBooks)
            .then((resp) => {
                const arrayResultados = resp.results
                const BooksArray = arrayResultados.books
                const resultadoAZ = BooksArray.sort((a, b) => a.author.localeCompare(b.author));
                printBooksFiltered(resultadoAZ)
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'ZA') {
        containerListas.innerHTML = '';
        getBooks(urlBooks)
            .then((resp) => {
                const arrayResultados = resp.results
                const BooksArray = arrayResultados.books
                const resultadoZA = BooksArray.sort((a, b) => b.author.localeCompare(a.author));
                printBooksFiltered(resultadoZA)
            })
            .catch((error) => { console.error(error) })
    }
});

//**** FUNCTIONS ****

// Loader
const loaderOn = () => loader.style.display = 'flex';
const loaderOff = () => loader.style.display = 'none';

// INDEX

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
}

getIndex(`${urlIndex}`)
    .then((resp) => {
        const indexArray = resp.results
        printIndex(indexArray)
        printHeadCategory(indexArray)
    })
    .catch((error) => { console.error(error) })

const printIndex = (array) => {
    array.forEach(({ list_name, newest_published_date, oldest_published_date, updated }) => {
        const divLista = document.createElement('div');
        divLista.classList.add('cardListas');

        const nameLista = document.createElement('h2');
        nameLista.innerHTML = list_name;
        nameLista.classList.add('nameLista');
        const divisor = document.createElement('hr');
        divisor.classList.add('divisor');

        const dateOld = document.createElement('p');
        dateOld.innerHTML = `Oldest: ${oldest_published_date}`

        const dateNew = document.createElement('p');
        dateNew.innerHTML = `Newest: ${newest_published_date}`

        const update = document.createElement('p');
        update.innerHTML = `Updated: ${updated}`

        const btn = document.createElement('button')
        btn.innerHTML = `READ MORE!<img id="flecha_triangulo_derecha" src="assets/flecha_triangulo_derecha.png" alt="Icono flecha derecha">`
        btn.id = list_name;
        btn.classList.add('btnLista');

        divLista.append(nameLista, divisor, dateOld, dateNew, update, btn)
        fragment.append(divLista)
    })
    containerListas.append(fragment)
}

// BOOKS

const printHeadCategory = (array) => {
    array.forEach(({ list_name }) => {
        const option = document.createElement('option');
        option.value = list_name;
        option.innerHTML = list_name
        fragment.append(option);
    })
    selectCategories.append(fragment);
};

const getBooks = async (url) => {
    try {
        loaderOn();
        const resp = await fetch(url);
        if (resp.ok) {
            const resultado = await resp.json();
            return resultado;
        } else {
            throw 'El estado o el stage no son correctos.'
        }
    } catch (error) {
        throw error
    } finally {
        loaderOff();
    }
}

const printBooks = (array) => {
    const arrayBooks = array.books
    arrayBooks.forEach(({ book_image, weeks_on_list, description, rank, title, amazon_product_url }) => {
        const divBook = document.createElement('div');
        divBook.classList.add('cardBooks');

        const imgBook = document.createElement('img');
        imgBook.src = `${book_image}`;

        const weeks = document.createElement('p');
        weeks.innerHTML = `Weeks on List: ${weeks_on_list}`;
        weeks.classList.add('weeks');

        const descriptionBook = document.createElement('p');
        descriptionBook.innerHTML = description;
        descriptionBook.classList.add('descriptionBook');

        const rankTitle = document.createElement('h2');
        rankTitle.innerHTML = `#${rank} ${title}`

        const btn = document.createElement('button');
        btn.innerHTML = `BUY AT AMAZON<img id="flecha_derecha" src="assets/flecha_derecha.png" alt="Icono flecha derecha">`;
        btn.classList.add('btnBuy')
        btn.id = amazon_product_url

        const btnFav = document.createElement('button')
        btnFav.innerHTML = `<img class="corazon_favorito" src="assets/favorito.png" alt="Icono corazón favorito" style="pointer-events: none;">`;
        btnFav.classList.add('btnFav');
        btnFav.id = `{"book_image": "${book_image}", "weeks_on_list": "${weeks_on_list}", "description": "${description}", "rank": "${rank}", "title": "${title}", "amazon_product_url": "${amazon_product_url}"}`;

        const divBtns = document.createElement('div');
        divBtns.id = 'divBtns';

        divBtns.append(btn, btnFav)
        divBook.append(rankTitle, imgBook, weeks, descriptionBook, divBtns);
        fragment.append(divBook);
    })
    const lista = document.createElement('h1');
    lista.innerHTML = array.list_name
    lista.id = 'h1Lista'
    titleLista.append(lista)
    containerListas.append(fragment);
};

const printBooksFiltered = (array) => {
    array.forEach(({ book_image, weeks_on_list, description, rank, title, amazon_product_url }) => {
        const divBook = document.createElement('div');
        divBook.classList.add('cardBooks');

        const imgBook = document.createElement('img');
        imgBook.src = `${book_image}`;

        const weeks = document.createElement('p');
        weeks.innerHTML = `Weeks on List: ${weeks_on_list}`;
        weeks.classList.add('weeks');

        const descriptionBook = document.createElement('p');
        descriptionBook.innerHTML = description;
        descriptionBook.classList.add('descriptionBook');

        const rankTitle = document.createElement('h2');
        rankTitle.innerHTML = `#${rank} ${title}`

        const btn = document.createElement('button');
        btn.innerHTML = `BUY AT AMAZON<img id="flecha_derecha" src="assets/flecha_derecha.png" alt="Icono flecha derecha">`;
        btn.classList.add('btnBuy')
        btn.id = amazon_product_url

        const btnFav = document.createElement('button')
        btnFav.innerHTML = `<img class="corazon_favorito" src="assets/favorito.png" alt="Icono corazón favorito" style="pointer-events: none;">`
        btnFav.classList.add('btnFav');
        btnFav.id = `{"book_image": "${book_image}", "weeks_on_list": "${weeks_on_list}", "description": "${description}", "rank": "${rank}", "title": "${title}", "amazon_product_url": "${amazon_product_url}"}`;

        const divBtns = document.createElement('div');
        divBtns.id = 'divBtns';

        divBtns.append(btn, btnFav)
        divBook.append(rankTitle, imgBook, weeks, descriptionBook, divBtns);
        fragment.append(divBook);
    })
    containerListas.innerHTML = ''
    containerListas.append(fragment);
};

//**** AUTHENTICATION ****

const createUser = (user) => {
    db.collection("users")
        .add(user)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            readAll();
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
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // Saves user in firestore
            createUser({
                id: user.uid,
                email: user.email
            });

        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
};

document.getElementById("formRegister").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;

    pass === pass2 ? signUpUser(email, pass) : alert("error password");
})

const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`)
            alert(`se ha logado ${user.email} ID:${user.uid}`)
            console.log("USER", user);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)
        btnFavPrint.style.display = 'none'
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
}

document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass)
})
document.getElementById("salir").addEventListener("click", signOut);

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        document.getElementById("message").innerText = `Está en el sistema: ${user.uid}`;

        btnFavPrint.style.display = 'flex'

    } else {
        console.log("no hay usuarios en el sistema");
        document.getElementById("message").innerText = `No hay usuarios en el sistema`;
    }
});

document.addEventListener('click', async (event) => {
    if (event.target.matches('.btnFav')) {
        const user = firebase.auth().currentUser;

        if (user) {
        const bookData = JSON.parse(event.target.id)
        addBookFav(user.uid, bookData)
        } else {
            alert('Regístrate para guardar en Favoritos.')
        }
    }});

const addBookFav = (uid, bookData) => {
        db.collection("users").where("id", "==", uid)
          .get()
          .then((docs) => {
            docs.forEach(async (doc) => {
                const docId = doc.id
                const userRef = db.collection('users').doc(docId);

        await userRef.update({favourites: firebase.firestore.FieldValue.arrayUnion(bookData)})
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
      }
      
document.addEventListener('click', async (event) => {
    if (event.target.matches('#btnFavPrint')) {
        const user = firebase.auth().currentUser;
        db.collection("users").where("id", "==", user.uid)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
                const dataBooksToPrint = doc.data().favourites;
                printBooksFiltered(dataBooksToPrint)
            })
        })
    }})


// - Paginación: mostrar libros de 5 en 5
// Desplegar proyecto en GitHub pages para hacer hosting de la web (editado)
/* Especificaciones (Fase II - Firebase):

Autenticación con Firebase auth: Los usuarios que se autentiquen podrán guardar sus favoritos
Añadir un botón de favoritos en cada libro
Los favoritos se guardarán en en Firebase Firestore
Necesitarás una vista extra en el front para que cada usuario pueda ver sus favoritos
*/

/* MODELO DE DATOS:
- Coleccion: usuarios
- Documento: id de usuario
- Data o Campos:
    - Email
    - Password
    - Favoritos: {
        book_image: ***,
        weeks_on_list: ***,
        description: ***,
        rank: ***,
        title: ***,
        amazon_product_url: ***
    }

al darle a like, no funciona si no estas logeado (alert o llevarlo a register / login)
una vez logeado, cada like crear un objeto libro dentro del mapa Favoritos


*/