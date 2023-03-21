console.log("works")
console.log("works")

let form = document.getElementById('form');
let submitButton = document.getElementById('submit');
let input = document.getElementById('task');
let container = document.getElementById('container');
let tasksList = document.getElementById('tasks-list');
let editFlag;
let priorityLow = document.getElementById('priority-low');
let priorityMedium = document.getElementById('priority-medium');
let priorityHigh = document.getElementById('priority-high');
let dueDate = document.getElementById('due-date')
console.log(dueDate.value);



//Load all task from data base and display them
getTasks();

//Display task, each in seperate record
function displayRecord(id, description) {
    return `<div class="record" id="${id}">
    <div class="id-box">${id}</div>
    <div class = "task-desc" id="task-desc-${id}">${description}</div>
    <i class="fa fa-pencil" aria-hidden="true"></i>
    <i class="fa fa-trash" aria-hidden="true"></i>
    </div>`
}

//Load all task from data base and display them
function getTasks() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'list.php', true);
    xhr.onload = function () {
        let tasksArray = (JSON.parse(this.responseText));
        clearTasksList();
        displayTasksList(tasksArray);
        editFlag = false;
    }
    xhr.send();
}

//Displays all tasks from server
function displayTasksList(tasks) {
    tasks.forEach(elem => {
        if (tasksList.lastElementChild === null) {
            tasksList.innerHTML = displayRecord(elem.id, elem.task);
        } else {
            tasksList.lastElementChild.insertAdjacentHTML('afterend', displayRecord(elem.id, elem.task));
        }
    })
}

//Clear tasks list
function clearTasksList() {
    tasksList.innerHTML = "";
}


//Submit task
// submitButton.addEventListener("click", function (e) {
//     e.preventDefault()
//     sendTask(input.value);
//     form.reset();
// })

submitButton.addEventListener("click", function (e){
    e.preventDefault();
    collectTaskInfo()
    form.reset();

})

function collectTaskInfo(){
    let task = input.value;
    let regDate = Date.now();
    let dueDateValue = dueDate.valueAsNumber;
    let priority;
    if(priorityLow.checked){priority = 1}
    else if (priorityMedium.checked){ priority = 2}
    else if (priorityHigh.checked){priority = 3}
    console.log(priority);
    sendTask(task, regDate, dueDateValue, priority);
}



function sendTask(task, regDate, dueDateValue, priority) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'add-task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (this.status === 200) {
            console.log('task registered')
            clearTasksList();
            getTasks();
        }
    }
    console.log(`task=${task}&regdate=${regDate}&duedate=${dueDateValue}&priority=${priority}`)
    xhr.send(`task=${task}&regdate=${regDate}&duedate=${dueDateValue}&priority=${priority}`);

}


// Remove task
container.addEventListener('click', function (e) {
    if (e.target.getAttribute("class") === "fa fa-trash") {
        let id = e.target.parentElement.getAttribute("id");
        removeTask(id)
    }
});

function removeTask(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'remove-task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (this.status === 200) {
            clearTasksList();
            getTasks();
        }
    }

    xhr.send(`id=${id}`);
}

//Edit task
container.addEventListener('click', function (e) {
    console.log('1')
    if (e.target.getAttribute('class') === 'fa fa-pencil') {
        let id = e.target.parentElement.getAttribute('id');
        let record = document.getElementById(id);
        let taskDesc = document.getElementById(`task-desc-${id}`).innerText;
        handleEdit(record, id, taskDesc);
        e.stopPropagation()
    }
})


container.addEventListener("dblclick", function (e) {
    console.log('2')
    
    let id = e.target.getAttribute('id');
    let record = document.getElementById(id);
    let taskDesc = document.getElementById(`task-desc-${id}`).innerText;
    handleEdit(record, id, taskDesc);

})

function handleEdit(record, id, taskDesc) {
    makeEditable(record, id, taskDesc)
    container.addEventListener('click', function (e) {
        console.log('3')
        if (e.target.getAttribute('class') === 'fa fa-xmark') {
            getTasks();
        } else if (e.target.getAttribute('class') === 'fa fa-check') {
            let updatedTaskDesc = document.getElementById(`task-edit-${id}`).value;
            updateTask(id, updatedTaskDesc)
        }
        e.stopPropagation();
    })

    window.addEventListener('click', function (e){
        console.log(Date.now())
        getTasks();
    }, {once: true})

    window.addEventListener('keydown', function (e) {
        if (e.key === "Enter" && editFlag === true) {
            console.log(Date.now())
            let updatedTaskDesc = document.getElementById(`task-edit-${id}`).value;
            updateTask(id, updatedTaskDesc);
        } else if (e.code === "Escape" && editFlag === true) {
            getTasks();
        }
    })
}

function makeEditable(record, id, taskDesc) {
    editFlag = true;
    record.style.outline = '2px #083b54 solid';
    record.innerHTML = `<div class="id-box">${id}</div>
    <input type="text" name="task" id="task-edit-${id}" value="${taskDesc}" autocomplete="off">
    <i class="fa fa-check" aria-hidden="true"></i>
    <i class="fa fa-xmark" aria-hidden="true"></i>
    <i class="fa fa-trash" aria-hidden="true"></i>`;
    focusInput(record.children[1]);

}

function focusInput(input) {
    let end = input.value.length
    input.setSelectionRange(end, end);
    input.focus();
}


function updateTask(id, updatedTaskDesc) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'update-task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(`id=${id}&updatedTaskDesc=${updatedTaskDesc}`);
    xhr.onload = function () {
        if (this.status === 200) {
            getTasks();
        }
    }
}

//Discard task edit

// container.addEventListener('click', function(e){
//     if(e.target.getAttribute('class') === 'fa fa-xmark'){
//         let id = e.target.parentElement.getAttribute('id');
//         console.log('jestesmy')
//     }
// })