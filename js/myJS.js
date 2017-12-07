var example   = document.getElementById("example"),
    ctx       = example.getContext('2d'),
    mutexSave = false,
    mutexLoad = false,
    statusBar = document.getElementById('status');
makePicture();

function makePicture() {
    if (mutexSave) {
        statusBar.innerHTML = 'Wait for previous image saving';
        return ;
    }
    mutexLoad = true;
    // ctx.fillRect(0, 0, 640, 640);
    var image = new Image();
    image.crossOrigin="anonymous";
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
        statusBar.innerHTML = 'Loading quote...';
        $.ajax(
            {
                url: "https://api.forismatic.com/api/1.0/?",
                dataType: "jsonp",
                data: "method=getQuote&format=jsonp&lang=en&jsonp=?",
                success: function (response) {
                    writeText(response.quoteText, 500);
                }
            });
        statusBar.innerHTML = 'Image created and ready to be saved';
        mutexLoad = false;
    };
    statusBar.innerHTML = 'Loading picture...';
    image.src = 'https://picsum.photos/640/?image=' + Math.floor(Math.random() * 1000);
}

function writeText(quote, width) {
    ctx.shadowColor = "#000000";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30pt Calibri";
    var words = quote.split(' '),
        line = '',
        lineLength = 0,
        position = 60;
    for (var wordIdx = 0; wordIdx < words.length; wordIdx++) {
        if (lineLength + ctx.measureText(words[wordIdx]).width < width) {
            lineLength += ctx.measureText(words[wordIdx]).width;
            line += words[wordIdx] + ' ';
        } else {
            ctx.fillText(line, 40, position);
            position += 50;
            line = '';
            lineLength = 0;
            wordIdx -= 1;
        }
    }
    ctx.fillText(line, 40, position);
}

function savePicture() {
    if (mutexLoad) {
        statusBar.innerHTML = 'Wait for image creation';
        return ;
    }
    if (mutexSave) {
        statusBar.innerHTML = 'Wait for previous image saving';
        return ;
    }
    mutexSave = true;
    var dataURL = document.getElementById("example").toDataURL("image/png");
    $.ajax({
        type: "POST",
        url: "SaveScript.php",
        data: {
            imgBase64: dataURL
        }}).done(function(o) {
        statusBar.innerHTML = 'Saved, get your link';
        var link = document.getElementById("link");
        link.setAttribute("href", "http://w90064xi.beget.tech/uploaded/" + o + ".png");
        link.innerHTML = "http://w90064xi.beget.tech/uploaded/" + o + ".png";
        mutexSave = false;
    });
}