class Book {
    constructor(title = "title", isReading = true) {
        this.title = title;
        this.id = createBookId();
        this.isReading = isReading;
        this.startDate = new Date;
        this.finishDate = null;
        this.comments = [];
    }
}

const body = document.body;

const readingBookTemplate = document.querySelector('#reading-book-template');
const finishedBookTemplate = document.querySelector('#finished-book-template');
const commentItemTemplate = document.querySelector('#comment-item-template');
const commentEditTemplate = document.querySelector('#comment-edit-template')

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

const createBookListItem = (book) => {
    if (book.isReading) {
        const bookListItem = readingBookTemplate.content.cloneNode(true);

        bookListItem.querySelector('.book-list__item')
                    .setAttribute('id', `book-${book.id}`)
        bookListItem.querySelector('.book-list__item__title')
                    .textContent = book.title;
        bookListItem.querySelector('.book-list__item__start-date')
                    .textContent = getDate(new Date(book.startDate)) + ' ~';

        const addCommentForm = bookListItem.querySelector('.book-list__item__add-comment');

        if (book.comments.length > 0) {
            const commentList = document.createElement('ul');
            commentList.classList.add('book-list__item__comments');
            commentList.innerHTML = '<span>Comments:</span>';

            book.comments.forEach((comment) => {
                const commentItemNode = commentItemTemplate.content.cloneNode(true);
                const commentItem = commentItemNode.querySelector('.book-list__item__comments__comment');
                const commentItemText = commentItem.querySelector('span');
                commentItemText.textContent = comment;

                commentList.appendChild(commentItem);
            });

            bookListItem.querySelector('.book-list__item').insertBefore(commentList, addCommentForm);
        };

        return bookListItem;
    } else {
        const bookListItem = finishedBookTemplate.content.cloneNode(true);
        bookListItem.querySelector('.book-list__item')
                    .setAttribute('id', `book-${book.id}`)
        bookListItem.querySelector('.book-list__item__title')
                    .textContent = book.title;
        bookListItem.querySelector('.book-list__item__date')
                    .textContent = getDate(new Date(book.startDate)) + ' ~ ' + getDate(new Date(book.finishDate));

        const addCommentForm = bookListItem.querySelector('.book-list__item__add-comment');

        if (book.comments.length > 0) {
            const commentList = document.createElement('ul');
            commentList.classList.add('book-list__item__comments');
            commentList.innerHTML = '<span>Comments:</span>';

            book.comments.forEach((comment) => {
                const commentItemNode = commentItemTemplate.content.cloneNode(true);
                const commentItem = commentItemNode.querySelector('.book-list__item__comments__comment');
                const commentItemText = commentItem.querySelector('span');
                commentItemText.textContent = comment;

                commentList.appendChild(commentItem);
            });

            bookListItem.querySelector('.book-list__item').insertBefore(commentList, addCommentForm);
        };


        return bookListItem;
    }
}

const createReadingBookListItem = (title, id, startDate) => {
    const bookListItem = readingBookTemplate.content.cloneNode(true);

    bookListItem.querySelector('.book-list__item')
                .setAttribute('id', `book-${id}`)
    bookListItem.querySelector('.book-list__item__title')
        .textContent = title;
    bookListItem.querySelector('.book-list__item__start-date')
        .textContent = getDate(startDate) + ' ~';

    const addCommentForm = bookListItem.querySelector('.book-list__item__add-comment');

    const commentList = document.createElement('ul');
    commentList.classList.add('book-list__item__comments');

    const commentItem = document.createElement('li');
    commentItem.classList.add('book-list__item__comments__comment')
    commentItem.textContent = comment;

    commentList.appendChild(commentItem);
    bookListItem.insertBefore(commentList, addCommentForm);

    return bookListItem;
}

