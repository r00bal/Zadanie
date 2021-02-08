import { route } from './router';



route('/', 'home', function() {
  function displayErrorMessage(element,message) {
    element.classList.add('js-active');
    element.innerHTML = message;
  }

  this.$on('.form', 'submit', (ev) => { 
    ev.preventDefault();
    const username = ev.target.querySelector('#login').value;
    const password = ev.target.querySelector('#password').value;
    const errorMessage = ev.target.querySelector('#error-message');

    if (errorMessage.classList.contains('js-active')) {
      errorMessage.classList.remove('js-active');
    }
    
    const url = 'https://zwzt-zadanie.netlify.app/api/login';


    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
    .then((res) => {
      if (res.status >= 400) {
        return res.json().then(error => {
          console.log(error);
          const newError = new Error('Something went wrong!');
          newError.data = error;
          throw error;
        })
      }
     return res.json()
    })
    .then((data) => {
      if (data.token) {
        console.log('success')
        sessionStorage.setItem('loginToken', data.token);
        window.location = '#/success';
      }
    
    })
    .catch((err) =>{ 
    if (err.error) {
      displayErrorMessage(errorMessage, err.message);
    } else {
      displayErrorMessage(errorMessage, "Something went wrong...");
    }
    });
  
  
  });
});

route('/success', 'success', function() {
 
  const token = sessionStorage.getItem('loginToken');

  this.title = token ? 'Login Success!' : "Something went wrong, please try again";
});


route('*', '404', function () {});
