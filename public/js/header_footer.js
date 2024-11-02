fetch('/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('top').insertAdjacentHTML('afterbegin', data);  // Insert navbar at the top of the body
  });
