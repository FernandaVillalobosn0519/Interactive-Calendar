const daysTag = document.querySelector(".days"), /*Selección de elementos del DOM*/
      currentDate = document.querySelector(".current-date"),
      prevNextIcon = document.querySelectorAll(".icons span");

      let darkmode = localStorage.getItem('darkmode');

      const themeSwitch = document.getElementById('theme-switch');
      
      const enableDarkMode = () => {
          document.body.classList.add('darkmode');
          localStorage.setItem('darkmode', 'active');
          }
      
      const disableDarkMode = () => {
              document.body.classList.remove('darkmode');
              localStorage.setItem('darkmode', null);
          }
      
      if (darkmode === "active") enableDarkMode();  
      
      themeSwitch.addEventListener("click", () => {
          darkmode = localStorage.getItem('darkmode');
          darkmode !== "active" ? enableDarkMode() : disableDarkMode();
        });      

/*Inicialización de variables de fecha*/
let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/*Función para generar y mostrar el calendario*/
const renderCalendar = () => {
    let firstDayofMonth = new Date(currentYear, currentMonth, 1).getDay(), 
        lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate(), 
        lastDayofMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay(), 
        lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate();

    //Generando HTML
    let liTag = "";

    //Días del mes anterior
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    //Días del mes actual
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    //Días del mes sgt
    for (let i = lastDayofMonth; i < 6; i++) { 
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { 
    icon.addEventListener("click", () => { 
        currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;

        if (currentMonth < 0 || currentMonth > 11) { 
            date = new Date(currentYear, currentMonth, new Date().getDate()); 
            currentYear = date.getFullYear(); 
            currentMonth = date.getMonth(); 
        } else { 
            date = new Date(); 
        }
        renderCalendar(); 
    });
});

/* Añadir evento al calendario loco. */

document.addEventListener('DOMContentLoaded', () => {
    const daysContainer = document.querySelector('.days');
    const taskInput = document.querySelector('.add input');
    const addTaskButton = document.querySelector('.add button');
    const currentDateElement = document.querySelector('.current-date');
    const eventTimeInput = document.querySelector('#dashboard #event-time');
    const eventDescriptionInput = document.querySelector('#dashboard #event-description');
    let selectedDay = null;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};

    // Obtener el mes y año actualmente mostrados en el calendario
    const getDisplayedMonthAndYear = () => {
        const [monthName, year] = currentDateElement.textContent.split(' ');
        const displayedMonth = new Date(`${monthName} 1, ${year}`).getMonth();
        const displayedYear = parseInt(year);
        return { displayedMonth, displayedYear };
    };

    // Deshabilitar fehcas pasadass.
    const disablePastDays = () => {
        const dayElements = daysContainer.querySelectorAll('li');
        const { displayedMonth, displayedYear } = getDisplayedMonthAndYear();
        today.setHours(0, 0, 0, 0);
        dayElements.forEach((dayElement) => {
            const day = parseInt(dayElement.textContent);

            if (!day || isNaN(day)) return; 

            const isInactive = dayElement.classList.contains('inactive'); // Verificar si es del mes anterior o siguiente
            let date;

            if (isInactive && day > 15) { // Fechas del mes anterior
                date = new Date(displayedYear, displayedMonth - 1, day);
            } else if (isInactive && day <= 15) { // Fechas del mes siguiente
                date = new Date(displayedYear, displayedMonth + 1, day);
            } else { // Fechas del mes actual
                date = new Date(displayedYear, displayedMonth, day);
            }

            date.setHours(0, 0, 0, 0);

            if (date < today) {
                dayElement.classList.add('disabled');
                dayElement.style.pointerEvents = 'none'; 
                dayElement.style.color = '#ccc'; 
            } else {
                dayElement.classList.remove('disabled');
                dayElement.style.pointerEvents = 'auto';
                dayElement.style.color = ''; // Resetear el color para fechas activas
            }

            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (savedTasks[dateKey] && savedTasks[dateKey].length > 0) {
                dayElement.classList.add('has-event');
            }  else {
                dayElement.classList.remove('has-event'); // Asegurarse de que no se subraye si no hay eventos
            }
            
        });
    };

    // seleccciona día del calendaroi
    daysContainer.addEventListener('click', (event) => {
        const target = event.target.closest('li'); 
        if (target && !target.classList.contains('disabled')) {
            if (selectedDay) selectedDay.classList.remove('selected');
            selectedDay = target;
            selectedDay.classList.add('selected');
        }
    });

    // Añadir tarea al día seleccionado
    addTaskButton.addEventListener('click', () => {
        if (!selectedDay) {
            alert('Please select a day.');
            return;
        }
        const task = taskInput.value.trim();
        const eventTime = eventTimeInput.value;
        const eventDescription = eventDescriptionInput.value.trim();
        
        if (!task || !eventTime || !eventDescription) {
            alert('Please fill in all fields.');
            return;
        }

        const day = parseInt(selectedDay.textContent);
        const { displayedMonth, displayedYear } = getDisplayedMonthAndYear();
        const formattedMonth = String(displayedMonth + 1).padStart(2, '0'); // Formato de dos dígitos para el mes
        const dateKey = `${displayedYear}-${formattedMonth}-${day}`;

        // Guardar tarea en LocalStorage
        if (!savedTasks[dateKey]) {
            savedTasks[dateKey] = [];
        }
        savedTasks[dateKey].push(`${task} at ${eventTime} - ${eventDescription}`);
        localStorage.setItem('calendarTasks', JSON.stringify(savedTasks));

        // Aplicar estilo al día con evento guardado
        selectedDay.classList.add('has-event');

        disablePastDays();

        //Limpiamos los campos en el add
        taskInput.value = '';
        eventTimeInput.value = '';
        eventDescriptionInput.value = '';
    });


    const observer = new MutationObserver(() => {
        disablePastDays();
    });

    observer.observe(daysContainer, { childList: true });


    disablePastDays();
});



