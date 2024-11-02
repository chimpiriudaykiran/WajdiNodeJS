// Static JSON file paths from the server
const jsonFiles = {
  Test: "/update/test.json",
  Home: "/data.json",
  Publications: "/publication/data.json",
  Talks: "/talks/data.json",
  Projects: "/projects/data.json",
  Tools: "/tools/data.json",
  People: "/people/data.json",
  News: "/news/data.json",
  Tags: "/tags/data.json",
};

let currentJsonContent = {};
let currentFileName = "";
let selectedNodeKey = "";
let pointer;

// Function to load JSON file list
function loadFileList() {
  const fileListContainer = document.getElementById("jsonFileList");
  fileListContainer.innerHTML = "";
  Object.keys(jsonFiles).forEach((fileName) => {
    const fileItem = document.createElement("button");
    fileItem.classList.add("list-group-item", "list-group-item-action");
    fileItem.innerHTML = `${fileName} <i class="fa-solid fa-angle-right"></i>`;
    fileItem.style.display = "flex";
    fileItem.style.justifyContent = "space-between";
    fileItem.style.alignItems = "center";
    fileItem.onclick = () => loadJsonContent(fileName);
    fileListContainer.appendChild(fileItem);
  });
}

// Function to load JSON content from a file path
async function loadJsonContent(fileName) {
  try {
    const response = await fetch(jsonFiles[fileName]);
    if (!response.ok) throw new Error(`Failed to load ${fileName}`);
    currentJsonContent = await response.json();
    currentFileName = fileName;

    // Hide file list and show JSON tree
    document.getElementById("jsonFileListContainer").classList.add("d-none");
    document.getElementById("jsonTreeContainer").classList.remove("d-none");

    // Display the JSON content as a tree
    const jsonTreeContainer = document.getElementById("jsonTree");
    jsonTreeContainer.innerHTML = ""; // Clear previous content
    createJsonTree(currentJsonContent, jsonTreeContainer);
  } catch (error) {
    alert(`Error loading file: ${error.message}`);
  }
}

function createJsonTree(jsonData, parentElement, parentKey = "") {
  parentElement.innerHTML = ""; // Clear existing content to prevent duplicates

  const ul = document.createElement("ul");
  ul.id = "my-tree";
  Object.keys(jsonData).forEach((key) => {
    const li = document.createElement("li");
    li.classList.add("tree-node");
    const arrow = document.createElement("span");
    arrow.classList.add("arrow", "bi", "bi-caret-right"); // Bootstrap Icons
    li.appendChild(arrow);
    li.appendChild(document.createTextNode(key));

    // Create the full path for the current key
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof jsonData[key] === "object" && jsonData[key] !== null) {
      li.classList.add("has-children");
      const childrenContainer = document.createElement("div");
      childrenContainer.classList.add("children");
      createJsonTree(jsonData[key], childrenContainer, fullKey); // Pass fullKey as parentKey for nested nodes
      li.appendChild(childrenContainer);

      li.onclick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        li.classList.toggle("expanded");
        arrow.classList.toggle("bi-caret-right");
        arrow.classList.toggle("bi-caret-down");
      };
    } else {
      li.onclick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        pointer = { value: jsonData[key] };
        displayEditableValue(fullKey, jsonData[key], li);
      };
    }

    ul.appendChild(li);
  });

  parentElement.appendChild(ul);
}

// Display JSON key and value in input fields
function displayEditableValue(fullKey, value, li) {
  if (selectedNodeKey) {
    const previousSelectedNode = document.querySelector(
      ".tree-node.selected-node"
    );
    if (previousSelectedNode)
      previousSelectedNode.classList.remove("selected-node");
  }
  li.classList.add("selected-node");
  selectedNodeKey = fullKey;

  const editorContainer = document.getElementById("editor");
  editorContainer.innerHTML = `<h5>Editing: ${fullKey}</h5>`;

  const keyInput = document.createElement("input");
  keyInput.type = "text";
  keyInput.classList.add("form-control", "mb-2");
  keyInput.value = fullKey.split(".").pop(); // Show only the last segment as key
  keyInput.placeholder = "Key";

  const textarea = document.createElement("textarea");
  textarea.classList.add("form-control");
  textarea.value = value;
  textarea.placeholder = "Value";

  keyInput.onblur = () => {
    const newKey = keyInput.value.trim();
    if (newKey && newKey !== fullKey.split(".").pop()) {
      updateJsonKey(fullKey, newKey);
      fullKey = `${fullKey.substring(
        0,
        fullKey.lastIndexOf(".") + 1
      )}${newKey}`;
    }
  };

  textarea.onblur = () => {
    updateJsonValue(fullKey, textarea.value);
    createJsonTree(currentJsonContent, document.getElementById("jsonTree"));
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger", "mt-2");
  deleteButton.innerText = "Delete Node";
  deleteButton.onclick = () => deleteNode(fullKey);

  editorContainer.appendChild(keyInput);
  editorContainer.appendChild(textarea);
  editorContainer.appendChild(deleteButton);

  document.getElementById(
    "selectedNodeDisplay"
  ).innerHTML = `<strong>Selected Node:</strong> ${fullKey}`;
}

// Function to update JSON key
function updateJsonKey(fullKey, newKey) {
  const keys = fullKey.split(".");
  let obj = currentJsonContent;
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  const oldKey = keys.pop();
  if (obj.hasOwnProperty(oldKey)) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
    selectedNodeKey = `${keys.join(".")}.${newKey}`;
  }
}

