let peopleForm = document.querySelector('#peopleForm');
let peopleModal = document.querySelector('#peopleModal');
let companiesModal = document.querySelector('#companiesModal');
let companiesForm = document.querySelector('#companiesForm');
let advertisementsModal = document.querySelector('#advertisementsModal');
let advertisementsForm = document.querySelector('#advertisementsForm');
let appliedModal = document.querySelector('#appliedModal');
let appliedForm = document.querySelector('#appliedForm');

function showFormAddPerson() {
  peopleModal.style.display = 'block';
  peopleForm.addEventListener('submit', function (e) {
    e.preventDefault();
    createPerson();
  });
}

function createPerson() {
  let formData = new FormData();
  const inputs = peopleForm.querySelectorAll('input:not([type="submit"])');
  const cv = peopleForm.querySelector('#cv');
  const picture = peopleForm.querySelector('#profilePicture');
  const gender = peopleForm.querySelector('select');

  inputs.forEach(({ name, value }) => formData.append(name, value));
  formData.append('cv', cv.files[0]);
  formData.append('picture', picture.files[0]);
  formData.append('gender', gender.value);

  fetch('admin/person/create', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        peopleForm.reset();
        peopleModal.style.display = 'none';
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function deleteUser(id) {
  if (confirm('Are you sure you want to delete this users ?')) {
    fetch(`admin/person/destroy/${id}`, {
      method: 'DELETE',
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
  }
}

function showFormUpdatePerson(id, rowNumber) {
  let tr = document.querySelector(`#peopleRow${rowNumber}`);
  let values = tr.querySelectorAll('td');
  peopleForm.email.value = values[1].innerText;
  peopleForm.phone.value = values[2].innerText;
  peopleForm.lastName.value = values[3].innerText;
  peopleForm.firstName.value = values[4].innerText;
  peopleForm.address.value = values[5].innerText;
  peopleForm.postalCode.value = values[6].innerText;
  peopleForm.birthDate.value = values[7].innerText;
  peopleForm.website.value = values[9].innerText;
  console.log(values[11].innerText);
  if (values[11].innerText == 'male') {
    peopleForm.gender[0].selected = true;
  } else if (values[11].innerText == 'female') {
    peopleForm.gender[1].selected = true;
  } else {
    peopleForm[2].selected = true;
  }
  peopleModal.style.display = 'block';
  peopleForm.addEventListener('submit', function (e) {
    e.preventDefault();
    updateUser(id);
  });
}

function updateUser(id) {
  let formData = new FormData();
  const inputs = peopleForm.querySelectorAll('input:not([type="submit"])');
  const cv = peopleForm.querySelector('#cv');
  const picture = peopleForm.querySelector('#profilePicture');
  const gender = peopleForm.querySelector('select');

  inputs.forEach(({ name, value }) => formData.append(name, value));
  formData.append('cv', cv.files[0]);
  formData.append('picture', picture.files[0]);
  formData.append('gender', gender.value);
  fetch(`admin/person/update/${id}`, {
    method: 'PUT',
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        console.log(response.message);
        peopleForm.reset();
        peopleModal.style.display = 'none';
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function showFormAddCompany() {
  companiesModal.style.display = 'block';
  companiesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    createCompany();
  });
}

function createCompany() {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const inputs = companiesForm.querySelectorAll('input:not([type="submit"])');
  let formData = {};
  inputs.forEach(({ name, value }) => (formData[name] = value));
  fetch('admin/company/create', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        console.log(response.message);
        companiesForm.reset();
        companiesModal.style.display = 'none';
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function deleteCompany(id) {
  if (confirm('Are you sure you want to delete this company ?')) {
    fetch(`admin/company/destroy/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          console.log(response.message);
          toastr.success(response.message);
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        } else {
          toastr.error(response.err);
        }
      });
  }
}

function showFormUpdateCompany(id, rowNumber) {
  let tr = document.querySelector(`#companiesRow${rowNumber}`);
  let values = tr.querySelectorAll('td');
  companiesForm.email.value = values[1].innerText;
  companiesForm.phone.value = values[2].innerText;
  companiesForm.companyName.value = values[3].innerText;
  companiesForm.activities.value = values[4].innerText;
  companiesForm.city.value = values[5].innerText;
  companiesForm.postalCode.value = values[6].innerText;
  companiesForm.numberEmployees.value = values[7].innerText;
  companiesForm.contactName.value = values[8].innerText;
  companiesForm.website.value = values[9].innerText;
  companiesForm.siret.value = values[10].innerText;

  companiesModal.style.display = 'block';
  companiesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    updateCompany(id);
  });
}

function updateCompany(id) {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const inputs = companiesForm.querySelectorAll('input:not([type="submit"])');
  let formData = {};
  inputs.forEach(({ name, value }) => (formData[name] = value));

  fetch(`admin/company/update/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        companiesForm.reset();
        console.log(response.message);
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function showFormAddAdvertisement() {
  advertisementsModal.style.display = 'block';
  advertisementsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    createAdvertisement();
  });
}

function createAdvertisement() {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  let formData = {};
  const inputs = advertisementsForm.querySelectorAll(
    'input:not([type="submit"])'
  );
  const isVisible = document.querySelector('input[type=checkbox]').checked;
  const textArea = advertisementsForm.querySelector('textarea');
  inputs.forEach(({ name, value }) => (formData[name] = value));
  formData.isVisible = isVisible;
  formData.description = textArea.value;

  fetch('admin/offers/create', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        companiesForm.reset();
        console.log(response.message);
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function deleteAdvertisement(id) {
  if (confirm('Are you sure you want to delete this advertisement ?')) {
    fetch(`admin/offers/destroy/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          console.log(response.message);
          toastr.success(response.message);
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        } else {
          toastr.error(response.err);
        }
      });
  }
}

function showFormUpdateAdvertisement(id, rowNumber) {
  let tr = document.querySelector(`#advertisementsRow${rowNumber}`);
  let values = tr.querySelectorAll('td');
  advertisementsForm.title.value = values[1].innerText;
  advertisementsForm.description.value = values[2].innerText;
  if (values[4].innerText == '1') {
    advertisementsForm.isVisible.checked = true;
  } else {
    advertisementsForm.isVisible.checked = false;
  }
  advertisementsForm.companyId.value = values[5].innerText;
  advertisementsForm.contractType.value = values[6].innerText;

  advertisementsModal.style.display = 'block';
  advertisementsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    updateAdvertisment(id);
  });
}

function updateAdvertisment(id) {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  let formData = {};
  const inputs = advertisementsForm.querySelectorAll(
    'input:not([type="submit"])'
  );
  const isVisible = document.querySelector('input[type=checkbox]').checked;
  const textArea = advertisementsForm.querySelector('textarea');
  inputs.forEach(({ name, value }) => (formData[name] = value));
  formData.isVisible = isVisible;
  formData.description = textArea.value;

  fetch(`admin/offers/update/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        console.log(response.message);
        peopleForm.reset();
        peopleModal.style.display = 'none';
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function showFormAddApplication() {
  appliedModal.style.display = 'block';
  appliedForm.addEventListener('submit', function (e) {
    e.preventDefault();
    createApplication();
  });
}

function createApplication() {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  let formData = {};
  const inputs = appliedForm.querySelectorAll('input:not([type="submit"])');
  const textArea = appliedForm.querySelector('textarea');
  inputs.forEach(({ name, value }) => (formData[name] = value));
  formData.message = textArea.value;

  fetch('/admin/applications/create', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        companiesForm.reset();
        console.log(response.message);
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function showFormUpdateApplication(id, rowNumber) {
  let tr = document.querySelector(`#appliedRow${rowNumber}`);
  let values = tr.querySelectorAll('td');

  appliedForm.advertisementId.value = values[1].innerText;
  appliedForm.personId.value = values[2].innerText;
  appliedForm.message.value = values[3].innerText;
  appliedModal.style.display = 'block';
  appliedForm.addEventListener('submit', function (e) {
    e.preventDefault();
    updateApplication(id);
  });
}

function updateApplication(id) {
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  let formData = {};
  const inputs = appliedForm.querySelectorAll('input:not([type="submit"])');
  const textArea = appliedForm.querySelector('textarea');
  inputs.forEach(({ name, value }) => (formData[name] = value));
  formData.message = textArea.value;
  fetch(`/admin/applications/update/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        appliedForm.reset();
        console.log(response.message);
        toastr.success(response.message);
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      } else {
        toastr.error(response.err);
      }
    });
}

function deleteApplication(id) {
  if (confirm('Are you sure you want to delete this application ?')) {
    fetch(`admin/applications/destroy/${id}`, {
      method: 'DELETE',
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
  }
}
