document.addEventListener("DOMContentLoaded", main);

function changeInfoMsg(msg) {
  console.log(msg);
  const submitAreaInfo = document.getElementById("submit-area-info");
  submitAreaInfo.innerText = msg;
}

function isEmailValid(email) {
  const regex = /^[a-zA-Z0-9_+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
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

  const requestData = {...jsonData, email: lowercaseEmail}

  // TODO: Send data
  console.log(requestData)
  
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
}
