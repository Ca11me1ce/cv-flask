var socket = io.connect('http://' + document.domain + ':' + location.port, { 'reconnect': true });
window.onload = function(){
    addLogs("==> The toolkit is standby!")
    socket.on('connect', function(){
        console.log("start connecting")
        
    });
}

socket.on('image', function(data){
    console.log("get image")
    j = JSON.parse(data)
    if(j["msg"]){
        document.getElementById("show_image1").innerHTML = "<img src='../static/images/image.png' width='350' class='img-thumbnail'/>"
        document.getElementById("show_image2").innerHTML = "<img src='../static/images/image.png' width='350' class='img-thumbnail'/>"
    }
})

socket.on('process', function(data){
    j = JSON.parse(data)
    if(j["msg"]){
        document.getElementById("show_image2").innerHTML = "<img src='../static/images/image1.png' width='350' class='img-thumbnail'/>"
    }
})

function upload(){
    document.getElementById("upload_image").click();
    console.log("upload image");
}

function uploadImage(event){
    console.log("start upload")
    var file = event.target.files[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
        var arrayBuffer = fileReader.result; 
         data = {"image": arrayBuffer};
         socket.emit("image", JSON.stringify(data))
     }
}

function clear_panel(){
    console.log("clear panel");
    document.getElementById("show_image1").innerHTML = "<img src='../static/images/bg.png' style='width: 350px; padding-bottom: 80px; padding-top: 80px;' class='img-thumbnail'/>"
    document.getElementById("show_image2").innerHTML = "<img src='../static/images/bg.png' style='width: 350px; padding-bottom: 80px; padding-top: 80px;' class='img-thumbnail'/>"
}

function reset(){
    clear_panel()

    document.getElementById("show_image1").innerHTML = "<img src='../static/images/image.png' width='350' class='img-thumbnail'/>"
    document.getElementById("show_image2").innerHTML = "<img src='../static/images/image.png' width='350' class='img-thumbnail'/>"

}

function displayMode(op){
    console.log("display mode")
    if(op === 1){
        console.log("negative")
        socket.emit("process", JSON.stringify({"op": op}))
    }

    else if(op === 2){
        console.log("intensity")
        // intensity level 1-7
        check = document.getElementById("intensity").checked
        if(check){
            intensity = document.getElementById("intensity_level").value
            socket.emit("process", JSON.stringify({"op": op, "intensity": intensity}))
        }

    }
    else if(op === 3){
        console.log("constrast")
        socket.emit("process", JSON.stringify({"op": op}))
    }
    else if(op === 5){
        console.log("power")
        // intensity level 1-7
        check = document.getElementById("power").checked
        if(check){
            power = document.getElementById("power_value").value
            socket.emit("process", JSON.stringify({"op": op, "power": power}))
        }
    }

    else {
        console.log("error")
    }
}

function displayIntnsity(){
    intensity_level = document.getElementById("intensity_level").value;
    document.getElementById("display_intensity").innerHTML = "Intensity Level: " + intensity_level
    displayMode(2)
}

function pointClick(){
    addLogs("==> Select Point Processing...")
    document.getElementById("point_but").className = "btn btn-primary btn-sm"
    document.getElementById("neibor_b").className = "btn btn-secondary btn-sm"

}

function neiborClick(){
    addLogs("==> Select Neighborhood Processing...")
    document.getElementById("neibor_b").className = "btn btn-primary btn-sm"
    document.getElementById("point_but").className = "btn btn-secondary btn-sm"

}

function addLogs(s){
    text = document.getElementById("logs").value
    document.getElementById("logs").value = s + "\n" + text;
}