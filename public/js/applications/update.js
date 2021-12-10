function onSubmitHandler(e, apId) {
  e.preventDefault();
  const form = document.querySelector('form');
  const textArea = form.querySelector('textarea');

  const formData = {};

  formData.message = textArea.value;
  console.log(formData);

  fetch(`/applications/update/${apId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
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
}
