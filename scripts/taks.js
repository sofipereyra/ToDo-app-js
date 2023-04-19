// SEGURITY

if (!localStorage.jwt) {
  location.replace('./index.html')
}

/* ----------------------------------------------------------------------- */

window.addEventListener('load', function () {

  const urlTasks = 'https://todo-api.ctd.academy/v1/tasks';
  const urlUser = 'https://todo-api.ctd.academy/v1/users/getMe';
  const token = JSON.parse(localStorage.jwt);
  const userName = document.querySelector(".user-name")

  const formCreateTask = document.querySelector('.new-task');
  const newTask = document.querySelector('#newTask');
  const btnLogout = document.querySelector('#closeApp');

  getUSerName();
  consultTasks();


  /* -------------------------------------------------------------------------- */
  /*                                  Logout                                    */
  /* -------------------------------------------------------------------------- */

  btnLogout.addEventListener('click', function () {
    const cerrarSesion = confirm('Are you sure?')
    if (cerrarSesion) {
      localStorage.clear()
      location.replace('./index.html')
    }
  });

  /* -------------------------------------------------------------------------- */

  function getUSerName() {
    const settings = {
      method: 'GET',
      headers: {
        authorization: token
      }
    }

    fetch(urlUser, settings)
      .then(res => res.json())
      .then(data => {
        userName.innerHTML = data.firstName
      })
      .catch(e => console.log(e))

  };


  /* -------------------------------------------------------------------------- */

  function consultTasks() {
    const settings = {
      method: "GET",
      headers: {
        authorization: token
      }
    };

    fetch(urlTasks, settings)
      .then(response => response.json())
      .then(tasks => {
        renderTasks(tasks)
        buttonChangeState()
        buttonDeleteTask()
      })
      .catch(error => console.log(error));
  };


  /* -------------------------------------------------------------------------- */

  formCreateTask.addEventListener('submit', function (event) {
    event.preventDefault();

    console.log(newTask.value);

    const payload = {
      description: newTask.value
    };
    const settings = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      }
    }

    fetch(urlTasks, settings)
      .then(response => response.json())
      .then(task => {
        consultTasks();
      })
      .catch(error => console.log(error));

    formCreateTask.reset();
  })

  /* -------------------------------------------------------------------------- */

  function renderTasks(tasks) {
    const pendingTasks = document.querySelector('.pending-tasks');
    const completedTasks = document.querySelector('.completed-tasks');
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const finishedAmount = document.querySelector('#finished-amount');
    let counter = 0;
    finishedAmount.innerText = counter;

    tasks.forEach(task => {
      let date = new Date(task.createdAt);

      if (task.completed) {
        counter++;
        completedTasks.innerHTML += `
          <li class="task" data-aos="flip-up">
            <div class="done">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="description">
              <p class="name">${task.description}</p>
              <div class="change-state">
                <button class="change incompleted" id="${task.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="delete" id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
                        `
      } else {
        pendingTasks.innerHTML += `
          <li class="task" data-aos="flip-up">
            <button class="change" id="${task.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="description">
              <p class="name">${task.description}</p>
              <p class="timestamp">${date.toLocaleDateString()}</p>
            </div>
          </li>
                        `
      }
      finishedAmount.innerText = counter;
    })

  };

  /* -------------------------------------------------------------------------- */

  function buttonChangeState() {

    const btnChangeState = document.querySelectorAll('.change');

    btnChangeState.forEach(btn => {
      btn.addEventListener('click', function (event) {
        const id = event.target.id;
        const url = `${urlTasks}/${id}`
        const payload = {};

        if (event.target.classList.contains('incompleted')) {
          payload.completed = false;
        } else {
          payload.completed = true;
        }

        const settingsChange = {
          method: 'PUT',
          headers: {
            "Authorization": token,
            "Content-type": "application/json"
          },
          body: JSON.stringify(payload)
        }
        fetch(url, settingsChange)
          .then(response => {
            consultTasks();
          })
      })
    });



  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function buttonDeleteTask() {

    const btnDelete = document.querySelectorAll(".delete");

    btnDelete.forEach(btn => {
      // Asignar a cada boton un listener para poder capturar el id de la tarea la cual clickeo 
      btn.addEventListener("click", (event) => {
        console.log("Eliminando tarea...");
        console.log(event.target);
        console.log(event.target.id);
        const id = event.target.id;
        const uriTaskId = `${urlTasks}/${id}`

        const settings = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: token
          }
        }
        fetch(uriTaskId, settings)
          .then(response => {
            console.log(response.status);
            consultTasks()
          })
          .catch(err => console.log(err))
      })
    })
  }
});