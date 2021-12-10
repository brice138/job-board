function deleteHandler(apID, cardID) {
  let cards = document.querySelector('.cards');
  let card = document.querySelector(`#card${cardID}`);
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (confirm('Are you sure you want to delete your application ?')) {
    fetch(`/applications/destroy/${apID}`, {
      method: 'DELETE',
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          cards.removeChild(card);
          toastr.success(response.message);
        } else {
          toastr.error(response.err);
        }
      });
  }
}
