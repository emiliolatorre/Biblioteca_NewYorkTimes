

// API NYTimes - API Books

const apiKey = '6M27vjBFvWMv2cJNyYVuFobzfRm0quel'

const urlIndex = `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel`
// const urlLista = `https://api.nytimes.com/svc/books/v3/lists/${list}.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel` LA UTILIZO DIRECTAMENTE EN LA LINEA XXX

const containerListas = document.querySelector('#containerListas')
const fragment = document.createDocumentFragment()
const titleLista = document.querySelector('#titleLista')
const sectionBtnAtras = document.querySelector('#sectionBtnAtras')


// EVENTO LISTA

document.addEventListener('click', (event) => {
    if (event.target.matches('.btnLista')) {
        sectionBtnAtras.innerHTML = '';
        containerListas.innerHTML = '';
        const lista = event.target.id;
        const listaArray = lista.split(' ');
        const listaGuiones = listaArray.join('-');
        urlBooks = `https://api.nytimes.com/svc/books/v3/lists/${listaGuiones}.json?api-key=6M27vjBFvWMv2cJNyYVuFobzfRm0quel`;
        jsonBooks(urlBooks)
            .then((resp) => {
                const booksArray = resp.results
                pintarBooks(booksArray)
            })
            .catch((error) => { console.error(error) })
    }

    if (event.target.matches('#btnAtras')) {
        titleLista.innerHTML = '';
        sectionBtnAtras.innerHTML = '';
        containerListas.innerHTML = '';
        jsonIndex(`${urlIndex}`)
            .then((resp) => {
                const indexArray = resp.results
                pintarIndex(indexArray)
            })
            .catch((error) => { console.error(error) })
    }

    if (event.target.matches('.btnBuy')) {
        const amazonURL = event.target.id;
        window.open(amazonURL, '_blank');
    }

    if (event.target.matches('#btnFooter')) {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
});

// EVENTO LOADER
// document.addEventListener('DOMContentLoaded', () => {
//     const loader = document.querySelector('#loader');
//     // Cambiar la clase del loader
//     loader.classList.add('hidden');
//     loader.classList.remove('lds-ring');
// });

// INDEX

const jsonIndex = async (url) => {
    try {
        const resp = await fetch(url);
        if (resp.ok) {
            const resultado = await resp.json();
            return resultado
        } else {
            throw 'El estado o el stage no son correctos.'
        }
    } catch (error) {
        throw error
    }
}

jsonIndex(`${urlIndex}`)
    .then((resp) => {
        const indexArray = resp.results
        pintarIndex(indexArray)
    })
    .catch((error) => { console.error(error) })


const pintarIndex = (array) => {
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

const jsonBooks = async (url) => {
    try {
        const resp = await fetch(url);
        if (resp.ok) {
            const resultado = await resp.json();
            return resultado;
        } else {
            throw 'El estado o el stage no son correctos.'
        }
    } catch (error) {
        throw error
    }
}

const pintarBooks = (array) => {
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

        divBook.append(rankTitle, imgBook, weeks, descriptionBook, btn);
        fragment.append(divBook);
    })
    const lista = document.createElement('h1');
    lista.innerHTML = array.list_name
    titleLista.append(lista)
    const btnAtras = document.createElement('button')
    btnAtras.innerHTML = `<img id="flecha_triangulo_izquierda" src="assets/flecha_triangulo_izquierda.png" alt="Icono flecha izquierda">BACK TO INDEX`;
    btnAtras.id = 'btnAtras';
    sectionBtnAtras.append(btnAtras);
    containerListas.append(fragment);
};