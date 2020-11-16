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
        document.getElementById("show_hist1").innerHTML = "<img src='../static/images/hist1.png' width='350' class='img-thumbnail'/>"
        document.getElementById("show_hist2").innerHTML = "<img src='../static/images/hist2.png' width='350' class='img-thumbnail'/>"

    }
    addLogs("==> Upload successfully! ")
})

socket.on('process', function(data){
    j = JSON.parse(data)
    if(j["msg"]){
        document.getElementById("show_image2").innerHTML = "<img src='../static/images/image1.png' width='350' class='img-thumbnail'/>"
        document.getElementById("show_hist2").innerHTML = "<img src='../static/images/hist2.png' width='350' class='img-thumbnail'/>"

    }
    addLogs("==> Finished image processing, please check!")
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
         addLogs("==> Upload an image, please wait... ")
     }
}

function clear_panel(){
    console.log("clear panel");
    document.getElementById("show_image1").innerHTML = "<img id='img1' src='../static/images/bg.png' style='width: 350px; padding-bottom: 80px; padding-top: 80px;' class='img-thumbnail'/>"
    document.getElementById("show_image2").innerHTML = "<img id='img1' src='../static/images/bg.png' style='width: 350px; padding-bottom: 80px; padding-top: 80px;' class='img-thumbnail'/>"
    document.getElementById("show_hist1").innerHTML = ""
    document.getElementById("show_hist2").innerHTML = ""
    addLogs("==> Clear the panel! ")
}

function reset(){

    document.getElementById("show_image1").innerHTML = "<img src='../static/images/image.png' width='350' class='img-thumbnail'/>"
    document.getElementById("show_image2").innerHTML = "<img src='../static/images/image.png' width='350' class='img-thumbnail'/>"
    document.getElementById("show_hist1").innerHTML = "<img src='../static/images/hist1.png' width='350' class='img-thumbnail'/>"
    document.getElementById("show_hist2").innerHTML = "<img src='../static/images/hist1.png' width='350' class='img-thumbnail'/>"

    addLogs("==> Reset the processed image! ")
}

