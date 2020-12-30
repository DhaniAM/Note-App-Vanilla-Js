// Grab DOM
const inputBtn = document.querySelector(".input button");
const inputText = document.querySelector(".input input");
const searchBtn = document.querySelector(".search button");
const searchText = document.querySelector(".search input");
const notes = document.querySelector(".notes");
const day = document.querySelector(".day");
const night = document.querySelector(".night");
const themes = document.querySelector(".themes");
const body = document.querySelector("body");

// Event Listener
window.addEventListener("load", () => {
	getNote();
	getTheme();
});
// Input
inputBtn.addEventListener("click", inputHandler);
inputText.addEventListener("keyup", e => {
	if(e.keyCode === 13) {
		inputHandler();
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
notes.addEventListener("click", removeNote);
// Theme
day.addEventListener("click", () => {
	changeTheme();
	saveThemeToLocal();
});
night.addEventListener("click", () => {
	changeTheme();
	saveThemeToLocal();
});

// Function
function getNote() {
	if (localStorage) {
		const savedNotes = JSON.parse(
			localStorage.getItem("noteList")
		);
		// Make note for each note in local storage
		savedNotes.map(note => {
			addNote(note);
		});
	}
}

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

function addNote(text) {
	// Make note div
	const noteDiv = document.createElement("div");
	noteDiv.className = "note";
	// Make note
	const note = document.createElement("p");
	note.innerText = text;
	// Make close btn
	const closeBtn = `<i class="fa fa-times"></i>`;
	noteDiv.innerHTML = closeBtn;
	// Insert content to noteDiv
	noteDiv.appendChild(note);
	// Insert noteDiv to parent Notes
	notes.appendChild(noteDiv);
}

function removeNote(e) {
	const note = e.target.parentNode;
	const noteText = note.querySelector("p").innerText;
	if (e.target.classList.contains("fa")) {
		deleteFromLocalStorage(noteText);
		e.target.parentNode.remove();
	}
}

function searchNote() {
	const search = searchText.value;
	const note = document.querySelectorAll("p");
	note.forEach(text => {
		const parent = text.parentNode;
		// If search value exist in note, then SHOW
		if (text.innerText.includes(search)) {
			parent.classList.remove("hidden");
			parent.classList.remove("animate");
			// If doesn't exist, then HIDE
		} else {
			parent.classList.add("animate");
			parent.addEventListener("transitionend", () => {
				parent.classList.add("hidden");
			});
		}
	});
}
// Show all note if the search bar is empty
function showAll(e) {
	if (e.target.value === "") {
		const note = document.querySelectorAll("p");
		note.forEach(text => {
			text.parentNode.classList.remove("animate");
			text.parentNode.classList.remove("hidden");
		});
	}
}

function saveToLocalStorage(note) {
	let notes;
	// If local storage empty
	if (localStorage.getItem("noteList") === null) {
		notes = [];
		// If local storage has item
	} else {
		notes = JSON.parse(localStorage.getItem("noteList"));
	}
	notes.push(note);
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
	if(body.classList.contains("active")) {
		data = "night";
	} else {
		data = "day";
	}
	localStorage.setItem("theme", JSON.stringify(data));
}

function getTheme() {
	let data = "";
	// if data exist in local
	if(localStorage.getItem("theme")) {
		data = JSON.parse(localStorage.getItem("theme"));
		if(data === "night") {
			body.classList.add("active");
			themes.classList.add("active");
		}
	}
}