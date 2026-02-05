const notesList = document.getElementById("notesList");
const newNoteBtn = document.getElementById("newNote");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const deleteBtn = document.getElementById("deleteNote");
const downloadBtn = document.getElementById("downloadNote");
const counter = document.getElementById("counter");

let notes = JSON.parse(localStorage.getItem("notepadNotes")) || [];
let activeNoteId = null;

/* Init */
if (notes.length === 0) createNote();
else loadNote(notes[0].id);

renderNotes();

/* Create */
newNoteBtn.addEventListener("click", createNote);

function createNote() {
  const note = {
    id: Date.now(),
    title: "Untitled Note",
    content: "",
    updated: Date.now()
  };
  notes.unshift(note);
  activeNoteId = note.id;
  save();
  renderNotes();
  loadNote(note.id);
}

/* Load */
function loadNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  activeNoteId = id;
  noteTitle.value = note.title;
  noteContent.value = note.content;
  updateCounter();
  highlightActive();
}

/* Save */
noteTitle.addEventListener("input", saveActive);
noteContent.addEventListener("input", saveActive);

function saveActive() {
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;

  note.title = noteTitle.value || "Untitled Note";
  note.content = noteContent.value;
  note.updated = Date.now();

  save();
  renderNotes();
  updateCounter();
}

/* Render Sidebar */
function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note.title;
    if (note.id === activeNoteId) li.classList.add("active");

    li.addEventListener("click", () => loadNote(note.id));
    notesList.appendChild(li);
  });
}

/* Delete */
deleteBtn.addEventListener("click", () => {
  if (!activeNoteId) return;

  if (!confirm("Delete this note?")) return;

  notes = notes.filter(n => n.id !== activeNoteId);
  activeNoteId = notes.length ? notes[0].id : null;

  if (activeNoteId) loadNote(activeNoteId);
  else createNote();

  save();
  renderNotes();
});

/* Download */
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([noteContent.value], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${noteTitle.value || "note"}.txt`;
  a.click();
});

/* Counter */
function updateCounter() {
  const text = noteContent.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  counter.textContent = `${words} words • ${text.length} characters`;
}

/* Helpers */
function save() {
  localStorage.setItem("notepadNotes", JSON.stringify(notes));
}

function highlightActive() {
  document.querySelectorAll("#notesList li").forEach(li => {
    li.classList.remove("active");
  });
  const active = [...notesList.children].find(
    li => li.textContent === noteTitle.value
  );
  if (active) active.classList.add("active");
}

/* Keyboard Shortcuts */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    saveActive();
  }
});
