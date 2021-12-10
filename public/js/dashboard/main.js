const button = document.querySelector('button');
const description = document.querySelector('.description');

function onClickHandler(row, id) {
  let description = document.getElementsByClassName(`description${row}`)[0];
  if (getComputedStyle(description).display != 'none') {
    description.style.display = 'none';
  } else {
    fetch(`/ad/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(
        (response) => (
          (description.innerHTML = `<p><b>Long description of first job offer</b></p>
          <p>${response.description}</p>
          <p>${response.salary}</p>`),
          (description.style.display = 'block')
        )
      );
  }
}
