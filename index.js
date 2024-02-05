const bulletJournal = document.querySelector('.bullet-journal');
const topContainer = document.querySelector('.top');
const bottomContainer = document.querySelector('.bottom');

const startTaskTemplate = document.querySelector('#start-task-template');
const endTaskTemplate = document.querySelector('#end-task-template');
const endedListTemplate = document.querySelector('#ended-list-template');
const endedListItemTemplate = document.querySelector('#ended-list__item-template');
const noEndedTasksTemplate = document.querySelector('#no-ended-tasks-template');
const collapsibleTemplate = document.querySelector('#collapsible-template');

const createBulletJournal = () => {
    const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));
    const currentDate = new Date();
    const currentMonthTasks = endedTasks.filter((task) => new Date(task.endTime).getMonth() == currentDate.getMonth() && new Date(task.endTime).getFullYear() == currentDate.getFullYear());
    const currentMonthTaskDate = [ ... new Set(currentMonthTasks.map((task) => new Date(task.endTime).getDate()))];
    const currentMonthLength = [...Array(currentDate.getDate()).keys()].length;
    let bulletJournalArray = []
    for (let i = 1; i <= currentMonthLength; i++) {
        if (currentMonthTaskDate.includes(i)) {
            bulletJournalArray = [...bulletJournalArray, { date: i, didTask: true }];
        } else {
            bulletJournalArray = [...bulletJournalArray, { date: i, didTask: false }];
        }
    }

    bulletJournalArray.forEach(task => {
        if (task.didTask) {
            const bullet = document.createElement('span');
            bullet.classList.add('bullet-journal__yes');
            bulletJournal.appendChild(bullet);
        } else {
            const bullet = document.createElement('span');
            bullet.classList.add('bullet-journal__no');
            bulletJournal.appendChild(bullet);
        }
    })
}

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

const createTaskID = () => {
    const id = Math.random().toString(36).slice(2);
    const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));

    if (!endedTasks || endedTasks.find((element) => element.id == id) == undefined) {
        return id;
    } else {
        return createTaskID();
    }
}

const createEndedListElement = (id, taskName, startDate, startTime, endTime) => {
    const endedListElement = endedListItemTemplate.content.cloneNode(true);

    endedListElement.querySelector('.ended-list__item').setAttribute('id', 'task-' + id);
    endedListElement.querySelector('.ended-list__item__task-name')
        .textContent = taskName;
    endedListElement.querySelector('.ended-list__item__task-start-date')
        .textContent = startDate;
    endedListElement.querySelector('.ended-list__item__task-time')
        .textContent = startTime + ' ~ ' + endTime

    return endedListElement;
}

