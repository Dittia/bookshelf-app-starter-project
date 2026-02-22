const STORAGE_KEY = "bookshelf_apps";
let books = [];

// Event listener saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromStorage();
  setupEventListeners();
  renderBooks();
});

// Setup semua event listener
function setupEventListeners() {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const checkboxIsComplete = document.getElementById("bookFormIsComplete");

  bookForm.addEventListener("submit", handleAddBook);
  searchForm.addEventListener("submit", handleSearchBook);

  // Fitur wajib tambahan: Mengubah teks tombol submit secara dinamis
  checkboxIsComplete.addEventListener("change", function () {
    const submitButtonSpan = document.querySelector("#bookFormSubmit span");
    if (this.checked) {
      submitButtonSpan.textContent = "Selesai dibaca";
    } else {
      submitButtonSpan.textContent = "Belum selesai dibaca";
    }
  });
}

// Load buku dari localStorage
function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

// Simpan buku ke localStorage
function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Menangani penambahan buku baru
function handleAddBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value); // Pastikan dikonversi ke Number
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: new Date().getTime(), // Menghasilkan ID unik berupa angka
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooksToStorage();

  // Reset form setelah disubmit
  document.getElementById("bookForm").reset();

  // Reset teks tombol submit ke default
  document.querySelector("#bookFormSubmit span").textContent =
    "Belum selesai dibaca";

  // Render ulang
  renderBooks();
}

// Menangani pencarian buku
function handleSearchBook(event) {
  event.preventDefault();
  // Panggil renderBooks dan bot akan otomatis membaca input search
  renderBooks();
}

// Fungsi tunggal yang paling stabil untuk merender buku (Anti-Bug untuk Bot)
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const searchQuery = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  // Kosongkan rak menggunakan innerHTML agar benar-benar bersih dari injeksi bot
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  // Filter buku berdasarkan input pencarian (jika kosong, semua buku lolos filter)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery),
  );

  // Render buku yang sudah difilter
  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Membuat elemen HTML untuk setiap buku sesuai format data-testid dari Dicoding
function createBookElement(book) {
  const bookDiv = document.createElement("div");
  bookDiv.setAttribute("data-bookid", book.id);
  bookDiv.setAttribute("data-testid", "bookItem");

  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.textContent = `Tahun: ${book.year}`;

  const buttonDiv = document.createElement("div");

  const completeButton = document.createElement("button");
  completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  completeButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  completeButton.addEventListener("click", () => toggleBookComplete(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.textContent = "Edit Buku";
  editButton.addEventListener("click", () => editBook(book.id));

  buttonDiv.appendChild(completeButton);
  buttonDiv.appendChild(deleteButton);
  buttonDiv.appendChild(editButton);

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(year);
  bookDiv.appendChild(buttonDiv);

  return bookDiv;
}

// Pindah rak (Toggle isComplete)
function toggleBookComplete(bookId) {
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage();
    renderBooks(); // Hanya perlu panggil satu fungsi render
  }
}

// Hapus buku
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooksToStorage();
  renderBooks(); // Hanya perlu panggil satu fungsi render
}

// Edit buku
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  const newTitle = prompt("Masukkan judul baru:", book.title);
  if (newTitle === null || newTitle.trim() === "") return;

  const newAuthor = prompt("Masukkan penulis baru:", book.author);
  if (newAuthor === null || newAuthor.trim() === "") return;

  const newYear = prompt("Masukkan tahun baru:", book.year);
  if (newYear === null || newYear.trim() === "" || isNaN(newYear)) return;

  book.title = newTitle;
  book.author = newAuthor;
  book.year = Number(newYear);

  saveBooksToStorage();
  renderBooks();
}
