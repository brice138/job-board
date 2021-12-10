const onSubmitHandler = (e) => {
  e.preventDefault();
  fetch('/users/login', {
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
          window.location = '/';
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
};
