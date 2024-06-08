//**** FIREBASE_Firestore_Auth ****

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

const containerListas = document.querySelector('#containerListas');
const fragment = document.createDocumentFragment();
const titleLista = document.querySelector('#titleLista');
const btnAtras = document.querySelector('#btnAtras');
const btnAtrasBooks = document.querySelector('#btnAtrasBooks');
const selectUpdated = document.querySelector('#updated');
const selectOldest = document.querySelector('#oldest');
const selectNewest = document.querySelector('#newest');
const selectAZ = document.querySelector('#az');
const formCategories = document.querySelector('#formCategories');
const selectCategories = document.querySelector('#selectCategories');
const loader = document.querySelector('#loader');
const sectionFiltrosIndex = document.querySelector('#sectionFiltrosIndex');
const sectionFiltrosBooks = document.querySelector('#sectionFiltrosBooks');
const formTitulo = document.querySelector('#formTitulo');
const formAutor = document.querySelector('#formAutor');
const selectAZAutor = document.querySelector('#azAutor');
const btnFavPrint = document.querySelector('#btnFavPrint');
const divRegister = document.querySelector('#divRegister');
const divLogin = document.querySelector('#divLogin');
const divLogout = document.querySelector('#divLogout');
const btnExit = document.querySelector('.exit');
const btnRegister = document.querySelector('#btnRegister');
const btnLogin = document.querySelector('#btnLogin');
const divRegisterContainer = document.querySelector('#divRegister-container');
const divLoginContainer = document.querySelector('#divLogin-container');

const divPage = document.querySelector('#divPage');
const btnPageBack = document.querySelector('#pageBack');
const btnPageNext = document.querySelector('#pageNext');
const pageInfo = document.querySelector('#pageInfo');

sectionFiltrosBooks.style.display = 'none';

// constantes paginación
let arrayFavs = [];
let currentPage = 1;
const booksPerPage = 4;
let dbBooks = [];


//****** EVENTS ******

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
                const booksArray = resp.results;
                printBooks(booksArray);
            })
            .catch((error) => { console.error(error) })

        formTitulo.style.display = 'flex';
        formAutor.style.display = 'flex';
        selectAZAutor.style.display = 'flex';
    }

    if (event.target.matches('#btnAtras')) {
        titleLista.innerHTML = '';
        containerListas.innerHTML = '';
        sectionFiltrosIndex.style.display = 'flex';
        sectionFiltrosBooks.style.display = 'none';
        currentPage = 1;
        divPage.style.display = 'none'
        getIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                printIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    }

    if (event.target.matches('#btnAtrasBooks')) {
        const lista = titleLista.textContent;
        titleLista.innerHTML = '';
        containerListas.innerHTML = '';
        currentPage = 1;

        const listaArray = lista.split(' ');
        const listaGuiones = listaArray.join('-');
        urlBooks = `https://api.nytimes.com/svc/books/v3/lists/${listaGuiones}.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel`;
        getBooks(urlBooks)
            .then((resp) => {
                const booksArray = resp.results;
                printBooks(booksArray);
            })
            .catch((error) => { console.error(error) })

        formTitulo.style.display = 'flex';
        formAutor.style.display = 'flex';
        selectAZAutor.style.display = 'flex';

        btnAtrasBooks.style.display = 'none';
        btnAtras.style.display = 'flex';
    }

    if (event.target.matches('.btnBuy')) {
        const amazonURL = event.target.id;
        window.open(amazonURL, '_blank');
    }

    if (event.target.matches('#btnFooter')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (event.target.matches('#btnRegister')) {
        divRegisterContainer.classList.add('show');
    }

    if (event.target.matches('#btnExitRegister')) {
        divRegisterContainer.classList.remove('show')
    }

    if (event.target.matches('#btnLogin')) {
        divLoginContainer.classList.add('show');
    }

    if (event.target.matches('#btnExitLogin')) {
        divLoginContainer.classList.remove('show')
    }

    if (event.target.matches('#linkRegister')) {
        divLoginContainer.classList.remove('show');
        divRegisterContainer.classList.add('show');
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
    getBooks(urlBooks)
        .then((resp) => {
            const resultsArray = resp.results;
            const booksArray = resultsArray.books;
            const matchTitulo = booksArray.filter(element => element.title.includes(inputTitulo));
            printBooksFiltered(matchTitulo);
        })
        .catch((error) => { console.error(error) })
    formAutor.reset();
    btnAtrasBooks.style.display = 'none';
    btnAtras.style.display = 'flex';
});

