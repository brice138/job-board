function deleteHandler(adId, cardId) {
  let cards = document.querySelector('.cards');
  let card = document.querySelector(`#card${cardId}`);
  let headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (confirm('Are you sure you want to delete your advertisement ?')) {
    fetch(`/offers/destroy/${adId}`, {
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
