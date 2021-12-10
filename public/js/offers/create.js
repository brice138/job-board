function onClickHandler() {
  console.log(1);
}

function onSubmitHandler(e) {
  e.preventDefault();
  const form = document.querySelector('form');
  const inputs = form.querySelectorAll('input');
  const textArea = form.querySelector('textarea');
  const isVisible = document.querySelector('input[type=checkbox]').checked;
  const formData = {};
  inputs.forEach(({ name, value }) => (formData[name] = value));
  formData.isVisible = isVisible;
  formData.description = textArea.value;

  fetch('/offers/create', {
    method: 'POST',
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
          window.location = '/offers';
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}
