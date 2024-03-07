let skip = 0;

// event listener
document.addEventListener("click", function (event) {
  // Edit

  if (event.target.classList.contains("edit-me")) {
    const previous =
      event.target.parentElement.parentElement.querySelector(
        ".item-text"
      ).textContent;

    console.log("sab khali hai ", previous);
    const id = event.target.getAttribute("data-id");
    const newData = prompt("Enter new Todo text");

    //console.log("new data", newData);
    // const prevData =
    //   event.target.parentElement.parentElement.querySelector(
    //     ".item-text"
    //   ).value;

    if (newData === null) {
      return (event.target.parentElement.parentElement.querySelector(
        ".item-text"
      ).innerHTML = previous);
    } else if (newData === "") {
      return (event.target.parentElement.parentElement.querySelector(
        ".item-text"
      ).innerHTML = previous);
    }
    // else {
    //   const updatedData = prevData;
    // }

    // console.log("testing of data", prevData);
    //console.log(id,newData);

    axios
      .post("/edit_item", { id, newData })
      .then((res) => {
        if (res.status !== 200) {
          alert(res.data.message);
          return;
        }

        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;

        return;
      })
      .catch((error) => {
        alert(error);
      });
  }

  // delete api from client end
  else if (event.target.classList.contains("delete-me")) {
    const id = event.target.getAttribute("data-id");

    axios
      .post("/delete_item", { id })
      .then((res) => {
        console.log(res);
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }

        event.target.parentElement.parentElement.remove();
      })
      .catch((error) => {
        alert(err);
      });
  }

  // add item
  else if (event.target.classList.contains("add_item")) {
    //
    const todoText = document.getElementById("create_field").value;
    axios
      .post("/create_item", { todo: todoText })
      .then((res) => {
        if (res.data.status !== 201) {
          alert(res.data.message);

          return;
        } else {
          window.onload = generateTodos();
        }

        document.getElementById("create_field").value = "";
        document.getElementById("item_list").insertAdjacentHTML(
          "beforeend",
          `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                      <span class="item-text"> ${res.data.data.todo}</span>
                      <div>
                      <button data-id="${res.data.data._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                      <button data-id="${res.data.data._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
                  </div>
              </li>`
        );

        return;
      })
      .catch((error) => {
        alert(error);
      });
  } else if (event.target.classList.contains("show_more")) {
    generateTodos();
  }
});

// page load
window.onload = generateTodos();

function generateTodos() {
  axios
    .get(`/pagination_dashboard?skip=${skip}`)
    .then((res) => {
      console.log(res);
      if (res.data.status != 200) {
        alert(res.data.message);
      }
      // after this line we get access of todos on
      // client side or on browser
      const todos = res.data.data;
      skip += todos.length;
      console.log(skip);
      console.log(todos);

      document.getElementById("item_list").insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text"> ${item.todo}</span>
            <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>`;
          })
          .join("")
      );
      return;
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}
