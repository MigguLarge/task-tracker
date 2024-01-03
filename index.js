const topContainer = document.querySelector('.top');
const bottomContainer = document.querySelector('.bottom');

const startTaskTemplate = document.querySelector('#start-task-template')
const endTaskTemplate = document.querySelector('#end-task-template');
const endedListTemplate = document.querySelector('#ended-list-template')

topContainer.appendChild(startTaskTemplate.content.cloneNode(true))

if (localStorage.getItem('endedTasks') !== null) {
    const endedList = endedListTemplate.content.cloneNode(true);
    endedListUl = endedList.querySelector('ul');
    // TODO: Load ended tasks list if localstorage has item 'endedTasks'
}

const startTaskHandler = (event) => {
    event.preventDefault();
    const startTaskForm = event.target;
    const startTaskInput = startTaskForm.querySelector('#start-task-input');

    const taskName = startTaskInput.value;
    const startTime = new Date();

    startTaskInput.value = '';
    localStorage.setItem('currentTask', JSON.stringify({ taskName, startTime }));

    const endTaskForm = endTaskTemplate.content.cloneNode(true);
    endTaskForm.querySelector('.current-task-name').textContent = taskName;
    endTaskForm.querySelector('.current-task-start-time').textContent = startTime.toString();
    startTaskForm.parentNode.replaceChild(endTaskForm, startTaskForm);
}

const endTaskHandler = (event) => {
    event.preventDefault();
    const currentTask = JSON.parse(localStorage.getItem('currentTask'));
    const { taskName, startTime } = currentTask;
    const endTime = new Date();

    if (localStorage.getItem('endedTasks') !== null) {
        const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));
        console.log(endedTasks);
        endedTasks.push({ taskName, startTime, endTime });
        console.log(endedTasks);
        console.log(JSON.stringify(endedTasks))

        localStorage.setItem('endedTasks', JSON.stringify(endedTasks))
    } else {
        localStorage.setItem('endedTasks', JSON.stringify([{ taskName, startTime, endTime }]))
    }

    const endTaskForm = event.target;
    const startTaskForm = startTaskTemplate.content.cloneNode(true);
    endTaskForm.parentNode.replaceChild(startTaskForm, endTaskForm);
}
