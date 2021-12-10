let accountType = 'candidate';

function onSubmitHandler(e) {
  e.preventDefault();
  registerRequest(accountType, e);
}

function registerRequest(accountType, e) {
  fetch(`/users/register/${accountType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: e.target.email.value,
      password: e.target.password.value,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        toastr.success(response.message);
        setTimeout(function () {
          window.location = '/users/login';
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}
