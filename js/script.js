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
    let selectedDay = null;

    const today = new Date();


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

        dayElements.forEach((dayElement) => {
            const day = parseInt(dayElement.textContent);

            if (!day || isNaN(day)) return; 


            const date = new Date(displayedYear, displayedMonth, day);


            if (date < today) {
                dayElement.classList.add('disabled');
                dayElement.style.pointerEvents = 'none'; 
                dayElement.style.color = '#ccc'; 
            }


            const dateKey = `${displayedYear}-${displayedMonth}-${day}`;
            if (savedTasks[dateKey]) {
                dayElement.innerHTML = `<div>${day}</div>`; // Mostrar día
                savedTasks[dateKey].forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.textContent = task;
                    taskElement.classList.add('task');
                    dayElement.appendChild(taskElement);
                });
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
        if (!task) {
            alert('Please enter a task.');
            return;
        }

        const day = parseInt(selectedDay.textContent);
        const { displayedMonth, displayedYear } = getDisplayedMonthAndYear();
        const dateKey = `${displayedYear}-${displayedMonth}-${day}`;

        // Guardar tarea en LocalStorage
        if (!savedTasks[dateKey]) {
            savedTasks[dateKey] = [];
        }
        savedTasks[dateKey].push(task);
        localStorage.setItem('calendarTasks', JSON.stringify(savedTasks));

        // Mostrar tarea en el calendario
        const taskElement = document.createElement('div');
        taskElement.textContent = task;
        taskElement.classList.add('task');
        selectedDay.appendChild(taskElement);
        taskInput.value = ''; // Limpiar input
    });


    const observer = new MutationObserver(() => {
        disablePastDays();
    });

    observer.observe(daysContainer, { childList: true });


    disablePastDays();
});



// Buscando las tareas- no gunciona aún pero tratamos.
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
});


