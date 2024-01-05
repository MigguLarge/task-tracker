const topContainer = document.querySelector('.top');
const bottomContainer = document.querySelector('.bottom');

const startTaskTemplate = document.querySelector('#start-task-template');
const endTaskTemplate = document.querySelector('#end-task-template');
const endedListTemplate = document.querySelector('#ended-list-template');
const noEndedTasksTemplate = document.querySelector('#no-ended-tasks-template');

const getTime = (dateObj) => {
    if (Object.prototype.toString.call(dateObj) !== "[object Date]") {
        console.log("parameter is not a date object");
        return null;
    }
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().length == 2 ? dateObj.getMinutes() : '0' + dateObj.getMinutes();
    return hours + ':' + minutes;
}

const getDate = (dateObj) => {
    if (Object.prototype.toString.call(dateObj) !== "[object Date]") {
        console.log("parameter is not a date object");
        return null
    }
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().length == 2 ? dateObj.getMonth() + 1 : '0' + (dateObj.getMonth() + 1);
    const date = dateObj.getDate().toString().length == 2 ? dateObj.getDate() : '0' + dateObj.getDate();
    return year + '-' + month + '-' + date;
}

const pageInit = () => {
    if (localStorage.getItem('currentTask') !== null) {
        const currentTask = JSON.parse(localStorage.getItem('currentTask'))
        const startTime = new Date(currentTask.startTime);
        const endTaskForm = endTaskTemplate.content.cloneNode(true);
        endTaskForm.querySelector('.end-task__name').textContent = currentTask.taskName;
        endTaskForm.querySelector('.end-task__start-time').textContent = `Started at ${getTime(startTime)}`;
        topContainer.appendChild(endTaskForm);
    } else {
        topContainer.appendChild(startTaskTemplate.content.cloneNode(true))
    }

    if (localStorage.getItem('endedTasks') !== null) {
        const endedList = endedListTemplate.content.cloneNode(true);
        const endedListUl = endedList.querySelector('.ended-list');
        const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));
        endedTasks.forEach((task) => {
            const startTime = getTime(new Date(task.startTime));
            const startDate = getDate(new Date(task.startTime));
            const endTime = getTime(new Date(task.endTime));
            const endDate = getDate(new Date(task.endTime));

            const endedListElement = endedList.querySelector('.ended-list__item').cloneNode(true);
            endedListElement.querySelector('.ended-list__item__task-name')
                .textContent = task.taskName;
            endedListElement.querySelector('.ended-list__item__task-start-date')
                .textContent = startDate;
            endedListElement.querySelector('.ended-list__item__task-start-time')
                .textContent = startTime;
            endedListElement.querySelector('.ended-list__item__task-end-time')
                .textContent = endTime;

            // endedListElement.textContent = `${task.taskName} ${startDate} ${startTime} ~ ${endTime}`;

            endedListUl.appendChild(endedListElement);
        });
        bottomContainer.appendChild(endedList);
    } else {
        bottomContainer.appendChild(noEndedTasksTemplate.content.cloneNode(true));
    }
}

const startTaskHandler = (event) => {
    event.preventDefault();
    const startTaskForm = event.target;
    const startTaskInput = startTaskForm.querySelector('.start-task__input');

    const taskName = startTaskInput.value;
    const startTime = new Date();

    startTaskInput.value = '';
    localStorage.setItem('currentTask', JSON.stringify({ taskName, startTime }));

    const endTaskForm = endTaskTemplate.content.cloneNode(true);
    endTaskForm.querySelector('.end-task__name').textContent = taskName;
    endTaskForm.querySelector('.end-task__start-time').textContent = `Started at ${getTime(startTime)}`;
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

        const endedList = endedListTemplate.content.cloneNode(true);
        const endedListUl = bottomContainer.querySelector('.ended-list');
        const endedListNewElement = endedList.querySelector('.ended-list__item').cloneNode(true);
        endedListNewElement.querySelector('.ended-list__item__task-name')
                           .textContent = taskName;
        endedListNewElement.querySelector('.ended-list__item__task-start-date')
                           .textContent = getDate(new Date(startTime));
        endedListNewElement.querySelector('.ended-list__item__task-start-time')
                           .textContent = getTime(new Date(startTime));
        endedListNewElement.querySelector('.ended-list__item__task-end-time')
                           .textContent = getTime(endTime);
        // endedListNewElement.textContent = `${taskName} ${getTime(new Date(startTime))} ~ ${getTime(endTime)}`;
        endedListUl.appendChild(endedListNewElement)
    } else {
        localStorage.setItem('endedTasks', JSON.stringify([{ taskName, startTime, endTime }]))
        const endedList = endedListTemplate.content.cloneNode(true);
        const endedListUl = endedList.querySelector('ul');
        const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));
        const endedListElement = endedList.querySelector('.ended-list__item').cloneNode(true);
        endedListElement.querySelector('.ended-list__item__task-name')
                        .textContent = taskName;
        endedListElement.querySelector('.ended-list__item__task-start-date')
                        .textContent = getDate(new Date(startTime));
        endedListElement.querySelector('.ended-list__item__task-start-time')
                        .textContent = getTime(new Date(startTime));
        endedListElement.querySelector('.ended-list__item__task-end-time')
                        .textContent = getTime(endTime);
        // endedListElement.textContent = `${taskName} ${getTime(new Date(startTime))} ~ ${getTime(endTime)}`;
        endedListUl.appendChild(endedListElement);
        bottomContainer.querySelector('.no-ended-tasks').replaceWith(endedList);
    }

    const endTaskForm = event.target;
    const startTaskForm = startTaskTemplate.content.cloneNode(true);
    endTaskForm.parentNode.replaceChild(startTaskForm, endTaskForm);

    localStorage.removeItem('currentTask');
}

pageInit();
