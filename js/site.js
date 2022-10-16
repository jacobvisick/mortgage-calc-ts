function displayMessage() {
    let message = document.getElementById('message').value;

    Swal.fire({
        backdrop: false,
        title: 'The App',
        text: message,
    });
}