const pageInit = () => {
    createBulletJournal();
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
        const startDates = []
        endedTasks.forEach((task) => {
            const startDate = getDate(new Date(task.startTime));
            if (startDates.find((item) => item == startDate) == undefined) {
                startDates.push(startDate);
            }
        });

        startDates.forEach((startDate, index) => {
            const collapsibleOuter = collapsibleTemplate.content.cloneNode(true);
            const collapsible = collapsibleOuter.querySelector('.collapsible');
            collapsible.classList.add(`collapsible-${startDate}`);

            if (index == 0) collapsible.classList.add(`collapsible-active`);

            const collapsibleTitle = collapsible.querySelector('.collapsible__title');
            collapsibleTitle.textContent = `<${startDate}>`;

            endedListUl.appendChild(collapsible)
        })

        endedTasks.forEach((task) => {
            const startTime = getTime(new Date(task.startTime));
            const startDate = getDate(new Date(task.startTime));
            const endTime = getTime(new Date(task.endTime));

            const collapsible = endedListUl.querySelector(`.collapsible-${startDate}`);
            const collapsibleInner = collapsible.querySelector('.collapsible__inner');

            collapsibleInner.appendChild(
                createEndedListElement(task.id, task.taskName, startDate, startTime, endTime)
            );
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
    if (window.confirm('End current task?')) {
        const id = createTaskID();
        const currentTask = JSON.parse(localStorage.getItem('currentTask'));
        const { taskName, startTime } = currentTask;
        const endTime = new Date();

        if (localStorage.getItem('endedTasks') !== null) {
            let endedTasks = JSON.parse(localStorage.getItem('endedTasks'));
            // endedTasks.push({ id, taskName, startTime, endTime });
            endedTasks = [{ id, taskName, startTime, endTime }, ...endedTasks];

            localStorage.setItem('endedTasks', JSON.stringify(endedTasks))

            const startTimeObj = new Date(startTime)

            const endedListUl = bottomContainer.querySelector('.ended-list');
            const collapsible = endedListUl.querySelector(`.collapsible-${getDate(startTimeObj)}`)

            if (collapsible) {
                collapsible.classList.add('collapsible-active');
                const collapsibleInner = collapsible.querySelector('.collapsible__inner');
                collapsibleInner.insertBefore(
                    createEndedListElement(id, taskName, getDate(startTimeObj), getTime(startTimeObj), getTime(endTime)),
                    collapsibleInner.firstChild
                );
            } else {
                // endedListUl.insertBefore(
                //     createEndedListElement(id, taskName, getDate(startTimeObj), getTime(startTimeObj), getTime(endTime)),
                //     endedListUl.firstChild
                // );
                const collapsibleOuter = collapsibleTemplate.content.cloneNode(true);
                const collapsibleWrap = collapsibleOuter.querySelector('.collapsible');
                collapsibleWrap.classList.add(`collapsible-${getDate(startTimeObj)}`);
                collapsibleWrap.classList.add('collapsible-active');
                const collapsibleInner = collapsibleOuter.querySelector('.collapsible__inner');
                const collapsibleTitle = collapsibleOuter.querySelector('.collapsible__title');
                collapsibleTitle.textContent = `<${getDate(startTimeObj)}>`;
                collapsibleInner.insertBefore(
                    createEndedListElement(id, taskName, getDate(startTimeObj), getTime(startTimeObj), getTime(endTime)),
                    collapsibleInner.firstChild
                );
                endedListUl.insertBefore(collapsibleOuter, endedListUl.firstChild);
            }
        } else {
            localStorage.setItem('endedTasks', JSON.stringify([{ id, taskName, startTime, endTime }]))
            const endedList = endedListTemplate.content.cloneNode(true);
            const endedListUl = endedList.querySelector('ul');
            // const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));

            const startTimeObj = new Date(startTime);
            const startDate = getDate(startTimeObj);

            const collapsibleOuter = collapsibleTemplate.content.cloneNode(true);
            const collapsible = collapsibleOuter.querySelector('.collapsible');
            collapsible.classList.add(`collapsible-${startDate}`);
            collapsible.classList.add('collapsible-active');

            const collapsibleTitle = collapsible.querySelector('.collapsible__title');
            collapsibleTitle.textContent = `<${startDate}>`;

            const collapsibleInner = collapsible.querySelector('.collapsible__inner');
            collapsibleInner.appendChild(
                createEndedListElement(id, taskName, getDate(startTimeObj), getTime(startTimeObj), getTime(endTime))
            );

            endedListUl.appendChild(collapsible)

            bottomContainer.querySelector('.no-ended-tasks').replaceWith(endedList);
        }
        const endTaskForm = event.target;
        const startTaskForm = startTaskTemplate.content.cloneNode(true);
        endTaskForm.parentNode.replaceChild(startTaskForm, endTaskForm);

        localStorage.removeItem('currentTask');
    }
}

const cancelTaskHandler = (event) => {
    event.preventDefault();

    if (window.confirm('Cancel current task?')) {
        localStorage.removeItem('currentTask');
        const endTaskForm = document.querySelector('.end-task');
        const startTaskForm = startTaskTemplate.content.cloneNode(true);
        endTaskForm.parentNode.replaceChild(startTaskForm, endTaskForm);
    }
}

const clearEndedList = (event) => {
    event.preventDefault();
    if (window.confirm('Clear ended task list?')) {
        localStorage.removeItem('endedTasks');
        const noEndedTasks = noEndedTasksTemplate.content.cloneNode(true);

        // Remove inner html of bottom container and then append noEndedTasks
        // to replace all children of bottom container
        bottomContainer.innerHTML = '';
        bottomContainer.appendChild(noEndedTasks);
    }
}

const collapsibleHandler = (event) => {
    const collapsible = event.target.parentElement;
    collapsible.classList.toggle('collapsible-active');
}

const deleteTask = (element) => {
    if (window.confirm('Delete task from list?')) {
        const endedTasks = JSON.parse(localStorage.getItem('endedTasks'));
        const listElement = element.parentElement;
        if (endedTasks.length == 1) {
            localStorage.removeItem('endedTasks');
            listElement.remove();

            const noEndedTasks = noEndedTasksTemplate.content.cloneNode(true);
            // Remove inner html of bottom container and then append noEndedTasks
            // to replace all children of bottom container
            bottomContainer.innerHTML = '';
            bottomContainer.appendChild(noEndedTasks);
        } else {
            const id = listElement.getAttribute('id').split('-')[1];
            // Map endedTasks to be array of ids to use indexOf function
            const index = endedTasks.map(item => item.id).indexOf(id)

            localStorage.setItem('endedTasks', JSON.stringify(endedTasks.toSpliced(index, 1)));
            listElement.remove();
        }
    }
}

pageInit();
