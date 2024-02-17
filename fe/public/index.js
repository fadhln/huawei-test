const beUrl = "http://localhost:3000";

function changeInfoMsg(msg) {
  const submitAreaInfo = document.getElementById("submit-area-info");
  submitAreaInfo.innerText = msg;
}

function isEmailValid(email) {
  const regex = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function isPhoneValid(phone) {
  const regex = /^[0-9]{9,12}/;
  return regex.test(phone);
}

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(this);

  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  if (!jsonData.notes || jsonData.notes.length < 3) {
    changeInfoMsg("Notes length cannot be less than 3 characters");
    return;
  }

  if (jsonData.notes.length > 255) {
    changeInfoMsg("Notes length cannot be more than 255 characters");
    return;
  }

  if (!jsonData.name || jsonData.name.length < 1) {
    changeInfoMsg("Name cannot be empty");
    return;
  }

  if (jsonData.name.length > 255) {
    changeInfoMsg("Name length cannot be more than 255 characters");
    return;
  }

  const lowercaseEmail = jsonData.email?.toLowerCase();
  if (!isEmailValid(lowercaseEmail)) {
    changeInfoMsg("E-mail is not valid");
    return;
  }

  if (!jsonData.phone || !isPhoneValid(jsonData.phone)) {
    changeInfoMsg("Phone number is not valid");
    return;
  }

  const requestData = { ...jsonData, email: lowercaseEmail };

  const endpoint = beUrl + "/notes";
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error has occured. Msg: ${response.statusText}`);
      }

      return response.json();
    })
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => {
      alert(err);
    });
}

function createNoteEl(noteId) {
  const noteEl = document.createElement("div");
  noteEl.className = "note";
  noteEl.id = `note-${noteId}`;

  noteEl.innerHTML = `
  <div class="note-header">
    <p id="note-name-${noteId}"></p>
    <button class="see-more-btn" id="see-more-btn-${noteId}">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>
  </div>
  <div class="note-details" id="note-details-${noteId}">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <span id="note-email-${noteId}"></span>
    </div>
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
        />
      </svg>
      <span id="note-phone-${noteId}"></span>
    </div>
  </div>
  <p id="note-content-${noteId}" class="note-content"></p>
  <div class="note-footer">
    <hr />
    <span id="note-distance-${noteId}"></span>
  </div>`;

  return noteEl;
}

function populateNoteEl(noteData) {
  const noteNameId = `note-name-${noteData.id}`;
  const noteSeeMoreBtnId = `see-more-btn-${noteData.id}`;
  const noteDetailsId = `note-details-${noteData.id}`;
  const noteEmailId = `note-email-${noteData.id}`;
  const notePhoneId = `note-phone-${noteData.id}`;
  const noteContentId = `note-content-${noteData.id}`;
  const noteDistanceToNowId = `note-distance-${noteData.id}`;

  document.getElementById(noteNameId).innerText = noteData.name ?? "-";
  document.getElementById(noteEmailId).innerText = noteData.email ?? "-";
  document.getElementById(notePhoneId).innerText = noteData.phone ?? "-";
  document.getElementById(noteContentId).innerText = noteData.notes ?? "-";
  document.getElementById(noteDistanceToNowId).innerText =
    noteData.distanceToNow ?? "-";

  const noteDetails = document.getElementById(noteDetailsId);
  const seeMoreBtn = document.getElementById(noteSeeMoreBtnId);
  seeMoreBtn.addEventListener("click", () => {
    const expanded = seeMoreBtn.getAttribute("data-expanded") === "true";
    seeMoreBtn.setAttribute("data-expanded", expanded ? "false" : "true");

    noteDetails.style.maxHeight = expanded
      ? 0
      : noteDetails.scrollHeight + "px";
    noteDetails.style.visibility = expanded ? "collapse" : "visible";
    seeMoreBtn.style.transform = expanded ? `rotate(0)` : `rotate(180deg)`;
  });
}

function renderNotes(data) {
  if (!data) {
    return;
  }

  const readNoteEl = document.getElementById("read-note");
  while (readNoteEl.lastElementChild) {
    readNoteEl.removeChild(readNoteEl.lastElementChild);
  }

  if (
    typeof data.content === "object" &&
    Array.isArray(data.content) &&
    data.content.length > 0
  ) {
    readNoteEl.style.display = "grid";
    data.content?.forEach((c) => {
      readNoteEl.prepend(createNoteEl(c.id));
      populateNoteEl(c);
    });
  } else {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-message";
    emptyMsg.innerText = "This place is empty ...";

    readNoteEl.style.display = "block";
    readNoteEl.append(emptyMsg);
  }
}

function readAllNotes() {
  const endpoint = beUrl + "/notes";
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error has occured. Msg: ${response.statusText}`);
      }

      return response.json();
    })
    .then((data) => {
      renderNotes(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function main() {
  const detailsArea = document.getElementById("details-area");
  const submitAreaInfo = document.getElementById("submit-area-info");
  submitAreaInfo.style.visibility = "hidden";

  const notesTextArea = document.getElementById("notes");
  notesTextArea.addEventListener("focus", () => {
    detailsArea.style.maxHeight = detailsArea.scrollHeight + "px";
    detailsArea.style.overflow = "visible";
    submitAreaInfo.style.visibility = "visible";
  });

  const charCountEl = document.getElementById("char-count");
  notesTextArea.addEventListener("input", (e) => {
    const notesText = notesTextArea.value;
    const charCount = notesText.length;

    charCountEl.innerText = `${charCount ?? 0}/255`;
    if (charCount > 255) {
      charCountEl.style.color = "#ef4444";
    } else {
      charCountEl.style.color = "inherit";
    }
  });

  const createNoteForm = document.getElementById("create-note");
  createNoteForm.addEventListener("submit", handleSubmit);

  // Initial render
  readAllNotes();
  window.addEventListener("focus", () => {
    readAllNotes();
  });
}

document.addEventListener("DOMContentLoaded", main);
