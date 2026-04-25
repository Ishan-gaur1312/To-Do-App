function addTask() {
    var input = document.getElementById("taskInput");
    var taskText = input.value;
    if (taskText == "") {
      alert("Please enter a task!");
      return;
    }
    var li = document.createElement("li");
    li.innerHTML = taskText;
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "deleteBtn";
    deleteButton.onclick = function () {
      li.remove();
    };
    li.appendChild(deleteButton);
    document.getElementById("taskList").appendChild(li);
    input.value = "";
  }