/*Buscando las tareas- no gunciona aún pero tratamos.
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search input[type="text"]');
    const searchButton = document.querySelector('.search-button');
    const daysContainer = document.querySelector('.days');
    const currentDateElement = document.querySelector('.current-date');


    // mes y año actual.
    const getDisplayedMonthAndYear = () => {
        const [monthName, year] = currentDateElement.textContent.split(' ');
        const displayedMonth = new Date(`${monthName} 1, ${year}`).getMonth();
        const displayedYear = parseInt(year);
        return { displayedMonth, displayedYear };
    };

    // palabra clave.
    const searchTasks = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            alert('Please enter a date (YYYY-MM-DD) or a keyword to search.');
            return;
        }

        const { displayedMonth, displayedYear } = getDisplayedMonthAndYear();

        // Si la consulta es una fecha en formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
            const [year, month, day] = query.split('-').map(Number);


            if (year === displayedYear && month - 1 === displayedMonth) {
                const dayElement = [...daysContainer.querySelectorAll('li')].find(
                    (li) => parseInt(li.textContent) === day
                );

                if (dayElement) {
                    daysContainer.querySelectorAll('li').forEach((li) => li.classList.remove('highlight'));
                    dayElement.classList.add('highlight');
                    dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert('No tasks found for the specified date.');
                }
            } else {
                alert('The date is not in the current calendar view.');
            }
        } else {
            const dayElements = daysContainer.querySelectorAll('li');
            let found = false;

            dayElements.forEach((dayElement) => {
                const tasks = [...dayElement.querySelectorAll('.task')];
                tasks.forEach((task) => {
                    if (task.textContent.toLowerCase().includes(query)) {
                        dayElement.classList.add('highlight');
                        found = true;
                    }
                });
            });

            if (!found) {
                alert('No tasks found matching the keyword.');
            }
        }
    };

    // clic bsuqeuda.
    searchButton.addEventListener('click', searchTasks);

    const observer = new MutationObserver(() => {
        daysContainer.querySelectorAll('li').forEach((li) => li.classList.remove('highlight'));
    });

    observer.observe(daysContainer, { childList: true });
});*/

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.sidebar .tab');
    const tabContents = document.querySelectorAll('.tab-content');

    const getCurrentWeek = () => {
        const today = new Date();
        const firstDayOfWeek = today.getDate() - today.getDay(); // Get the first day of the week (Sunday)
        const lastDayOfWeek = firstDayOfWeek + 6; // Get the last day of the week (Saturday)
    
        const firstDate = new Date(today.setDate(firstDayOfWeek));
        const lastDate = new Date(today.setDate(lastDayOfWeek));
    
        return { firstDate, lastDate };
    };

    const loadTasks = () => {
        const tasksContainer = document.getElementById('tasks-container');
        const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
        const { firstDate, lastDate } = getCurrentWeek(); 
        tasksContainer.innerHTML = ''; // Limpiar tareas actuales

        Object.keys(savedTasks).forEach(dateKey => {
            const tasks = savedTasks[dateKey];
            const [year, month, day] = dateKey.split('-').map(Number);
            const taskDate = new Date(year, month - 1, day);

            tasks.forEach((task, index) => {
                const taskElement = document.createElement('div');
                taskElement.textContent = `${dateKey}: ${task}`;
                // Crear botón de eliminar
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => {
                    if (confirm(`Are you sure you want to delete this task: "${task}"?`)) {
                        deleteTask(dateKey, index);
                    }
                };
                
                taskElement.appendChild(deleteButton);

                // Destacar las tareas de la semana actual
                if (taskDate >= firstDate && taskDate <= lastDate) {
                    taskElement.classList.add('week-task');
                    tasksContainer.insertBefore(taskElement, tasksContainer.firstChild); // Insertar al principio
                } else {
                    tasksContainer.appendChild(taskElement);
                }
            });
        });
    };

    const deleteTask = (dateKey, taskIndex) => {
        const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
        savedTasks[dateKey].splice(taskIndex, 1); // Eliminar tarea
        if (savedTasks[dateKey].length === 0) {
            delete savedTasks[dateKey]; // Eliminar la fecha si no hay más tareas

            const [year, month, day] = dateKey.split('-').map(Number);
            const dayElement = document.querySelector(`.days li:not(.inactive):nth-child(${day + new Date(year, month - 1, 1).getDay() + 1})`);
            if (dayElement) {
                dayElement.classList.remove('has-event');
            }
        }
        localStorage.setItem('calendarTasks', JSON.stringify(savedTasks));
        loadTasks(); // Recargar tareas
        disablePastDays();
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            // Ocultar todas las secciones
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });

            // Mostrar la sección correspondiente
            const tabName = event.target.getAttribute('data-tab');
            const tabContent = document.getElementById(tabName);
            tabContent.classList.add('active');
            tabContent.style.display = 'block';

            // Ejecutar acciones específicas para la pestaña "Tasks"
            if (tabName === 'tasks') {
                loadTasks();
            }
        });
    });

    // Asegurarse de que la sección Dashboard se muestre inicialmente
    document.getElementById('dashboard').classList.add('active');
    disablePastDays();
});


