import Swal from 'sweetalert2';
import AOS from 'aos';

const API_URL = "https://notes-api.dicoding.dev/v2";
const MAX_CHARS_INPUT = 30;

const form = document.querySelector("form");
const judulCatatan = form.elements.judul;
const isiCatatan = form.elements.isi_catatan;
const noteIdInput = document.getElementById("noteId");
const dateTimeInput = document.getElementById("date-time");
const loadingAnimationAktif = document.getElementById(
  "loading-animation-aktif",
);
const loadingAnimationArsip = document.getElementById(
  "loading-animation-arsip",
);
const loadingGIFAktif = loadingAnimationAktif.querySelector(".loader");
const loadingGIFArsip = loadingAnimationArsip.querySelector(".loader");

const renderUnarchivedNotes = async () => {
  const pesan = loadingAnimationAktif.querySelector("p");
  try {
    pesan.textContent = "Loading...";
    loadingGIFAktif.style.display = "block";
    const response = await fetch(`${API_URL}/notes`);
    const responseJson = await response.json();
    const notes = responseJson.data ? responseJson.data : [];
    loadingGIFAktif.style.display = "none";

    const activeNotesContainer = document.getElementById("card-aktif");
    activeNotesContainer.innerHTML = "";

    if (notes.length > 0) {
      loadingAnimationAktif.classList.add("hidden");
      loadingAnimationAktif.classList.remove("flex");

      let duration = 1;
      notes.forEach((note) => {
        const noteCard = document.createElement("note-card");
        noteCard.setAttribute("title", note.title);
        noteCard.setAttribute("date-time", new Date(note.createdAt));
        noteCard.setAttribute("data-id", note.id);
        noteCard.setAttribute("body", note.body);
        noteCard.setAttribute("archived", note.archived);
        noteCard.setAttribute("data-aos", "zoom-in");
        noteCard.setAttribute("data-aos-easing", "linear");
        noteCard.setAttribute("data-aos-duration", `${duration * 250 + 250}`);
        duration++;
        duration = duration == 6 ? (duration = 1) : duration;

        activeNotesContainer.appendChild(noteCard);
      });
    } else {
      loadingAnimationAktif.classList.remove("hidden");
      loadingAnimationAktif.classList.add("flex");
      pesan.textContent = "Tidak ada catatan yang diaktifkan";
    }
  } catch (error) {
    loadingGIFAktif.style.display = "none";
    Swal.fire({
      icon: "Error!",
      title: "Oops...",
      text: "Terjadi kesalahan : " + error,
    });
    pesan.textContent = "Terjadi Kesalahan";
  }
};

const renderArchivedNotes = async () => {
  const pesan = loadingAnimationArsip.querySelector("p");
  try {
    pesan.textContent = "Loading...";
    loadingGIFArsip.style.display = "block";
    const response = await fetch(`${API_URL}/notes/archived`);
    const responseJson = await response.json();
    const notes = responseJson.data ? responseJson.data : [];
    loadingGIFArsip.style.display = "none";

    const archivedNotesContainer = document.getElementById("card-arsip");
    archivedNotesContainer.innerHTML = "";

    if (notes.length > 0) {
      loadingAnimationArsip.classList.add("hidden");
      loadingAnimationArsip.classList.remove("flex");

      let duration = 1;
      notes.forEach((note) => {
        const noteCard = document.createElement("note-card");
        noteCard.setAttribute("title", note.title);
        noteCard.setAttribute("date-time", new Date(note.createdAt));
        noteCard.setAttribute("data-id", note.id);
        noteCard.setAttribute("body", note.body);
        noteCard.setAttribute("archived", note.archived);
        noteCard.setAttribute("data-aos", "zoom-in");
        noteCard.setAttribute("data-aos-easing", "linear");
        noteCard.setAttribute("data-aos-duration", `${duration * 250 + 250}`);
        duration++;
        duration = duration == 6 ? (duration = 1) : duration;

        archivedNotesContainer.appendChild(noteCard);
      });
    } else {
      loadingAnimationArsip.classList.remove("hidden");
      loadingAnimationArsip.classList.add("flex");
      pesan.textContent = "Tidak ada catatan yang diarsipkan";
    }
  } catch (error) {
    loadingGIFArsip.style.display = "none";
    Swal.fire({
      icon: "Error!",
      title: "Oops...",
      text: "Terjadi kesalahan : " + error,
    });
    pesan.textContent = "Terjadi Kesalahan";
  }
};

const addNote = async (title, body) => {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title, body: body }),
    });
    const responseJson = await response.json();

    if (responseJson.status === "success") {
      Swal.fire({
        title: "Berhasil!",
        text: "Catatan berhasil ditambahkan!",
        icon: "success",
        iconColor: "#2563EB",
        confirmButtonColor: "#2563EB",
      });
    } else {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambah catatan!",
        icon: "error",
        iconColor: "#DC2626",
        confirmButtonColor: "#DC2626",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Terjadi error saat menambah catatan!",
      icon: "error",
      iconColor: "#DC2626",
      confirmButtonColor: "#DC2626",
    });
  }
  form.reset();
  const charCount = document.getElementById("sisa-karakter");
  remainingChars = MAX_CHARS_INPUT;
  charCount.textContent = `Sisa Karakter : ${remainingChars} `;

  const getAriaJudul = judulCatatan.getAttribute("aria-describedby");
  const ariaElement = getAriaJudul
    ? document.getElementById(getAriaJudul)
    : null;
  const getAriaIsi = isiCatatan.getAttribute("aria-describedby");
  const ariaElement2 = getAriaIsi ? document.getElementById(getAriaIsi) : null;
  if (ariaElement) {
    ariaElement.classList.replace("visible", "hidden");
  }
  if (ariaElement2) {
    ariaElement2.classList.replace("visible", "hidden");
  }

  renderArchivedNotes();
  renderUnarchivedNotes();
};

document.addEventListener("DOMContentLoaded", () => {
  AOS.init();
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = judulCatatan.value;
    const body = isiCatatan.value;
    addNote(title, body);
  });
  renderUnarchivedNotes();
  renderArchivedNotes();
});
