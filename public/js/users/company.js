const onSubmitHandler = (e) => {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input');
  let formData = {};

  inputs.forEach(({ name, value }) => (formData[name] = value));

  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  fetch('/users/company', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        toastr.success(response.message);
        setTimeout(function () {
          window.location = '/users/company';
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
};

const onClickHandler = () => {
  let form = document.querySelector('#userAccountForm');
  let infoDisplay = document.querySelector('.infoDisplay');

  form.style.display = 'block';
  infoDisplay.style.display = 'none';
};

const deleteHandler = () => {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (confirm('Are you you want to delete your account ?')) {
    fetch('/users/destroy', {
      method: 'DELETE',
      headers: headers,
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
  }
};