// Event Book - Filter Author
formAutor.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputAutor = [formAutor.autor.value];
    getBooks(urlBooks)
        .then((resp) => {
            const resultsArray = resp.results;
            const booksArray = resultsArray.books;
            const matchTitulo = booksArray.filter(element => element.author.includes(inputAutor));
            printBooksFiltered(matchTitulo);
        })
        .catch((error) => { console.error(error) })
    formTitulo.reset();
    btnAtrasBooks.style.display = 'none';
    btnAtras.style.display = 'flex';
});

// Event Books - Filter AZ
selectAZAutor.addEventListener('change', (event) => {
    if (event.target.value === 'Todas') {
        containerListas.innerHTML = '';
        getBooks(urlBooks)
            .then((resp) => {
                const arrayResultados = resp.results;
                const BooksArray = arrayResultados.books;
                printBooksFiltered(BooksArray);
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'AZ') {
        containerListas.innerHTML = '';
        getBooks(urlBooks)
            .then((resp) => {
                const arrayResultados = resp.results;
                const BooksArray = arrayResultados.books;
                const resultadoAZ = BooksArray.sort((a, b) => a.author.localeCompare(b.author));
                printBooksFiltered(resultadoAZ);
            })
            .catch((error) => { console.error(error) })
    } else if (event.target.value === 'ZA') {
        containerListas.innerHTML = '';
        getBooks(urlBooks)
            .then((resp) => {
                const arrayResultados = resp.results;
                const BooksArray = arrayResultados.books;
                const resultadoZA = BooksArray.sort((a, b) => b.author.localeCompare(a.author));
                printBooksFiltered(resultadoZA);
            })
            .catch((error) => { console.error(error) })
    }
    btnAtrasBooks.style.display = 'none';
    btnAtras.style.display = 'flex';
});


//****** FUNCTIONS ******

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
};

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
};

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
};

// PAGINACION

const nextPage = () => {
    currentPage = currentPage + 1;
    printBooksFiltered(dbBooks);
};

const prevPage = () => {
    currentPage = currentPage - 1;
    printBooksFiltered(dbBooks);
};

function getBooksSlice(pagina = 1) {
    const sliceInitial = (currentPage - 1) * booksPerPage;
    const sliceFinal = sliceInitial + booksPerPage;
    return dbBooks.slice(sliceInitial, sliceFinal);
};

const getTotalPages = () => {
    return Math.ceil(dbBooks.length / booksPerPage);
};

function pagesButtons() {
    // Comprobar que no se pueda retroceder
    if (currentPage === 1) {
        btnPageBack.setAttribute("disabled", true);
    } else {
        btnPageBack.removeAttribute("disabled");
    }
    // Comprobar que no se pueda avanzar
    if (currentPage === getTotalPages()) {
        btnPageNext.setAttribute("disabled", true);
    } else {
        btnPageNext.removeAttribute("disabled");
    }
};

// Events btns Paginación
btnPageBack.addEventListener("click", prevPage);
btnPageNext.addEventListener("click", nextPage);

// PRINT

const loadFavs = async () => {
    const user = firebase.auth().currentUser;
    arrayFavs = [];

    try {
        const querySnapshot = await db.collection("users").where("id", "==", user.uid).get();
        querySnapshot.forEach((doc) => {
            const objFav = doc.data().favourites;
            arrayFavs.push(objFav);
        });
    } catch (error) {
        console.error("Error getting favorites:", error);
    }
};

