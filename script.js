document.addEventListener('DOMContentLoaded', function () {
    const listaTareas = document.getElementById('listaTareas');
    const formularioTarea = document.getElementById('formularioTarea');
    const limpiarCompletadasBoton = document.getElementById('limpiarCompletadas');

    function actualizarBarraProgreso() {
        const fechaActual = new Date();
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        const totalDias = tareas.length;
        const barraProgreso = document.getElementById('barraProgreso');
        barraProgreso.innerHTML = '';

        for (let i = 0; i < totalDias; i++) {
            const celda = document.createElement('div');
            celda.classList.add('celda-progreso');

            if (tareas[i].completada) {
                celda.style.backgroundColor = '#4CAF50'; // Verde (si está completada)
            } else {
                const fechaTarea = new Date(tareas[i].fecha);
                const diferenciaEnMinutos = (fechaActual - fechaTarea) / (1000 * 60);

                if (diferenciaEnMinutos <= 0) {
                    celda.style.backgroundColor = '#FFC107'; // Amarillo (si está a tiempo)
                } else {
                    celda.style.backgroundColor = '#FF5733'; // Rojo (si no está a tiempo)
                }
            }

            barraProgreso.appendChild(celda);
        }
    }

    function renderizarTareas() {
        listaTareas.innerHTML = '';

        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        tareas.forEach((tarea, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('tarea');

            const checkTarea = document.createElement('input');
            checkTarea.type = 'checkbox';
            checkTarea.checked = tarea.completada;
            checkTarea.classList.add('check');
            checkTarea.addEventListener('change', () => {
                tarea.completada = !tarea.completada;
                localStorage.setItem('tareas', JSON.stringify(tareas));
                renderizarTareas();
                actualizarBarraProgreso();
            });

            const detallesTarea = document.createElement('span');
            detallesTarea.textContent = `${tarea.titulo} - ${tarea.fecha} ${tarea.alarma ? `(${tarea.alarma})` : ''}`;
            detallesTarea.addEventListener('click', () => {
                alert(`Detalles de la tarea:\n${tarea.titulo}\nFecha: ${tarea.fecha}\nAlarma: ${tarea.alarma}`);
            });

            const prioridadSelector = document.createElement('select');
            prioridadSelector.classList.add('prioridad-selector');
            ['Baja', 'Media', 'Alta'].forEach(opcion => {
                const option = document.createElement('option');
                option.value = opcion.toLowerCase();
                option.text = opcion;
                prioridadSelector.add(option);
            });
            prioridadSelector.value = tarea.prioridad || 'media';
            prioridadSelector.addEventListener('change', () => {
                tarea.prioridad = prioridadSelector.value;
                localStorage.setItem('tareas', JSON.stringify(tareas));
            });

            listItem.appendChild(checkTarea);
            listItem.appendChild(detallesTarea);
            listItem.appendChild(prioridadSelector);
            listaTareas.appendChild(listItem);

            // Estilo adicional para las tareas de lista
            if (tarea.lista) {
                listItem.classList.add('tarea-lista');
            }
        });

        actualizarBarraProgreso();
    }

    function limpiarTareasCompletadas() {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        const tareasActualizadas = tareas.filter(tarea => !tarea.completada);
        localStorage.setItem('tareas', JSON.stringify(tareasActualizadas));
        renderizarTareas();
        actualizarBarraProgreso();
    }

    function establecerAlarma(horaAlarma, tarea) {
        const ahora = new Date();
        const fechaAlarma = new Date(ahora.toDateString() + ' ' + horaAlarma);
        const tiempoHastaAlarma = fechaAlarma - ahora;

        if (tiempoHastaAlarma > 0) {
            setTimeout(() => {
                alert(`¡Alarma para la tarea ${tarea.titulo}!`);
                mostrarNotificacion('Tarea pendiente', `¡Es hora de realizar la tarea "${tarea.titulo}"!`);
            }, tiempoHastaAlarma);
        }
    }

    function mostrarNotificacion(titulo, mensaje) {
        if ('Notification' in window) {
            Notification.requestPermission().then(function (permiso) {
                if (permiso === 'granted') {
                    new Notification(titulo, { body: mensaje });
                }
            });
        }
    }

    formularioTarea.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const titulo = evento.target.elements.titulo.value;
        const alarma = evento.target.elements.alarma.value;
        const repetirDiariamente = evento.target.elements.repetirDiariamente.checked;
        const prioridad = evento.target.elements.prioridad.value;

        if (titulo) {
            const fechaActual = new Date();
            const nuevaTarea = {
                titulo,
                fecha: fechaActual.toISOString().split('T')[0],
                alarma: alarma || null,
                repetirDiariamente,
                completada: false,
                prioridad,
                lista: false
            };

            const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
            tareas.push(nuevaTarea);
            localStorage.setItem('tareas', JSON.stringify(tareas));

            renderizarTareas();

            if (alarma) {
                establecerAlarma(alarma, nuevaTarea);
            }

            evento.target.reset();
        } else {
            alert('Por favor, ingresa el título de la tarea.');
        }
    });

    limpiarCompletadasBoton.addEventListener('click', limpiarTareasCompletadas);

    renderizarTareas();
});
