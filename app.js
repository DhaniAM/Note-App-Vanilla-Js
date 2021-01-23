// Grab DOM
const inputBtn = document.querySelector(".input button");
const inputText = document.querySelector(".input input");
const searchBtn = document.querySelector(".search button");
const searchText = document.querySelector(".search input");
const notes = document.querySelector(".notes");
const themes = document.querySelector(".themes");
const body = document.querySelector("body");
const error = document.querySelector(".error");

// Event Listener
window.addEventListener("load", () => {
	getNote();
	getTheme();
});
// Input
inputBtn.addEventListener("click", e => {
	// if not duplicate and not empty
	if (isDuplicate(inputText.value) || inputText.value === "") {
		showError(inputText.value);
	} else {
		inputHandler(e);
	}
});
inputText.addEventListener("keyup", e => {
	if (e.keyCode === 13) {
		if (isDuplicate(inputText.value) || inputText.value === "") {
			showError(inputText.value);
		} else {
			inputHandler(e);
		}
		inputText.blur();
	}
});
// Search
searchBtn.addEventListener("click", searchNote);
searchText.addEventListener("keypress", e =>
	e.keyCode === 13 ? searchNote() : ""
);
searchText.addEventListener("input", showAll);
// Notes
notes.addEventListener("click", e => {
	if (e.target.classList.contains("fa-times")) {
		removeNote(e);
	} else if (e.target.classList.contains("fa-edit")) {
		editNote(e);
	} else if (e.target.classList.contains("fa-check")) {
		saveEditedNote(e);
	}
});
// Theme
themes.addEventListener("click", () => {
	changeTheme();
	saveThemeToLocal();
});

// Function
function inputHandler() {
	// If input is empty, don't add note
	if (inputText.value !== "") {
		addNote(inputText.value);
	}
	// Save to Local Storage
	saveToLocalStorage(inputText.value);
	// Clear input value
	inputText.value = "";
}

function getNote() {
	if (localStorage.getItem("noteList") !== null) {
		const savedNotes = JSON.parse(
			localStorage.getItem("noteList")
		);
		// Make note for each note in local storage
		savedNotes.map(note => {
			addNote(note);
		});
	}
}

function addNote(text) {
	// Make note div
	const noteDiv = document.createElement("div");
	noteDiv.className = "note";
	// Make note
	const note = document.createElement("p");
	note.innerText = text;
	// Make btn
	const btn = `<i class="fa fa-times" title="delete"></i><i class="edit far fa-edit" title="edit"></i>`;
	noteDiv.innerHTML = btn;
	// Insert content to noteDiv
	noteDiv.appendChild(note);
	// Insert noteDiv to parent Notes
	notes.appendChild(noteDiv);
}

function removeNote(e) {
	const note = e.target.parentNode;
	const noteText = note.querySelector("p").innerText;
	// If clicking X icon && If note is not in edit mode, then you can delete
	if (
		e.target.classList.contains("fa-times") &&
		!note.classList.contains("editing")
	) {
		deleteFromLocalStorage(noteText);
		note.classList.add("animate");
		setTimeout(() => {
			e.target.parentNode.remove();
		}, 500);
		// Canceling edit
	} else {
		// change check icon to edit icon
		const icon = note.querySelector(".fa-check");
		editIcon(icon);
		// cancel edit
		const textarea = note.querySelector("textarea");
		const text = note.querySelector("p");
		text.style.display = "flex";
		textarea.remove();
		// change editing state
		note.classList.remove("editing");
	}
}

function editNote(e) {
	// If clicking Note icon
	if (e.target.classList.contains("fa-edit")) {
		const note = e.target.parentNode;
		// e.target = i
		const noteElement = note.querySelector("p");
		const noteText = noteElement.innerText;
		// hidden the note text / p element
		noteElement.style.display = "none";
		// Tell if it in edit mode
		note.classList.add("editing");
		// Change edit icon to check icon
		const icon = e.target;
		editIcon(icon);
		// Make edit mode
		const noteEdit = document.createElement("textarea");
		noteEdit.innerText = noteText;
		// Insert to parent
		note.appendChild(noteEdit);
		noteEdit.focus();
	}
}