// Update JSON value for a specific key path
function updateJsonValue(fullKey, newValue) {
  const keys = fullKey.split(".");
  let obj = currentJsonContent;
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = newValue;
}

// Delete JSON node
function deleteNode(fullKey) {
  const keys = fullKey.split(".");
  let obj = currentJsonContent;
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  delete obj[keys[keys.length - 1]];
  selectedNodeKey = "";
  document.getElementById("editor").innerHTML = ""; // Clear the editor
  createJsonTree(currentJsonContent, document.getElementById("jsonTree"));
}

// Modify save button functionality to remove the unused "Add New Key" button logic
document.getElementById("saveBtn").addEventListener("click", saveJsonContent);

// Function to save the updated JSON back to the server
async function saveJsonContent() {
  try {
    const response = await fetch(`/save-json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: jsonFiles[currentFileName], // Include .json extension in filename
        content: currentJsonContent, // The JSON content to save
      }),
    });
    if (!response.ok) throw new Error(`Failed to save ${currentFileName}`);
    alert("JSON saved successfully!");
  } catch (error) {
    alert(`Error saving file: ${error.message}`);
  }
}

// document.getElementById("addNewKeyBtn").addEventListener("click", () => {
//   const newKey = document.getElementById("newKeyInput").value.trim();
//   if (newKey && selectedNodeKey) {
//     // Navigate to the selected node in the JSON structure
//     const keys = selectedNodeKey.split(".");
//     let parentObj = currentJsonContent;

//     // Find the parent object for the selected key
//     for (let i = 0; i < keys.length - 1; i++) {
//       parentObj = parentObj[keys[i]];
//     }

//     // Check if the new key already exists
//     if (!parentObj.hasOwnProperty(newKey)) {
//       parentObj[newKey] = ""; // Initialize new key with an empty string
//       createJsonTree(currentJsonContent, document.getElementById("jsonTree")); // Refresh the tree
//       document.getElementById("newKeyInput").value = ""; // Clear input field
//     } else {
//       alert("Key already exists under the selected node.");
//     }
//   } else {
//     alert("Please select a node and enter a valid key name.");
//   }
// });

// Event listener for saving changes
document.getElementById("saveBtn").addEventListener("click", saveJsonContent);

// Event listener for the back button
document.getElementById("backButton").addEventListener("click", () => {
  // Hide tree view and show file list again
  document.getElementById("jsonTreeContainer").classList.add("d-none");
  document.getElementById("jsonFileListContainer").classList.remove("d-none");
});

// Event listeners for Expand All and Collapse All buttons
document.getElementById("expandAllBtn").addEventListener("click", () => {
  const nodes = document.querySelectorAll(".tree-node");
  nodes.forEach((node) => {
    node.classList.add("expanded");
    const arrow = node.querySelector(".arrow");
    if (arrow) {
      arrow.classList.remove("bi-caret-right");
      arrow.classList.add("bi-caret-down");
    }
  });
});

document.getElementById("collapseAllBtn").addEventListener("click", () => {
  const nodes = document.querySelectorAll(".tree-node");
  nodes.forEach((node) => {
    node.classList.remove("expanded");
    const arrow = node.querySelector(".arrow");
    if (arrow) {
      arrow.classList.remove("bi-caret-down");
      arrow.classList.add("bi-caret-right");
    }
  });
});

// Load JSON file list on page load
window.onload = loadFileList;
