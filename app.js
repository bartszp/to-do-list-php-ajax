import { getDayName, getMonthName, getOrdinalNumber } from '../common-functions/common-functions.js';

let title = document.getElementsByClassName("title")[0];
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
let categoryBtns = document.getElementsByClassName("category-btn");
let categoryBtnsField = document.getElementsByClassName("categories-buttons")[0];
let sortingBtns = document.getElementsByClassName("sorting-btn");
let sortingBtnsField = document.getElementsByClassName("sorting-buttons")[0];
let categoryOrderFlag = "duedate";
let sortingOrderFlag = "asc";
let editedTaskId = null;
console.log(sortingBtns[1]);

//Activate "Registration Time" button and sorting in descending order as the defualt one
toggleButtons(categoryBtns, document.getElementById(categoryOrderFlag));
toggleButtons(sortingBtns, document.getElementById(sortingOrderFlag));


setTimeout(function(){title.innerText="Dupa"}, 3000);

//Load all task from data base and display them
getTasks();



function convertTimestamp(duedate) {
    if (duedate === 0) {
        return "- - -"
    }
    let displayDate = new Date(duedate);
    let month = getMonthName(displayDate.getMonth());
    let ordinalDay = getOrdinalNumber(displayDate.getDate());
    return ordinalDay + " of " + month;
}

//Sort array received from server
function sortingTasks(tasksArray, category, order) {
    //Converting array of object to array of arrays
    let result = tasksArray.map(elem => {
        let result = [];
        for (let i = 0; i < Object.keys(elem).length; i++) {
            result.push(Object.entries(elem)[i][1]);
        }
        return result;
    })

    if (category === "alphabetical") {
        category = 1;
    } else if (category === "regdate") {
        category = 2;
    } else if (category === "duedate") {
        category = 3;
    } else if (category === "priority") {
        category = 4;
    }
    if (order === "desc") {
        result = result.sort((a, b) => { return b[category] - a[category] })
    } else {
        result = result.sort((a, b) => { return a[category] - b[category] })
    }
    return result
}


//Load all task from data base and display them
function getTasks() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'list.php', true);
    xhr.onload = function () {
        let tasksArray = (JSON.parse(this.responseText));
        // clearTasksList();
        displayTasksList(sortingTasks(tasksArray, categoryOrderFlag, sortingOrderFlag));
        if (editedTaskId != null) {
            let editedRecord = document.getElementById(editedTaskId)
            editedRecord.style.outline = '2px #083b54 solid';
            focusInput(editedRecord.children[0]);
        }
    }
    xhr.send();
}

//Display task, each in seperate record
function displayRecord(id, description, duedate, priority) {
    let highlightArray = ["grey-dot", "grey-dot", "grey-dot"];
    highlightArray[priority] = `highlight-${priority}`;
    if (editedTaskId != id) {
        return `<div class="record" id="${id}">
    <div class="task-desc" id="task-desc-${id}">${description}</div>
    <div class= "due-date">${convertTimestamp(duedate)}</div>
    <div class="priorities">
        <span class="indicator" id="${highlightArray[0]}"></span>
        <span class="indicator" id="${highlightArray[1]}"></span>
        <span class="indicator" id="${highlightArray[2]}"></span>
    </div>
    <div class = "edit-buttons">
    <i class="fa fa-pencil" aria-hidden="true"></i>
    <i class="fa fa-trash" aria-hidden="true"></i>
    </div>
</div>`
    } else {
        return `<div class="record edited" id = "${id}">
        <input type="text" name="task" id="task-edit-${id}" value="${description}" autocomplete="off">
        <i class="fa fa-check" aria-hidden="true"></i>
        <i class="fa fa-xmark" aria-hidden="true"></i>
        <i class="fa fa-trash" aria-hidden="true"></i>
        </div>`
    }
}

//Displays all tasks from server
function displayTasksList(tasks) {
    tasks.forEach(elem => {
        if (tasksList.lastElementChild === null) {
            tasksList.innerHTML = displayRecord(elem[0], elem[1], elem[3], elem[4]);
        } else {
            tasksList.lastElementChild.insertAdjacentHTML('afterend', displayRecord(elem[0], elem[1], elem[3], elem[4]));
        }
    })
}


