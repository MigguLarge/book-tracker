class Book {
    constructor(title = "title", isReading = true) {
        this.title = title;
        this.id = createBookId();
        this.isReading = isReading;
        this.startDate = new Date;
        this.finishDate = null;
    }
}

const body = document.body;

const readingBookTemplate = document.querySelector('#reading-book-template');
const finishedBookTemplate = document.querySelector('#finished-book-template');

const bookList = document.querySelector('.book-list')

const createBookId = () => {
    const id = Math.random().toString(32).slice(2);
    const books = JSON.parse(localStorage.getItem('books'));

    if (!books || books.find((element) => element.id == id) == undefined) {
        return id;
    } else {
        return createBookId();
    }
}

const getDate = (dateObj) => {
    if (Object.prototype.toString.call(dateObj) !== "[object Date]") {
        console.log("parameter is not a date object");
        return null
    }
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().length == 2 ? dateObj.getMonth() + 1 : '0' + (dateObj.getMonth() + 1);
    const date = dateObj.getDate().toString().length == 2 ? dateObj.getDate() : '0' + dateObj.getDate();
    return year + '-' + month + '-' + date;
}

const createReadingBookListItem = (title, id, startDate) => {
    const bookListItem = readingBookTemplate.content.cloneNode(true);
    bookListItem.querySelector('.book-list__item')
                .setAttribute('id', `book-${id}`)
    bookListItem.querySelector('.book-list__item__title')
        .textContent = title;
    bookListItem.querySelector('.book-list__item__start-date')
        .textContent = getDate(startDate) + ' ~';
    return bookListItem;
}

const createFinishedBookListItem = (title, id, startDate, finishDate) => {
    const bookListItem = finishedBookTemplate.content.cloneNode(true);
    bookListItem.querySelector('.book-list__item')
                .setAttribute('id', `book-${id}`)
    bookListItem.querySelector('.book-list__item__title')
        .textContent = title;
    bookListItem.querySelector('.book-list__item__start-date')
        .textContent = getDate(startDate) + ' ~';
    bookListItem.querySelector('.book-list__item__finish-date')
        .textContent = getDate(finishDate);
    return bookListItem;
}

const pageInit = () => {
    if (localStorage.getItem('books') != null) {
        const books = JSON.parse(localStorage.getItem('books'));
        books.forEach((book) => {
            if (book.isReading)
                bookList.appendChild(createReadingBookListItem(book.title, book.id, new Date(book.startDate)));
            else bookList.appendChild(createFinishedBookListItem(book.title, book.id, new Date(book.startDate), new Date(book.finishDate)));
        });
    }
}

const startBookHandler = (event) => {
    event.preventDefault();
    const input = event.target.querySelector("input");
    const startingBook = new Book(input.value, true);
    if (!input.value) {
        return;
    }
    if (localStorage.getItem('books') != null) {
        let books = JSON.parse(localStorage.getItem('books'));
        books = [startingBook, ...books];
        localStorage.setItem('books', JSON.stringify(books));
    } else {
        const books = JSON.stringify([startingBook])
        localStorage.setItem('books', books);
    }
    bookList.insertBefore(createReadingBookListItem(input.value, startingBook.id, startingBook.startDate), bookList.firstChild);
    input.value = '';
}

const finishBookHandler = (event) => {
    const currentListItem = event.target.parentElement;
    const finishDate = document.createElement('span');
    finishDate.classList.add('.book-list__item__finish-date')
    finishDate.textContent = getDate(new Date());

    currentListItem.querySelector('.book-list__item__finish-button').remove();
    currentListItem.appendChild(finishDate);

    const id = currentListItem.getAttribute('id').split('-')[1];
    const books = JSON.parse(localStorage.getItem('books'));
    const currentBook = books.find((book) => book.id == id);
    currentBook.isReading = false;
    currentBook.finishDate = new Date();
    localStorage.setItem('books', JSON.stringify(books))
}

pageInit();