function saveEditedNote(e) {
	// If clicking check icon
	if (e.target.classList.contains("fa-check")) {
		const note = e.target.parentNode;
		const editedNote = note.querySelector("textarea");
		const newNoteText = editedNote.value;
		const oldNoteText = note.querySelector("p");
		// if not duplicate with other in local storage && if the same with old note text
		if (
			!isDuplicate(newNoteText) ||
			oldNoteText.innerText === newNoteText
		) {
			// Delete editing state
			editedNote.remove();
			// Create new note element
			const newNote = document.createElement("p");
			newNote.innerText = newNoteText;
			note.appendChild(newNote);
			// Change check icon to edit icon
			const icon = e.target;
			editIcon(icon);
			// Change parent editing state
			note.classList.remove("editing");
			// Save to local storage
			saveToLocalStorage(oldNoteText.innerText, newNoteText);
			// delete old note text
			oldNoteText.remove();
			// if duplicate
		} else {
			showError(newNoteText);
		}
	}
}

function isDuplicate(value) {
	if (localStorage.getItem("noteList") !== null) {
		const storage = JSON.parse(localStorage.getItem("noteList"));
		// If there is duplicate
		for (let i = 0; i < storage.length; i++) {
			if (storage[i] === value) {
				return true;
				break;
			}
		}
		return false;
	}
}

function editIcon(icon) {
	icon.classList.toggle("far");
	icon.classList.toggle("fas");
	icon.classList.toggle("fa-edit");
	icon.classList.toggle("fa-check");
}

function searchNote() {
	const search = searchText.value.toLowerCase();
	const note = document.querySelectorAll("p");
	// For Each Note
	note.forEach(text => {
		const parent = text.parentNode;
		console.log(parent);
		const noteText = text.innerText.toLowerCase();
		// If search value exist in note, then SHOW
		if (noteText.includes(search)) {
			parent.classList.remove("hidden");
			parent.classList.remove("animate");
			// If doesn't exist, then HIDE
		} else {
			parent.classList.add("animate");
			setTimeout(() => {
				parent.classList.add("hidden");
			}, 500);
		}
	});
}
// Show all note if the search bar is empty
function showAll(e) {
	if (e.target.value === "") {
		const note = document.querySelectorAll("p");
		note.forEach(text => {
			text.parentNode.classList.remove("hidden");
			setTimeout(() => {
				text.parentNode.classList.remove("animate");
			}, 300);
		});
	}
}

function saveToLocalStorage(note, newNote) {
	let notes = [];
	// If local storage empty
	if (localStorage.getItem("noteList") === null) {
		notes = [];
		// If local storage has item
	} else {
		notes = JSON.parse(localStorage.getItem("noteList"));
	}
	// if Updating note
	if (notes.includes(note)) {
		const storageIndex = notes.indexOf(note);
		notes[storageIndex] = newNote;
	} // if Making new note
	else {
		notes.push(note);
	}
	// Save to Local Storage
	localStorage.setItem("noteList", JSON.stringify(notes));
}

function deleteFromLocalStorage(note) {
	const storage = JSON.parse(localStorage.getItem("noteList"));
	const storageIndex = storage.indexOf(note);
	storage.splice(storageIndex, 1);
	localStorage.setItem("noteList", JSON.stringify(storage));
}

function changeTheme() {
	themes.classList.toggle("active");
	body.classList.toggle("active");
}

function saveThemeToLocal() {
	let data = "";
	if (body.classList.contains("active")) {
		data = "night";
	} else {
		data = "day";
	}
	localStorage.setItem("theme", JSON.stringify(data));
}

function getTheme() {
	let data = "";
	// if data exist in local
	if (localStorage.getItem("theme")) {
		data = JSON.parse(localStorage.getItem("theme"));
		if (data === "night") {
			body.classList.add("active");
			themes.classList.add("active");
		}
	}
}

function showError(text) {
	if (isDuplicate(text)) {
		error.innerHTML = "Note already exist";
		setTimeout(() => {
			error.innerHTML = "";
		}, 3000);
	} else {
		error.innerHTML = "Can't make empty note";
		setTimeout(() => {
			error.innerHTML = "";
		}, 3000);
	}
}
