const STORAGE_KEY = "bookshelf_apps";
let books = [];

document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromStorage();
  setupEventListeners();
  renderBooks(); // Render pertama kali setelah load
});

function setupEventListeners() {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const checkbox = document.getElementById("bookFormIsComplete");

  bookForm.addEventListener("submit", handleAddBook);
  searchForm.addEventListener("submit", handleSearchBook);

  // Update teks tombol secara dinamis
  checkbox.addEventListener("change", function () {
    const span = document.querySelector("#bookFormSubmit span");
    span.textContent = this.checked ? "Selesai dibaca" : "Belum selesai dibaca";
  });
}

function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function handleAddBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value); // Pastikan Number
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: +new Date(), // ID unik berupa angka
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();
  renderBooks();
  event.target.reset(); // Reset form
}

function handleSearchBook(event) {
  event.preventDefault();
  const query = document.getElementById("searchBookTitle").value.toLowerCase();
  renderBooks(query);
}

// Fungsi render tunggal agar tidak bingung antara search dan normal
function renderBooks(query = "") {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(query),
  );

  for (const book of filtered) {
    const element = createBookElement(book);
    if (book.isComplete) {
      completeList.append(element);
    } else {
      incompleteList.append(element);
    }
  }
}

function createBookElement(book) {
  const container = document.createElement("div");
  container.setAttribute("data-bookid", book.id);
  container.setAttribute("data-testid", "bookItem");

  container.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  // Event Listeners
  const toggleBtn = container.querySelector(
    '[data-testid="bookItemIsCompleteButton"]',
  );
  toggleBtn.onclick = () => toggleBookStatus(book.id);

  const deleteBtn = container.querySelector(
    '[data-testid="bookItemDeleteButton"]',
  );
  deleteBtn.onclick = () => deleteBook(book.id);

  return container;
}

function toggleBookStatus(id) {
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books[index].isComplete = !books[index].isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveBooksToStorage();
  renderBooks();
}
