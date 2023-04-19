window.addEventListener('load', function () {
    const form = document.forms[0];
    const inputName = document.querySelector('#inputName');
    const inputLastName = document.querySelector('#inputLastName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const BASE_URL = 'https://todo-api.ctd.academy/v1';

    /* -------------------------------------------------------------------------- */

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const payload = {
            firstName: inputName.value,
            lastName: inputLastName.value,
            email: inputEmail.value,
            password: inputPassword.value
        };

        const settings = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        register(settings);

        form.reset();
    });

    /* -------------------------------------------------------------------------- */
    
    function register(settings) {
        fetch(`${BASE_URL}/users`, settings)
            .then(res => {
                if(!res.ok){ return console.log('Failed to create user')}
                return res.json()

            })
            .then(data => {
                if (data.jwt) {
                    localStorage.setItem('jwt', JSON.stringify(data.jwt));
                    location.replace('./tasks.html');
                }

            }).catch(err => {console.log(err);})
    };
})