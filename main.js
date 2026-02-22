const STORAGE_KEY = 'bookshelf_apps';
let books = [];
let filteredBooks = [];
let isSearching = false;

// Load books from localStorage when page loads
document.addEventListener('DOMContentLoaded', function () {
  loadBooksFromStorage();
  renderBooks();
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  const bookForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');

  bookForm.addEventListener('submit', handleAddBook);
  searchForm.addEventListener('submit', handleSearchBook);
}

// Load books from localStorage
function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  books = storedBooks ? JSON.parse(storedBooks) : [];
}

// Save books to localStorage
function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Handle adding new book
function handleAddBook(event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();

  // Reset form
  document.getElementById('bookForm').reset();

  renderBooks();
}

// Handle search
function handleSearchBook(event) {
  event.preventDefault();

  const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();

  if (searchQuery === '') {
    isSearching = false;
    renderBooks();
    return;
  }

  isSearching = true;
  filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  renderFilteredBooks();
}

// Render books (display all books)
function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  // Clear existing books (except template)
  const incompleteItems = incompleteBookList.querySelectorAll('[data-bookid]');
  const completeItems = completeBookList.querySelectorAll('[data-bookid]');

  incompleteItems.forEach((item) => item.remove());
  completeItems.forEach((item) => item.remove());

  // Separate books by completion status
  const incompleteBooks = books.filter((book) => !book.isComplete);
  const completeBooks = books.filter((book) => book.isComplete);

  // Render incomplete books
  incompleteBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    incompleteBookList.appendChild(bookElement);
  });

  // Render complete books
  completeBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    completeBookList.appendChild(bookElement);
  });
}

// Render filtered books (for search results)
function renderFilteredBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  // Clear existing books
  const incompleteItems = incompleteBookList.querySelectorAll('[data-bookid]');
  const completeItems = completeBookList.querySelectorAll('[data-bookid]');

  incompleteItems.forEach((item) => item.remove());
  completeItems.forEach((item) => item.remove());

  // Separate filtered books by completion status
  const incompleteBooks = filteredBooks.filter((book) => !book.isComplete);
  const completeBooks = filteredBooks.filter((book) => book.isComplete);

  // Render incomplete books
  incompleteBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    incompleteBookList.appendChild(bookElement);
  });

  // Render complete books
  completeBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    completeBookList.appendChild(bookElement);
  });
}

// Create book element
function createBookElement(book) {
  const bookDiv = document.createElement('div');
  bookDiv.setAttribute('data-bookid', book.id);
  bookDiv.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const buttonDiv = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.textContent = book.isComplete
    ? 'Belum selesai dibaca'
    : 'Selesai dibaca';
  completeButton.addEventListener('click', () => toggleBookComplete(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', () => editBook(book.id));

  buttonDiv.appendChild(completeButton);
  buttonDiv.appendChild(deleteButton);
  buttonDiv.appendChild(editButton);

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(year);
  bookDiv.appendChild(buttonDiv);

  return bookDiv;
}

// Toggle book complete status
function toggleBookComplete(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();

    if (isSearching) {
      const filteredBook = filteredBooks.find((b) => b.id === bookId);
      if (filteredBook) {
        filteredBook.isComplete = !filteredBook.isComplete;
      }
      renderFilteredBooks();
    } else {
      renderBooks();
    }
  }
}

// Delete book
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  filteredBooks = filteredBooks.filter((b) => b.id !== bookId);
  saveBooksToStorage();

  if (isSearching) {
    renderFilteredBooks();
  } else {
    renderBooks();
  }
}

// Edit book
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  const newTitle = prompt('Masukkan judul baru:', book.title);
  if (newTitle === null) return;

  const newAuthor = prompt('Masukkan penulis baru:', book.author);
  if (newAuthor === null) return;

  const newYear = prompt('Masukkan tahun baru:', book.year);
  if (newYear === null) return;

  book.title = newTitle;
  book.author = newAuthor;
  book.year = Number(newYear);
  saveBooksToStorage();

  if (isSearching) {
    const filteredBook = filteredBooks.find((b) => b.id === bookId);
    if (filteredBook) {
      filteredBook.title = newTitle;
      filteredBook.author = newAuthor;
      filteredBook.year = Number(newYear);
    }
    renderFilteredBooks();
  } else {
    renderBooks();
  }
}
