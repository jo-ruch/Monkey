function createKey() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/generate');
    xhr.send(null);

    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                console.log(xhr.responseText); // 'This is the returned text.'
                let res = JSON.parse(xhr.responseText);
                document.getElementById('key').innerText = res._id;

            }
        } else {
            console.log('Error: ' + xhr.status); // An error occurred during the request.
        }
    }
}