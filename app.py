from flask import Flask, render_template
from flask_socketio import SocketIO
import json
import base64
import numpy as np
import skimage.io as io
from process.pointProcessing import pointProcessing 

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

    elif op == 5:
        print("power")
        power = float(j["power"])
        img = pointProcessing(img)
        img = img.powerLaw(power=power)

    else:
        print("error")

    io.imsave("./static/images/image1.png", img)
    socketio.emit("process", json.dumps({"msg": 1}), namespace="/")



    

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8080, debug=True)