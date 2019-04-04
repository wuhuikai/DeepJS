var fileReader = new FileReader();
var image;
var input_data;
var width, height;
fileReader.onload = function(event) {
    $('#load_input').attr('hidden', false);
    $('#input').attr('hidden', true);
    $('#output').attr('hidden', true);
    image = new Image();
    image.onload = function() {
        width = image.width;
        height = image.height;

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var ratio = Math.max(1.0, Math.max(image.width, image.height) / 1024);
        canvas.width = image.width / ratio;
        canvas.height = image.height / ratio;
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        input_data = {'type':  'B',
                      'image': canvas.toDataURL('image/jpeg', 1.0)};
        $('#load_input').attr('hidden', true);
        $('#input').attr('src', image.src).attr('hidden', false);
    };
    image.src = event.target.result;
};
function upload(input) {
    if (input.files && input.files[0]) {
        fileReader.readAsDataURL(input.files[0]);
    }
}

function process() {
    $('#load_output').attr('hidden', false);
    $('#output').attr('hidden', true);
    Algorithmia.client("simYwF1W5IInfoMltCgjwEPem5G1")
       .algo("algo://wuhuikai/A2RL_online/0.3.2")
       .pipe(input_data)
       .then(function(output) {
            var left = output.result[0][0]*width, top = output.result[0][1]*height,
            right = output.result[0][2]*width, bottom = output.result[0][3]*height;
            var canvas_width = right - left, canvas_height = bottom - top;
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = canvas_width; canvas.height = canvas_height;
            context.drawImage(image, left, top, canvas_width, canvas_height, 0, 0, canvas_width, canvas_height);
            $('#load_output').attr('hidden', true);
            $('#output').attr('hidden', false).attr('src', canvas.toDataURL());
       });
}
