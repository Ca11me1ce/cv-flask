from flask import Flask, render_template
from flask_socketio import SocketIO
import json
import base64
import numpy as np
import skimage.io as io
from process.pointProcessing import pointProcessing 
from process.neighborhoodProcessing import neighborhoodProcessing
import matplotlib.pyplot as plt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect', namespace='/')
def query_connect():
    print("########## Connect cv processing...")

@socketio.on('image', namespace='/')
def getImage(json1):
    j = json.loads(json1)
    tmp = j['image'].split(",")[1]
    image = tmp.encode()
    data = base64.b64decode(image)
   
    open("./static/images/image.tif", "wb").write(data)
    img = io.imread("./static/images/image.tif")
    io.imsave("./static/images/image.png", img)
    print("load image")
    plt.figure(figsize=(7, 7))
    plt.hist(img.ravel(), bins=256)
    plt.savefig("./static/images/hist1.png")
    plt.savefig("./static/images/hist2.png")


    socketio.emit("image", json.dumps({"msg": 1}), namespace="/")

@socketio.on('process', namespace='/')
def processImg(json1):
    j = json.loads(json1)
    op = j['op']
    img = io.imread("./static/images/image.tif")
    if op == 1:
        print("negative")
        img = pointProcessing(img)
        img = img.negative()

    elif op == 2:
        print("intensity")
        intensity = int(j["intensity"])
        img = pointProcessing(img)
        img = img.intensityLevelSlicing(intensity_level=intensity)

    elif op == 3:
        print("contrast")
        img = pointProcessing(img)
        img = img.contrastStretching()

    elif op == 4:
        print("hist")
        img = pointProcessing(img)
        img = img.histogramEqualization()

    elif op == 5:
        print("power")
        power = float(j["power"])
        img = pointProcessing(img)
        img = img.powerLaw(power=power)

    elif op == 6:
        print("smoothing")
        mode = j["mode"]
        kernel = int(j["kernel"])
        if mode == "box":
            print("box")
            img = neighborhoodProcessing(img)
            img = img.smoothingBox(kernel_size=kernel)
        else:
            print("gaussian")
            sigma = int(j["sigma"])
            img = neighborhoodProcessing(img)
            img = img.smoothingGassian(kernel_size=kernel, sigma=sigma)
    elif op == 7:
        print("laplacian")
        img = neighborhoodProcessing(img)
        img = img.sharpingLaplacian()

    elif op == 8:
        kernel = int(j["kernel"])
        sigma = int(j["sigma"])
        img = neighborhoodProcessing(img)
        img = img.sharpingUnsharpMaskAndHighboost(kernel_size=kernel, sigma=sigma)
            
    elif op == 9:
        print("median")
        img = neighborhoodProcessing(img)
        img = img.orderStatisticMedianFiltering()


    else:
        print("error")
        return

    io.imsave("./static/images/image1.png", img)
    plt.figure(figsize=(7, 7))
    plt.hist(img.ravel(), bins=256)
    plt.savefig("./static/images/hist2.png")
    socketio.emit("process", json.dumps({"msg": 1}), namespace="/")



    

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8080, debug=True)