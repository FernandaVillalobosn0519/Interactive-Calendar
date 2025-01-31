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

//---------------Inicialización de variables de fecha
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

    let liTag = "";
    const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {}; // Cargar tareas guardadas

    // Días del mes anterior
    for (let i = firstDayofMonth; i > 0; i--) {
        const day = lastDateofLastMonth - i + 1;
        const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        liTag += `<li class="inactive ${savedTasks[dateKey] ? 'has-event' : ''}">${day}</li>`;
    }

    // Días del mes actual
    for (let i = 1; i <= lastDateofMonth; i++) {
        const isToday = i === date.getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? "active" : "";
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        liTag += `<li class="${isToday} ${savedTasks[dateKey] ? 'has-event' : ''}">${i}</li>`;
    }

    // Días del mes siguiente
    for (let i = lastDayofMonth; i < 6; i++) {
        const day = i - lastDayofMonth + 1;
        const dateKey = `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        liTag += `<li class="inactive ${savedTasks[dateKey] ? 'has-event' : ''}">${day}</li>`;
    }

    currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
    daysTag.innerHTML = liTag;
};

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    
        dayElements.forEach((dayElement) => {
            const day = parseInt(dayElement.textContent);
            if (!day || isNaN(day)) return; 
    
            const isInactive = dayElement.classList.contains('inactive');
            let date;
    
            if (isInactive && day > 15) { 
                date = new Date(displayedYear, displayedMonth - 1, day);
            } else if (isInactive && day <= 15) { 
                date = new Date(displayedYear, displayedMonth + 1, day);
            } else { 
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
                dayElement.style.color = '';
            }

             // Deshabilitar los días fuera del mes actual
             const isNextMonth = date.getMonth() !== displayedMonth;
             if (isNextMonth) {
                 dayElement.classList.add('disabled');
                 dayElement.style.pointerEvents = 'none';
                 dayElement.style.color = '#ccc';
             }
 
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (savedTasks[dateKey]) {
                dayElement.classList.add('has-event');
            } else {
                dayElement.classList.remove('has-event'); // Quitar la clase si no hay eventos
            }
        });
    };
    
    // selecciona día del calendario
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
        const formattedMonth = String(displayedMonth + 1).padStart(2, '0');
        const dateKey = `${displayedYear}-${formattedMonth}-${String(day).padStart(2, '0')}`;
    
        const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
        if (!savedTasks[dateKey]) {
            savedTasks[dateKey] = [];
        }
        savedTasks[dateKey].push(`${task} at ${eventTime} - ${eventDescription}`);
        localStorage.setItem('calendarTasks', JSON.stringify(savedTasks));
    
        // renderiza el calendario para reflejar los cambios.
        renderCalendar();
        disablePastDays();
    
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

//---------------Añadimos los feriados--------------------
const getHolidays = async () => {
    const apiKey = 'gxtebsMEUnth8jqb7t6ZcsApKxo2L5G9'; // codigo API 
    const country = 'PE';
    const year = 2025;

    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        const data = await response.json();

        if (data.response && data.response.holidays) {
            // Convertir las fechas y retornar los feriados
            return data.response.holidays.map(holiday => ({
                date: new Date(holiday.date.iso), // Convertir a objeto Date
                name: holiday.name
            }));
        } else {
            throw new Error('Formato de respuesta inesperado');
        }
    } catch (error) {
        console.error('Error al obtener los días festivos:', error);
        return [];
    }
};

// Función para obtener el mes y año locales de una fecha usando ISO para evitar modificaciones de zona horaria
const getLocalMonthYear = (date) => {
    const isoDate = date.toISOString().split('T')[0]; //AAAA-MM-DD
    const [year, month] = isoDate.split('-');
    return `${year}-${month}`;
};

// Función para agrupar los feriados por mes
const groupHolidaysByMonth = (holidays) => {
    return holidays.reduce((acc, holiday) => {
        const monthYear = getLocalMonthYear(holiday.date); // Usar mes y año locales
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(holiday);
        return acc;
    }, {});
};

// Función para convertir el formato "AAAA-MM" a "mes de AAAA"
const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1, 1); // Asegurarse de que la fecha sea el primer día del mes
    return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
};

// Evento DOMContentLoaded para cargar los feriados en la pestaña "Holidays"
document.addEventListener('DOMContentLoaded', async () => {
    const holidaysContainer = document.getElementById('holidays-list');

    if (!holidaysContainer) {
        console.error('El contenedor de feriados no existe en el DOM.');
        return;
    }

    // Obtener y procesar los feriados
    const holidays = await getHolidays();
    const groupedHolidays = groupHolidaysByMonth(holidays);

    // Ordenar los meses
    const sortedMonths = Object.keys(groupedHolidays).sort();

    // Mostrar los feriados agrupados por mes
    sortedMonths.forEach(monthYear => {
        const monthElement = document.createElement('h2');
        monthElement.textContent = formatMonthYear(monthYear); // Formatear como "mes de AAAA"
        holidaysContainer.appendChild(monthElement);

        const ulElement = document.createElement('ul');
        groupedHolidays[monthYear].forEach(holiday => {
            const holidayElement = document.createElement('li');
            holidayElement.textContent = `${holiday.date.toISOString().split('T')[0]} - ${holiday.name}`;
            ulElement.appendChild(holidayElement);
        });

        holidaysContainer.appendChild(ulElement);
    });
});

//------------------------Para que quede seleccionada la opcion del Sidebar
const sidebarItems = document.querySelectorAll('.sidebar li');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Elimina la clase 'active' de todos los elementos
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
// Función para obtener el rango de fechas de una semana dada
const getWeekRange = (referenceDate = new Date()) => {
    const dayOfWeek = referenceDate.getDay();
    const firstDayOfWeek = referenceDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Ajustar si la semana comienza el lunes
    const lastDayOfWeek = firstDayOfWeek + 6;

    const firstDate = new Date(referenceDate);
    firstDate.setDate(firstDayOfWeek);
    const lastDate = new Date(referenceDate);
    lastDate.setDate(lastDayOfWeek);

    firstDate.setHours(0, 0, 0, 0);
    lastDate.setHours(23, 59, 59, 999);

    return { firstDate, lastDate };
};

const updateWeekHeader = (startDate, endDate) => {
    const weekHeader = document.getElementById('week-header');
    weekHeader.textContent = `${startDate.toDateString()} - ${endDate.toDateString()}`;
};

let currentWeekStartDate = new Date(); // Inicialmente la semana actual
currentWeekStartDate.setDate(currentWeekStartDate.getDate() - currentWeekStartDate.getDay() + 1); // Ajustar al inicio de la semana

const loadTasksForCurrentWeek = () => {
    const tasksContainer = document.getElementById('tasks-container');
    const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    const { firstDate, lastDate } = getWeekRange(currentWeekStartDate);

    tasksContainer.innerHTML = ''; // Limpiar tareas actuales

    const dateKeys = Object.keys(savedTasks).filter(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        const taskDate = new Date(year, month - 1, day);
        return taskDate >= firstDate && taskDate <= lastDate;
    }).sort((a, b) => new Date(a) - new Date(b)); // Ordenar fechas de la más próxima a la más lejana

    dateKeys.forEach(dateKey => {
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
            tasksContainer.appendChild(taskElement);
        });
    });

    updateWeekHeader(firstDate, lastDate);
};

// Asignar eventos a los botones de navegación de semanas
document.addEventListener('DOMContentLoaded', () => {
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');

    prevWeekButton.addEventListener('click', () => {
        const prevDate = new Date(currentWeekStartDate);
        prevDate.setDate(prevDate.getDate() - 7); // Ir a la semana anterior
        currentWeekStartDate = prevDate;
        loadTasksForCurrentWeek();
    });

    nextWeekButton.addEventListener('click', () => {
        const nextDate = new Date(currentWeekStartDate);
        nextDate.setDate(nextDate.getDate() + 7); // Ir a la siguiente semana
        currentWeekStartDate = nextDate;
        loadTasksForCurrentWeek();
    });

    const tabs = document.querySelectorAll('.sidebar .tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            tabContents.forEach(content => content.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');

            const tabName = event.target.getAttribute('data-tab');
            const tabContent = document.getElementById(tabName);
            tabContent.classList.add('active');
            tabContent.style.display = 'block';

            if (tabName === 'tasks') {
                loadTasksForCurrentWeek();
            }
        });
    });

    // Mostrar tareas de la semana actual al cargar la página
    loadTasksForCurrentWeek();
});

const deleteTask = (dateKey, taskIndex) => {
    const savedTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    savedTasks[dateKey].splice(taskIndex, 1); // Eliminar tarea

    // Si no quedan tareas para esa fecha, eliminarla del objeto y actualizar el calendario
    if (savedTasks[dateKey].length === 0) {
        delete savedTasks[dateKey]; // Eliminar la fecha del objeto
        
        // Actualizar visualmente el día en el calendario
        const [year, month, day] = dateKey.split('-').map(Number);
        const dayElements = document.querySelectorAll('.days li');

        dayElements.forEach(dayElement => {
            if (!dayElement.classList.contains('inactive') && parseInt(dayElement.textContent) === day) {
                dayElement.classList.remove('has-event'); // Quitar subrayado
            }
        });
    }

    // Guardar los cambios en localStorage y recargar las tareas
    localStorage.setItem('calendarTasks', JSON.stringify(savedTasks));
    loadTasksForCurrentWeek(); // Recargar tareas visibles en la pestaña de tareas
    disablePastDays(); // Actualizar las clases de los días en el calendario
};