function displayMode(op){
    try{
        source = document.getElementById("img1").src.split("/")
        img = source[source.length - 1]
        if(img === "bg.png"){
            alert("Please upload an image! ")
            return
        }
    }
    catch{}
    
    console.log("the op is " + op)
    if(op === 1){
        console.log("negative")
        socket.emit("process", JSON.stringify({"op": op}))
        addLogs("==> Negative Processing, please wait...")
    }

    else if(op === 2){
        console.log("intensity")
        // intensity level 1-7
        check = document.getElementById("intensity").checked
        if(check){
            intensity = document.getElementById("intensity_level").value
            socket.emit("process", JSON.stringify({"op": op, "intensity": intensity}))
            addLogs("==> Intensity-Level Processing, please wait...")
        }

    }
    else if(op === 3){
        console.log("constrast")
        socket.emit("process", JSON.stringify({"op": op}))
        addLogs("==> Constrast Stretching Processing, please wait...")

    }
    else if(op === 4){
        console.log("histgram")
        socket.emit("process", JSON.stringify({"op": op}))
        addLogs("==> Histogram Equalization Processing, please wait...")
    }
    else if(op === 5){
        console.log("power")
        // intensity level 1-7
        check = document.getElementById("power").checked
        if(check){
            power = document.getElementById("power_value").value
            socket.emit("process", JSON.stringify({"op": op, "power": power}))
            addLogs("==> Power-Law Processing, please wait...")
        }
    }

    else if(op === 6){
        console.log("smoothing")
        check = document.getElementById("smoothing").checked
        if(check){
            box = document.getElementById("box").checked
            if(box){
                kernel = document.getElementById("kernel_size_smoothing").value
                socket.emit("process", JSON.stringify({"op": op, "kernel": kernel, "mode": "box"}))
                addLogs("==> Smoothing with Box Processing, please wait...")

            }
            else{
                kernel =document.getElementById("kernel_size_smoothing").value
                sigma = document.getElementById("sigma_gaussian").value
                console.log("sigma: " + sigma)
                socket.emit("process", JSON.stringify({"op": op, "kernel": kernel, "mode": "gaussian", "sigma": sigma}))
                addLogs("==> Smoothing with Gaussian Processing, please wait...")

            }
        }
    }
    else if(op === 7){
        console.log("laplacian")
        socket.emit("process", JSON.stringify({"op": op}))
        addLogs("==> Sharping with Laplacian Processing, please wait...")

    }
    else if(op === 8){
        console.log("unsharp")
        check = document.getElementById("unsharp").checked
        if(check){
            kernel = document.getElementById("kernel_size_unsharp").value
            sigma = document.getElementById("sigma_unsharp").value
            socket.emit("process", JSON.stringify({"op": op, "kernel": kernel, "sigma": sigma}))
            addLogs("==> Sharping with Unsharp Mask and Highboost Processing, please wait...")
        }
    }
    else if(op === 9){
        console.log("median")
        socket.emit("process", JSON.stringify({"op": op}))
        addLogs("==> Order Statistic Median Filtering Processing, please wait...")
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
    if(document.getElementById("point_but").className === "btn btn-primary btn-sm"){
        return
    }

    addLogs("==> Select Point Processing...")
    document.getElementById("point_but").className = "btn btn-primary btn-sm"
    document.getElementById("neibor_b").className = "btn btn-secondary btn-sm"
    document.getElementById('show_mode').innerHTML = "<input type='radio' id='negative' name='mode' value='negative' onchange='displayMode(1)'><label for='negative'>Negative</label><br><br /><input type='radio' id='intensity' name='mode' value='intensity' onchange='displayMode(2)'><label for='intensity'>Intensity-Level Slicing</label><div style='padding-left: 40px;'><span class='font-weight-bold indigo-text mr-2 mt-1'>1</span><input id='intensity_level' class='border-0' type='range' min='1' max='7' onchange='displayIntnsity()' /><span class='font-weight-bold indigo-text ml-2 mt-1'>7</span><br/><span id='display_intensity' class='font-weight-bold indigo-text ml-2 mt-1'>Intensity Level: 4</span></div><br/><input type='radio' id='constrast' name='mode' value='constrast' onchange='displayMode(3)'><label for='constrast'>Constrast Stretching</label><br><br /><input type='radio' id='hist' name='mode' value='hist' onchange='displayMode(4)'><label for='hist'>Histogram Equalization</label><br><br /><input type='radio' id='power' name='mode' value='power' onchange='displayMode(5)'><label for='power'>Power-Law</label><br /><label for='power' style='padding-left: 40px;'>Power Value: </label><input type='number' value='0.3' id='power_value' name='power' min='0.1' max='1' step='0.1' style='padding-left: 40px;' onchange='displayMode(5)'>"

}

function neiborClick(){
    if(document.getElementById("neibor_b").className === "btn btn-primary btn-sm"){
        return

    }
    document.getElementById('show_mode').innerHTML = "<input type='radio' id='smoothing' name='mode' value='smoothing' onchange='displayMode(6)'><label for='smoothing'>Smoothing</label><div style='padding-left: 40px;'><input type='radio' id='box' name='smooth' value='box' checked onchange='displayMode(6)'><label for='box'>Smoothing with Box</label><br><input type='radio' id='gaussian' name='smooth' value='gaussian' onchange='displayMode(6)'><label for='gaussian'>Smoothing with Gaussian</label><label for='kernel' style='padding-left: 40px;'>Kernel Size: </label><input type='number' value='3' id='kernel_size_smoothing' name='kernel' min='3' max='21' step='2' onchange='displayMode(6)'><label for='sigma' style='padding-left: 40px;'>Sigma for Gaussian: </label><input type='number' value='5' id='sigma_gaussian' name='sigma' min='3' max='10' step='1' onchange='displayMode(6)'></div><br /><input type='radio' id='laplacian' name='mode' value='laplacian' onchange='displayMode(7)'><label for='laplacian'>Sharping with Laplacian</label><br/><br/><input type='radio' id='unsharp' name='mode' value='unsharp' onchange='displayMode(8)'><label for='unsharp'>Sharping with Unsharp Mask and Highboost</label><br><div style='padding-left: 40px;'><label for='kernel' style='padding-left: 40px;'>Kernel Size: </label><input type='number' value='3' id='kernel_size_unsharp' name='power' min='3' max='21' step='2' onchange='displayMode(8)'><label for='sigma' style='padding-left: 40px;'>Sigma for Gaussian: </label><input type='number' value='5' id='sigma_unsharp' name='sigma' min='3' max='10' step='1' onchange='displayMode(8)'></div><br /><input type='radio' id='median' name='mode' value='median' onchange='displayMode(9)'><label for='median'>Order Statistic Median Filtering</label>"
    addLogs("==> Select Neighborhood Processing...")
    document.getElementById("neibor_b").className = "btn btn-primary btn-sm"
    document.getElementById("point_but").className = "btn btn-secondary btn-sm"

}

function addLogs(s){
    text = document.getElementById("logs").value
    document.getElementById("logs").value = s + "\n" + text;
}