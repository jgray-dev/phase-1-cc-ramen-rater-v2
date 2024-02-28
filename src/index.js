// index.js

let currentlySelected = 1;

document.addEventListener("DOMContentLoaded", () => {
  buildPage();
});

function buildPage() {
  fetchMenu(); // Display menu items and previews

  // Form event handling
  const form = document.querySelector("#new-ramen");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const restaurant = e.target.restaurant.value;
    const image = e.target.image.value;
    const rating = e.target.rating.value;
    const comment = e.target["new-comment"].value;
    //Check all fields have been submitted
    if (
      name !== "" &&
      restaurant !== "" &&
      image !== "" &&
      rating !== "" &&
      comment !== ""
    ) {
      addNewRamen(name, restaurant, image, rating, comment);
    }
  });
  const deleteForm = document.querySelector("#delete-ramen");
  deleteForm.addEventListener("click", () => {
    deleteItem(currentlySelected).then((r) => {});
    currentlySelected = 1;
  });
}

async function deleteItem(id) {
  await fetch(`http://67.164.191.36:3000/ramens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    console.log("Deleted?", id);
  });
  fetchMenu();
}

function addNewRamen(name, restaurant, image, rating, comment) {
  console.log("Creating new ramen rating");
  fetch("http://67.164.191.36:3000/ramens", {
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
    .then((r) => r.json())
    .then((r) => {
      console.log("Posted new ramen rating.");
      fetchMenu();
    });
}

function fetchMenu() {
  const previewDiv = document.querySelector("#ramen-menu");
  previewDiv.innerHTML = "";
  fetch("http://67.164.191.36:3000/ramens")
    .then((r) => r.json())
    .then((r) => {
      r.forEach((item) => {
        displayPreview(item);
        if (parseInt(item.id) === currentlySelected) {
          displayItem(item);
        }
      });
    });
}

function displayPreview(item) {
  const previewDiv = document.querySelector("#ramen-menu");
  const preview = document.createElement("img");
  preview.src = item.image;
  preview.width = 100;
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
  imageBox.src = item.image;
  nameBox.textContent = item.name;
  restaurantBox.textContent = item.restaurant;

  const ratingBox = document.querySelector("#rating-display");
  const commentBox = document.querySelector("#comment-display");
  ratingBox.textContent = item.rating;
  commentBox.textContent = item.comment;
}
