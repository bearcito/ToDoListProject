document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const clearCompletedButton = document.getElementById('clearCompleted');

    function updateProgressGrid() {
        const currentDate = new Date();
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const totalDays = tasks.length;
        const completedDays = tasks.filter(task => task.completed).length;
        const progressPercentage = (completedDays / totalDays) * 100;

        const progressGrid = document.getElementById('progressGrid');
        progressGrid.innerHTML = '';

        for (let i = 0; i < totalDays; i++) {
            const cell = document.createElement('div');
            cell.classList.add('progress-cell');

            if (tasks[i].completed) {
                cell.style.backgroundColor = '#4CAF50'; // Verde
            } else {
                const taskDate = new Date(tasks[i].date);
                const differenceInMinutes = (currentDate - taskDate) / (1000 * 60);

                if (differenceInMinutes > 20) {
                    cell.style.backgroundColor = '#FFC107'; // Amarillo
                } else {
                    cell.style.backgroundColor = '#FF5733'; // Rojo
                }
            }

            progressGrid.appendChild(cell);
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('task');

            const taskDetails = document.createElement('span');
            taskDetails.textContent = `${task.title} - ${task.date} ${task.alarm ? `(${task.alarm})` : ''}`;
            taskDetails.addEventListener('click', () => {
                alert(`Detalles de la tarea:\n${task.title}\nFecha: ${task.date}\nAlarma: ${task.alarm}`);
            });

            const deleteButton = document.createElement('span');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
                updateProgressGrid();
            });

            listItem.appendChild(taskDetails);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });

        updateProgressGrid();
    }

    function clearCompletedTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => !task.completed);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        renderTasks();
        updateProgressGrid();
    }

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = event.target.elements.title.value;
        const alarm = event.target.elements.alarm.value;
        const repeat = event.target.elements.repeat.checked;

        if (title) {
            const currentDate = new Date();
            const newTask = {
                title,
                date: currentDate.toISOString().split('T')[0],
                alarm: alarm || null,
                repeat,
                completed: false,
            };

            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));

            renderTasks();
            updateProgressGrid();
            event.target.reset();
        } else {
            alert('Por favor, ingresa el título de la tarea.');
        }
    });

    clearCompletedButton.addEventListener('click', clearCompletedTasks);

    renderTasks();
});
