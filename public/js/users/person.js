const onSubmitHandler = (e) => {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input');
  const gender = form.querySelector('select');
  let formData = {};

  inputs.forEach(({ name, value }) => (formData[name] = value));

  formData['gender'] = gender.value;

  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  fetch('/users/person', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
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

const uploadCV = (e) => {
  e.preventDefault();
  let input = document.querySelector('#cv');
  let formData = new FormData();
  formData.append('cv', input.files[0]);
  fetch('/users/person/cv', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        toastr.success(response.message);
      } else {
        toastr.error(response.err);
      }
    });
};

const uploadPicture = (e) => {
  e.preventDefault();
  let input = document.querySelector('#profilePicture');
  let formData = new FormData();
  formData.append('picture', input.files[0]);
  fetch('/users/person/picture', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        toastr.success(response.message);
      } else {
        toastr.error(response.err);
      }
    });
};

const deleteHandler = () => {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (confirm('Are you sure you want to delete your account ?')) {
    fetch('/users/destroy', {
      method: 'DELETE',
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          toastr.success(response.message);
        } else {
          toastr.error(response.err);
        }
      });
  }
};