const printBooks = async (array) => {
    await loadFavs();
    const arrayBooks = array.books
    dbBooks = arrayBooks
    const booksSlice = getBooksSlice(currentPage)
    pagesButtons();
    pageInfo.textContent = `${currentPage} / ${getTotalPages()}`;
    divPage.style.display = 'flex';

    booksSlice.forEach((elemento) => {
        const { book_image, weeks_on_list, description, rank, title, amazon_product_url } = elemento;
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
        btnFav.id = `{"book_image": "${book_image}", "weeks_on_list": "${weeks_on_list}", "description": "${description}", "rank": "${rank}", "title": "${title}", "amazon_product_url": "${amazon_product_url}"}`;

        // comprobar si el Book ya esta en favoritos para cambiar la clase del boton
        const stringjson = JSON.stringify(arrayFavs);
        const found = stringjson.includes(title)

        if (found) {
            btnFav.classList.add('btnFav2');
            btnFav.querySelector('img').src = 'assets/favorito2.png';
        } else {
            btnFav.classList.add('btnFav');
            btnFav.querySelector('img').src = 'assets/favorito.png';
        }

        const divBtns = document.createElement('div');
        divBtns.classList.add('divBtns');

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

const printBooksFiltered = async (array) => {
    await loadFavs();
    dbBooks = array
    const booksSlice = getBooksSlice(currentPage)
    pagesButtons();
    pageInfo.textContent = `${currentPage} / ${getTotalPages()}`;
    divPage.style.display = 'flex';

    booksSlice.forEach(({ book_image, weeks_on_list, description, rank, title, amazon_product_url }) => {
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
        btnFav.id = `{"book_image": "${book_image}", "weeks_on_list": "${weeks_on_list}", "description": "${description}", "rank": "${rank}", "title": "${title}", "amazon_product_url": "${amazon_product_url}"}`;

        // comprobar si el Book ya esta en favoritos para cambiar la clase del boton
        const stringjson = JSON.stringify(arrayFavs);
        const found = stringjson.includes(title)

        if (found) {
            btnFav.classList.add('btnFav2');
            btnFav.querySelector('img').src = 'assets/favorito2.png';
        } else {
            btnFav.classList.add('btnFav');
            btnFav.querySelector('img').src = 'assets/favorito.png';
        }

        const divBtns = document.createElement('div');
        divBtns.classList.add('divBtns');

        divBtns.append(btn, btnFav)
        divBook.append(rankTitle, imgBook, weeks, descriptionBook, divBtns);
        fragment.append(divBook);
    })
    containerListas.innerHTML = ''
    containerListas.append(fragment);
};


//****** AUTHENTICATION ******

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

document.getElementById("formRegister").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;

    pass === pass2 ? signUpUser(email, pass) : alert("error password");
});

const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`);
            console.log("USER", user);
            divLoginContainer.classList.remove('show');
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
};

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email);
        btnFavPrint.style.display = 'none';
        btnAtrasBooks.style.display = 'none';
        btnAtras.style.display = 'flex';
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
};

document.getElementById("formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email2.value;
    let pass = event.target.elements.pass3.value;
    signInUser(email, pass)
});

document.getElementById("salir").addEventListener("click", function (event) {
    signOut();
    titleLista.innerHTML = '';
    containerListas.innerHTML = '';
    sectionFiltrosIndex.style.display = 'flex';
    sectionFiltrosBooks.style.display = 'none';
    currentPage = 1;
    divPage.style.display = 'none'
    getIndex(`${urlIndex}`)
        .then((resp) => {
            const indexArray = resp.results
            printIndex(indexArray)
        })
        .catch((error) => { console.error(error) })
});

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        document.getElementById("message").innerText = `¡Bienvenido ${user.email}!`;

        btnFavPrint.style.display = 'flex'

        divLogout.style.display = 'block'
        btnRegister.style.display = 'none'
        btnLogin.style.display = 'none'

    } else {
        console.log("no hay usuarios en el sistema");
        document.getElementById("message").innerText = ``;

        divLogout.style.display = 'none'
        btnRegister.style.display = 'block'
        btnLogin.style.display = 'block'
    }
});

document.addEventListener('click', async (event) => {
    const user = firebase.auth().currentUser;

    if (event.target.classList.contains('btnFav')) {

        if (user) {
            const bookData = JSON.parse(event.target.id);
            addBookFav(user.uid, bookData);
            event.target.classList.remove('btnFav');
            event.target.classList.add('btnFav2');
            event.target.querySelector('img').src = 'assets/favorito2.png';

        } else {
            divLoginContainer.classList.add('show');
        }

    } else if (event.target.classList.contains('btnFav2')) {
        if (user) {
            const bookData = JSON.parse(event.target.id);
            removeBookFav(user.uid, bookData);
            event.target.classList.remove('btnFav2');
            event.target.classList.add('btnFav');
            event.target.querySelector('img').src = 'assets/favorito.png';
        } else {
            divLoginContainer.classList.add('show');
        }
    }
});


//****** FIRESTORE DB ******

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

const removeBookFav = (uid, bookData) => {
    db.collection("users").where("id", "==", uid)
        .get()
        .then((docs) => {
            docs.forEach(async (doc) => {
                const docId = doc.id;
                const userRef = db.collection('users').doc(docId);

                await userRef.update({ favourites: firebase.firestore.FieldValue.arrayRemove(bookData) })
                    .then(() => {
                        alert('Libro eliminado de Favoritos.')
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
        btnAtrasBooks.style.display = 'flex';
        btnAtras.style.display = 'none';

        formTitulo.style.display = 'none';
        formAutor.style.display = 'none';
        selectAZAutor.style.display = 'none';

        currentPage = 1;
    }
});

// END