//Submit task
submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    collectTaskInfo()
    form.reset();
    return false;

})

function collectTaskInfo() {
    let task = input.value;
    let regDate = Date.now();
    let dueDateValue = dueDate.valueAsNumber;
    let priority;
    if (priorityLow.checked) { priority = 0 }
    else if (priorityMedium.checked) { priority = 1 }
    else if (priorityHigh.checked) { priority = 2 }
    sendTask(task, regDate, dueDateValue, priority);
}



function sendTask(task, regDate, dueDateValue, priority) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'add-task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (this.status === 200) {
            // clearTasksList();
            getTasks();
        }
    }
    xhr.send(`task=${task}&regdate=${regDate}&duedate=${dueDateValue}&priority=${priority}`);

}


// Remove task
container.addEventListener('click', function (e) {
    if (e.target.getAttribute("class") === "fa fa-trash") {
        e.preventDefault();
        let id = e.target.parentElement.parentElement.getAttribute("id");
        removeTask(id)
    }
});

function removeTask(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'remove-task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (this.status === 200) {
            // clearTasksList();
            getTasks();
        }
    }

    xhr.send(`id=${id}`);
}

//Edit task
container.addEventListener('click', function (e) {
    if (e.target.getAttribute('class') === 'fa fa-pencil') {
        let id = e.target.parentElement.parentElement.getAttribute('id');
        let record = document.getElementById(id);
        let taskDesc = document.getElementById(`task-desc-${id}`).innerText;
        handleEdit(record, id, taskDesc);
        e.stopPropagation()
    }
})


container.addEventListener("dblclick", function (e) {
    let id;
    if (e.target.getAttribute("class") === "record") {
        id = e.target.getAttribute('id');
    } else {
        id = e.target.parentElement.getAttribute('id');
    }
    let record = document.getElementById(id);
    let taskDesc = document.getElementById(`task-desc-${id}`).innerText;
    handleEdit(record, id, taskDesc);

})

function handleEdit(record, id, taskDesc) {
    editedTaskId = id;
    getTasks();
    container.addEventListener('click', function (e) {
        if (e.target.getAttribute('class') === 'fa fa-xmark') {
            editedTaskId = null;
            getTasks();
        } else if (e.target.getAttribute('class') === 'fa fa-check') {
            let updatedTaskDesc = document.getElementById(`task-edit-${id}`).value;
            updateTask(id, updatedTaskDesc)
        }
        e.stopPropagation();
    })

    window.addEventListener('click', function (e) {
        editedTaskId = null;
        getTasks();
    }, { once: true })

    window.addEventListener('keydown', function (e) {
        if (e.key === "Enter" && editedTaskId != null) {
            let updatedTaskDesc = document.getElementById(`task-edit-${id}`).value;
            updateTask(id, updatedTaskDesc);
        } else if (e.code === "Escape" && editedTaskId != null) {
            getTasks();
        }

    })
}

function makeEditable(record, id, taskDesc) {
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

//Send updated task to server and update the list
function updateTask(id, updatedTaskDesc) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'update-task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(`id=${id}&updatedTaskDesc=${updatedTaskDesc}`);
    xhr.onload = function () {
        if (this.status === 200) {
            editedTaskId = null;
            getTasks();
        }
    }
}


//Highlight clicked button
function toggleButtons(buttons, activeButton) {
    buttons = Array.from(buttons);
    buttons.forEach((elem) => {
        elem.classList.remove("active-btn");
    })
    activeButton.classList.add("active-btn");
}

//Listener on category buttons to highlight the one that is clicked
categoryBtnsField.addEventListener("click", function (e) {
    if (e.target.getAttribute("class") === "category-btn")
        toggleButtons(categoryBtns, e.target);
    categoryOrderFlag = e.target.getAttribute("id");
    console.log('here')
    getTasks()
});

//Listener on sorting buttons to highlign the one that is clicked
sortingBtnsField.addEventListener("click", function (e) {
    if (e.target.getAttribute("class") === "sorting-btn")
        toggleButtons(sortingBtns, e.target);
    sortingOrderFlag = e.target.getAttribute("id");
    getTasks()
    console.log('there')

});
