function onSubmitHandler(e, id, isLogged) {
  console.log(id);
  console.log(typeof isLogged);
  e.preventDefault();
  const form = e.target;
  const textArea = document.querySelector('textarea');

  if (isLogged === 'true') {
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
    let formData = {};
    formData['message'] = textArea.value;
    fetch(`/applications/create/auth/${id}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          toastr.success(response.message);
          setTimeout(function () {
            window.location = '/applications';
          }, 1500);
        } else {
          toastr.error(response.err);
        }
      });
  } else {
    let formData = new FormData();
    const inputs = form.querySelectorAll('input');
    const gender = form.querySelector('select');
    const cv = document.querySelector('#cv');
    inputs.forEach(({ name, value }) => formData.append(name, value));
    formData.append('gender', gender.value);
    formData.append('cv', cv.files[0]);
    console.log(formData);
    fetch(`/applications/create/${id}`, {
      method: 'POST',
      body: formData,
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
}
