// For testing, use "./assets/ramen/definitelyRamen.jpg" for the image, it is definitely a picture of ramen, you can trust me
// 67.164.191.36
// URL where json-server runs. Sould be localhost unless json-serevr is being run elsewhere
const URL = "http://localhost:3000";

let currentlySelected = 1;

document.addEventListener("DOMContentLoaded", () => {
  buildPage();
});

function buildPage() {
  fetchMenu(); // Display menu items and previews
  buildForms(); // Event handling for form
  buildDeleteButton(); // Event handling for delete
}

// Form event handling
function buildForms() {
  const form = document.querySelector("#new-ramen");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const restaurant = e.target.restaurant.value;
    const image = e.target.image.value;
    const rating = e.target.rating.value;
    const comment = e.target["new-comment"].value;
    //Check all fields have a value
    if (
      name !== "" &&
      restaurant !== "" &&
      image !== "" &&
      rating !== "" &&
      comment !== ""
    ) {
      addNewRamen(name, restaurant, image, rating, comment);
    } else {
      alert("Please fill out all form items!");
    }
  });
}

function buildDeleteButton() {
  const deleteForm = document.querySelector("#delete-ramen");
  deleteForm.addEventListener("click", () => {
    deleteItem(currentlySelected);
    currentlySelected = 1;
  });
}

function fetchMenu() {
  const previewDiv = document.querySelector("#ramen-menu");
  previewDiv.innerHTML = "";
  fetch(`${URL}/ramens`)
    .then((r) => r.json())
    .then((r) => {
      r.forEach((item) => {
        displayPreview(item);
        if (parseInt(item.id) === currentlySelected) {
          displayItem(item);
        }
      });
    })
    .catch((error) => {
      console.log("ERROR (fetchMenu) // " + error);
    });
}

function displayPreview(item) {
  const previewDiv = document.querySelector("#ramen-menu");
  const preview = document.createElement("img");
  preview.src = item.image;
  preview.addEventListener("click", () => {
    displayItem(item);
    currentlySelected = item.id; // update the default image on click, so we don't lose it when uploading a new rating
  });
  previewDiv.append(preview);
}

function displayItem(item) {
  const imageBox = document.querySelector("#ramen-detail .detail-image");
  const nameBox = document.querySelector("#ramen-detail .name");
  const restaurantBox = document.querySelector("#ramen-detail .restaurant");
  const ratingBox = document.querySelector("#rating-display");
  const commentBox = document.querySelector("#comment-display");
  imageBox.src = item.image;
  nameBox.textContent = item.name;
  restaurantBox.textContent = item.restaurant;
  ratingBox.textContent = item.rating;
  commentBox.textContent = item.comment;
}

async function deleteItem(id) {
  // Async so we wait until completion or error before calling fetchMenu to reload the preview items
  await fetch(`${URL}/ramens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    console.log("ERROR (deleteItem) // " + error);
  });
  fetchMenu();
}

function addNewRamen(name, restaurant, image, rating, comment) {
  console.log("Creating new ramen rating");
  fetch(`${URL}/ramens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: name,
      restaurant: restaurant,
      image: image,
      rating: rating,
      comment: comment,
    }),
  })
    .then((r) => {
      console.log("Posted new ramen rating.");
      fetchMenu();
    })
    .catch((error) => {
      console.log("ERROR (addNewRamen) // " + error);
    });
}
