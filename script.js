const inputTask = document.querySelector('.inputTask');
const addBtn = document.querySelector(".addBtn");
const taskListsBox = document.querySelector(".task-lists");
const statusBtn = document.querySelectorAll(".status span");
const clearBtn = document.querySelector(".clearBtn");

let editId;
let isEditedTask = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));//getting todo-list from local-storage

addBtn.addEventListener("click",()=>{
    let userTask = inputTask.value.trim();
    if(userTask){
        if(!isEditedTask){ // If isEditedTask isn't true
            if(!todos){
                // if todos does not exist, pass an empty array otherwise an null value will given to todos
                todos=[];
            };
            let taskInfo ={name:userTask , status:"pending"};
            todos.push(taskInfo); //adding new tasks to todos
        }
        else{
            isEditedTask = false;
            todos[editId].name = userTask;
        }

        inputTask.value="";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodoList("all");
    }
});

function showTodoList(filter){
    let list="";
    if (todos) {
        todos.forEach((todo, todoId)=> {
            // If todos status is completed, set the isCompleted value to checked
            let isCompleted = (todo.status == "completed")? "checked" : ""; //when we refresh page it will still show completed task
            if(filter == todo.status || filter == "all"){
                list += `<li class="task-item">
                <label for="${todoId}">
                    <input type="checkbox" onclick="updateStatus(this)" id="${todoId}" ${isCompleted}/>
                    <p class="${isCompleted}" >${todo.name}</p>   
                </label>
                <div class="setting">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${todoId},'${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteTask(${todoId})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`; 
            }
        }); 
    }
    // If list isn't empty insert the value inside it otherwise inset span
    taskListsBox.innerHTML = list || `<span>You don't have any task here</span>`;
};
showTodoList("all");

function updateStatus(selectedTask){
    // get the paragraph tag of selected checkbox
    let taskName = selectedTask.parentElement.lastElementChild;
    
    if(selectedTask.checked){
        taskName.classList.add("checked");
        // update the status of selected task to completed
        todos[selectedTask.id].status = "completed";
    }
    else{
        taskName.classList.remove("checked");
        // update the status of selected task to pending
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showMenu(selectedTask){
    // getting task-menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    // removing task-menu when we click on document
    document.addEventListener("click",(e)=>{
        if(e.target!=selectedTask || e.target.tagName!= "I")
        taskMenu.classList.remove("show")
    })
};

function deleteTask(todoId){
    // remove selected task from todos array
    todos.splice(todoId,1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList("all");
};

function editTask(todoId, todoName){
    console.log(todoId);
    editId = todoId;
    isEditedTask = true;
    inputTask.value = todoName;
};

statusBtn.forEach((e)=>{
    e.addEventListener("click",()=>{
        document.querySelector("span.active").classList.remove("active");
        e.classList.add("active");
        showTodoList(e.id);
    })
});

clearBtn.addEventListener("click",()=>{
     // remove selected task from todos array
    todos.splice(0,todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList("all");
})