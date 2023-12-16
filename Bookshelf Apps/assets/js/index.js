document.addEventListener('DOMContentLoaded', function () {
    const formInputBook = document.getElementById('inputBookForm');
    const buttonSubmit = document.getElementById('bookSubmit');
    const shelfUncompleted = document.getElementById('incompleteBookshelfList');
    const shelfCompleted = document.getElementById('completeBookshelfList');

    let collectionOfBooks = [];

    const storageBooks = localStorage.getItem('Books');
    if (storageBooks) {
        collectionOfBooks = JSON.parse(storageBooks);
    }

    function saveBooks() {
        localStorage.setItem('Books', JSON.stringify(collectionOfBooks));
    }

    formInputBook.addEventListener('submit', function (event) {
        event.preventDefault();

        const titleBook = document.getElementById('inputBookTitle').value;
        const authorBook = document.getElementById('inputBookAuthor').value;
        const yearBook = Number(document.getElementById('inputBookYear').value);
        const readStatus = document.getElementById('inputBookIsComplete').checked;

        const bookExists = collectionOfBooks.some(book => book.title === titleBook);

        if (bookExists) {
            alert('Judul buku ini sudah ada.');
        } else {
            const book = {
                id: +new Date(),
                title: titleBook,
                author: authorBook,
                year: yearBook,
                isComplete: readStatus,
            };

            collectionOfBooks.push(book);
            saveBooks();
            updateShelves();

            document.getElementById('inputBookTitle').value = '';
            document.getElementById('inputBookAuthor').value = '';
            document.getElementById('inputBookYear').value = '';
            document.getElementById('inputBookIsComplete').checked = false;
        }
    });

    function updateShelves() {
        shelfUncompleted.innerHTML = '';
        shelfCompleted.innerHTML = '';
        for (const book of collectionOfBooks) {
            const elementBook = createBookElement(book);
            if (book.isComplete) {
                shelfCompleted.appendChild(elementBook);
            } else {
                shelfUncompleted.appendChild(elementBook);
            }
        }
    }

    function createButton(text, className, action) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', action);
        return button;
    }

    function removeBook(idBook) {
        const indexBook = collectionOfBooks.findIndex(book => book.id === idBook);
        if (indexBook >= 0) {
            collectionOfBooks.splice(indexBook, 1);
            saveBooks();
            updateShelves();
        }
    }

    function changeReadStatus(idBook) {
        const indexBook = collectionOfBooks.findIndex(book => book.id === idBook);
        if (indexBook >= 0) {
            collectionOfBooks[indexBook].isComplete = !collectionOfBooks[indexBook].isComplete;
            saveBooks();
            updateShelves();
        }
    }

    const formSearch = document.getElementById('searchBookForm');
    const inputSearch = document.getElementById('searchBookTitle');

    formSearch.addEventListener('submit', function (event) {
        event.preventDefault();
        const termSearch = inputSearch.value.toLowerCase().trim();

        const booksFiltered = collectionOfBooks.filter(book => {
            return (
                book.title.toLowerCase().includes(termSearch) ||
                book.author.toLowerCase().includes(termSearch) ||
                book.year.toString().includes(termSearch)
            );
        });

        showSearchResults(booksFiltered);
    });

    function showSearchResults(books) {
        shelfUncompleted.innerHTML = '';
        shelfCompleted.innerHTML = '';

        for (const book of books) {
            const elementBook = createBookElement(book);
            if (book.isComplete) {
                shelfCompleted.appendChild(elementBook);
            } else {
                shelfUncompleted.appendChild(elementBook);
            }
        }
    }

    function createBookElement(book) {
        const element = document.createElement('article');
        element.className = 'book_item';
        element.style.margin = '10px';

        const areaActions = document.createElement('div');
        areaActions.className = 'action_area';

        const titleBook = document.createElement('h3');
        titleBook.textContent = book.title;
        titleBook.style.color = 'white';
        titleBook.style.marginBottom = '10px';

        const authorBook = document.createElement('p');
        authorBook.textContent = 'Penulis: ' + book.author;
        authorBook.style.color = 'white';
        authorBook.style.marginBottom = '10px';

        const yearBook = document.createElement('p');
        yearBook.textContent = 'Tahun: ' + book.year;
        yearBook.style.color = 'white';
        yearBook.style.marginBottom = '10px';

        const buttonDelete = createButton('Hapus', 'red_button', function () {
            removeBook(book.id);
        });

        let buttonToggleRead;
        if (book.isComplete) {
            buttonToggleRead = createButton('Belum Dibaca', 'yellow_button', function () {
                changeReadStatus(book.id);
            });
        } else {
            buttonToggleRead = createButton('Sudah Dibaca', 'green_button', function () {
                changeReadStatus(book.id);
            });
        }

        buttonDelete.style.padding = '10px';
        buttonDelete.style.margin = '10px';
        buttonDelete.style.borderRadius = '10px';
        buttonDelete.style.border = 'none';
        buttonDelete.style.backgroundColor = '#F93737';
        buttonDelete.style.color = 'white';
        buttonDelete.style.fontWeight = 'bold';

        buttonToggleRead.style.padding = '10px';
        buttonToggleRead.style.borderRadius = '10px';
        buttonToggleRead.style.border = 'none';
        buttonToggleRead.style.backgroundColor = '#112D4E';
        buttonToggleRead.style.color = 'white';
        buttonToggleRead.style.fontWeight = 'bold';

        areaActions.appendChild(buttonToggleRead);
        areaActions.appendChild(buttonDelete);

        element.appendChild(titleBook);
        element.appendChild(authorBook);
        element.appendChild(yearBook);
        element.appendChild(areaActions);

        return element;
    }

    updateShelves();
});
