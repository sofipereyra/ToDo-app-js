window.addEventListener('load', function () {
   const form = document.querySelector('form');
   const email = document.querySelector('#inputEmail');
   const pass = document.querySelector('#inputPassword');
   const BASE_URL = 'https://todo-api.ctd.academy/v1';
    

    /* -------------------------------------------------------------------------- */

    form.addEventListener('submit', (e) => {
       e.preventDefault();

        const payload = {
            email: email.value,
            password: pass.value
        }

        const settings = { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }

        login(settings);
        form.reset();
    });

    /* -------------------------------------------------------------------------- */

    function login(settings) {

        fetch(`${BASE_URL}/users/login`, settings)
            .then(res => {
                if(!res.ok) {throw new Error('Invalid data')}
                return res.json()
            })
            .then(data => {
                if(data.jwt){
                    localStorage.setItem('jwt', JSON.stringify(data.jwt));
                    location.replace('./tasks.html');
                }
            })
            .catch(error => console.log(error.message))
    };
});