const createFinishedBookListItem = (title, id, startDate, finishDate) => {
    const bookListItem = finishedBookTemplate.content.cloneNode(true);
    bookListItem.querySelector('.book-list__item')
                .setAttribute('id', `book-${id}`)
    bookListItem.querySelector('.book-list__item__title')
        .textContent = title;
    bookListItem.querySelector('.book-list__item__date')
        .textContent = getDate(startDate) + ' ~ ' + getDate(finishDate);
    return bookListItem;
}

const pageInit = () => {
    if (localStorage.getItem('books') != null) {
        const books = JSON.parse(localStorage.getItem('books'));
        books.forEach((book) => {
            bookList.appendChild(createBookListItem(book));
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
    bookList.insertBefore(createBookListItem(startingBook), bookList.firstChild);
    input.value = '';
}

const finishBookHandler = (event) => {
    const currentListItem = event.target.parentElement;

    const id = currentListItem.getAttribute('id').split('-')[1];
    const books = JSON.parse(localStorage.getItem('books'));
    const currentBook = books.find((book) => book.id == id);

    currentListItem.querySelector('.book-list__item__finish-button').remove();
    currentListItem.querySelector('.book-list__item__start-date').remove();

    const readDate = document.createElement('span');
    readDate.classList.add('.book-list__item__date');
    readDate.textContent = getDate(new Date(currentBook.startDate)) + ' ~ ' + getDate(new Date())

    const commentList = currentListItem.querySelector('.book-list__item__comments')

    currentListItem.insertBefore(readDate, commentList)

    currentBook.isReading = false;
    currentBook.finishDate = new Date();
    localStorage.setItem('books', JSON.stringify(books))
}

const addCommentHandler = (event) => {
    event.preventDefault();
    const currentListItem = event.target.parentElement;
    const commentInput = event.target.querySelector('.book-list__item__add-comment > input')

    const id = currentListItem.getAttribute('id').split('-')[1];
    const comment = commentInput.value;
    const books = JSON.parse(localStorage.getItem('books'));
    const currentBook = books.find((book) => book.id == id);
    currentBook.comments.push(comment);
    localStorage.setItem('books', JSON.stringify(books))

    const commentItemNode = commentItemTemplate.content.cloneNode(true);
    const commentItem = commentItemNode.querySelector('.book-list__item__comments__comment');
    const commentItemText = commentItem.querySelector('span');
    commentItemText.textContent = comment;

    if (currentListItem.querySelector('.book-list__item__comments') == null) {
        const commentList = document.createElement('ul');
        commentList.classList.add('book-list__item__comments');
        commentList.innerHTML = '<span>Comments:</span>'
        commentList.appendChild(commentItem);
        currentListItem.insertBefore(commentList, event.target);
    } else {
        currentListItem.querySelector('.book-list__item__comments').appendChild(commentItem);
    }

    commentInput.value = '';
}

const editCommentHandler = (event) => {
    const commentEditNode = commentEditTemplate.content.cloneNode(true);
    const commentEditInput = commentEditNode.querySelector('input');
    const commentItem = event.target.parentElement;
    const commentBefore = commentItem.querySelector('span').textContent;
    commentEditInput.value = commentBefore;
    commentItem.replaceWith(commentEditNode);
}

const confirmEditCommentHandler = (event) => {
    event.preventDefault();
    const value = event.target.querySelector('input').value;

    const commentItem = event.target.parentElement;
    const commentItemNode = commentItemTemplate.content.cloneNode(true);
    const commentList = commentItem.parentElement
    const bookListItem = commentList.parentElement;

    const bookId = bookListItem.getAttribute('id').split('-')[1];
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find((book) => book.id == bookId);
    const commentIndex = Array.prototype.indexOf.call(commentList.children, commentItem) - 1;
    book.comments[commentIndex] = value;
    localStorage.setItem('books', JSON.stringify(books))

    commentItemNode.querySelector('span').textContent = value;
    commentItem.replaceWith(commentItemNode);
}

pageInit();
