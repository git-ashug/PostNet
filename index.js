console.log("Welcome to PostNet");

let parametersBox = document.getElementById("parametersBox");
let jsonRequestBox = document.getElementById("jsonRequestBox");
let jsonResponseText = document.getElementById("jsonResponseText");
let submit = document.getElementById("submit");

let jsonRadio = document.getElementById("jsonRadio");
let paramsRadio = document.getElementById("paramsRadio");

let addparamBtn = document.getElementById("addparamBtn");
let newParams = document.getElementById("newParams");
let paramsCount = 1;
let html = "";

function validations(url) {
  if (url === "") {
    document.getElementById(
      "popupMsg"
    ).innerHTML = `<div class="alert alert-warning" role="alert">
                   URL cannot be empty</div>`;

    setTimeout(() => {
      document.getElementById("popupMsg").innerHTML = "";
    }, 2000);
    return false;
  }
  return true;
}

function showParametersBox() {
  parametersBox.classList.remove("d-none");
  newParams.classList.remove("d-none");
  jsonRequestBox.classList.add("d-none");
}

function showJsonRequestBox() {
  parametersBox.classList.add("d-none");
  newParams.classList.add("d-none");
  jsonRequestBox.classList.remove("d-none");
}

//at the start, don't show Parameters Box as by default JSON will be selected.
showJsonRequestBox();

//decide which needs to be displayed when a particular radio button is selected.
jsonRadio.addEventListener("click", showJsonRequestBox);
paramsRadio.addEventListener("click", showParametersBox);

addparamBtn.addEventListener("click", addParams);

function addParams() {
  html = `
            <fieldset class="row mb-2 parameter-set">
            <legend class="col-form-label col-sm-2 pt-0">Parameter ${++paramsCount}</legend>
            <div class="col-md-3">
                <label for="key${paramsCount}" class="form-label">Key</label>
                <input type="text" class="form-control" id="key${paramsCount}" placeholder="key${paramsCount}">
            </div>
            <div class="col-md-3">
                <label for="value${paramsCount}" class="form-label">Value</label>
                <input type="text" class="form-control" id="value${paramsCount}" placeholder="value${paramsCount}">
            </div>
            <div class="col-md-3 my-4">
                <button class="btn btn-primary my-2 removeParamBtn"> - </button>
            </div>
            </fieldset>`;
  newParams.insertAdjacentHTML("beforeend", html);
}

newParams.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeParamBtn")) {
    e.target.closest("fieldset").remove();
  }
});

function fetchApi(url, httpMethod, payload) {
  let options = {
    method: httpMethod,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  if (httpMethod !== "GET") {
    options.body = payload;
  }

  fetch(url, options)
    .then((response) => response.text())
    .then((text) => {
      jsonResponseText.innerHTML = text;
      Prism.highlightAll();
    })
    .catch((error) => {
      console.error("Error:", error);
      jsonResponseText.innerHTML = "Something went wrong: " + error;
    });
}

submit.addEventListener("click", () => {
  let payload = "";
  let url = document.getElementById("url").value;
  let httpMethod = document.querySelector(
    "input[name='reqType']:checked"
  ).value; //GET/POST
  let contentType = document.querySelector(
    "input[name='contentType']:checked"
  ).value; //JSON/Parameter
  let jsonRequestText = document.getElementById("jsonRequestText");

  let isValidationsPassed = validations(url);
  if (isValidationsPassed) {
    jsonResponseText.innerHTML = "Please Wait. Fetching response...";

    if (httpMethod === "POST") {
      if (contentType === "JSON") {
        payload = jsonRequestText.value;
      } else if (contentType === "PARAMS") {
        payload = {};
        for (let i = 1; i <= paramsCount; i++) {
          if (document.getElementById("key" + i) != undefined) {
            key = document.getElementById("key" + i).value;
            value = document.getElementById("value" + i).value;
            payload[key] = value;
          }
        }
        payload = JSON.stringify(payload);
      }
    }
    fetchApi(url, httpMethod, payload);
  }
});
