import { getDayName, getMonthName, getOrdinalNumber } from '../common-functions/common-functions.js';


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
let categoryOrderFlag = "regdate";
let sortingOrderFlag = "desc";
console.log(sortingBtns[1]);

//Activate "Registration Time" button and sorting in descending order as the defualt one
toggleButtons(categoryBtns, document.getElementById(categoryOrderFlag));
toggleButtons(sortingBtns, document.getElementById(sortingOrderFlag));




//Load all task from data base and display them
getTasks();

//Display task, each in seperate record
function displayRecord(id, description, duedate, priority) {
    let highlightArray = ["grey-dot", "grey-dot", "grey-dot"];
    highlightArray[priority] = `highlight-${priority}`;
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
}

function convertTimestamp(duedate) {
    if (duedate === 0) {
        return "- - -"
    }
    let displayDate = new Date(duedate);
    let month = getMonthName(displayDate.getMonth());
    let ordinalDay = getOrdinalNumber(displayDate.getDate());
    return ordinalDay + " of " + month;
}

function sortingTasks(tasksArray, category, order) {
    //Converting array of object to array of arrays
    let arrayOfArrays = tasksArray.map(elem => {
        let result = [];
        for (let i = 0; i < Object.keys(elem).length; i++) {
            result.push(Object.entries(elem)[i][1]);
        }
        console.log(result);
        return result;
    })
    return arrayOfArrays
}

let obj = {
    a: 1,
    b: 2,
}



//Load all task from data base and display them
function getTasks() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'list.php', true);
    xhr.onload = function () {
        let tasksArray = (JSON.parse(this.responseText));
        sortingTasks(tasksArray);
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
            tasksList.innerHTML = displayRecord(elem.id, elem.task, elem['due-date'], elem.priority);
        } else {
            tasksList.lastElementChild.insertAdjacentHTML('afterend', displayRecord(elem.id, elem.task, elem['due-date'], elem.priority));
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

submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    collectTaskInfo()
    form.reset();

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
            clearTasksList();
            getTasks();
        }
    }
    xhr.send(`task=${task}&regdate=${regDate}&duedate=${dueDateValue}&priority=${priority}`);

}


// Remove task
container.addEventListener('click', function (e) {
    if (e.target.getAttribute("class") === "fa fa-trash") {
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
            clearTasksList();
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
        console.log("eneter");
        id = e.target.getAttribute('id');
    } else {
        id = e.target.parentElement.getAttribute('id');
    }
    let record = document.getElementById(id);
    let taskDesc = document.getElementById(`task-desc-${id}`).innerText;
    handleEdit(record, id, taskDesc);

})

function handleEdit(record, id, taskDesc) {
    makeEditable(record, id, taskDesc)
    container.addEventListener('click', function (e) {
        if (e.target.getAttribute('class') === 'fa fa-xmark') {
            getTasks();
        } else if (e.target.getAttribute('class') === 'fa fa-check') {
            let updatedTaskDesc = document.getElementById(`task-edit-${id}`).value;
            updateTask(id, updatedTaskDesc)
        }
        e.stopPropagation();
    })

    window.addEventListener('click', function (e) {
        getTasks();
    }, { once: true })

    window.addEventListener('keydown', function (e) {
        if (e.key === "Enter" && editFlag === true) {
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
});

//Listener on sorting buttons to highlign the one that is clicked
sortingBtnsField.addEventListener("click", function (e) {
    if (e.target.getAttribute("class") === "sorting-btn")
        toggleButtons(sortingBtns, e.target);
        sortingOrderFlag = e.target.getAttribute("id");
});
