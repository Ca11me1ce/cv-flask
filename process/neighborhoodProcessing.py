import numpy as np
import skimage.io as io
# import matplotlib.pyplot as plt
from scipy import ndimage
from skimage.color import rgb2gray

class neighborhoodProcessing:
    def __init__(self, img):
        self.img = img
        
    def smoothingBox(self, kernel_size=5):
        k = np.ones([kernel_size, kernel_size])
        img1 = self.imgConvol(k)
        return img1
    
    def smoothingGassian(self, kernel_size=5, sigma=5):
        gaussian = lambda x, y: np.exp(-(x ** 2 + y ** 2) / (2 * (sigma ** 2)))
        k = np.zeros([kernel_size, kernel_size])
        for i in range(kernel_size):
            for j in range(kernel_size):
                k[i][j] = gaussian(i, j)
        k /= 2 * np.pi * sigma * sigma
        k /= k.sum()
        img1 = self.imgConvol(k)
        return img1
    
    def sharpingLaplacian(self):
        H, W = self.img.shape
        pad = 1
        padding = np.pad(self.img, (pad, pad), mode="constant")
        k = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])
        img1 = self.img * 0
        for i in range(H-2):
            for j in range(W-2):
                img1[i, j] = np.sum(padding[i: i+3, j: j+3] * k)
                if img1[i, j] < 0:
                    img1[i, j] = 0
        img1 = rgb2gray(self.img) - img1
        return img1
    
    def sharpingUnsharpMaskAndHighboost(self, kernel_size=5, sigma=5):
        amount = 10
        img = self.smoothingGassian(kernel_size, sigma)
        img1 = ((amount + 1) * self.img) - amount * img
        img1 = np.maximum(img1, np.zeros(img1.shape))
        img1 = np.minimum(img1, np.ones(img1.shape))
        return img1
    
    def orderStatisticMedianFiltering(self):
        img = self.img.copy()
        pad = 1
        padding = np.pad(img, (pad, pad), mode="constant")
        H, W = img.shape
        pixels = [(0, 0)] * 9
        img1 = self.img * 0
        for i in range(1,H-1):
            for j in range(1,W-1):
                pixels[0] = padding[i-1,j-1]
                pixels[1] = padding[i-1,j]
                pixels[2] = padding[i-1,j+1]
                pixels[3] = padding[i,j-1]
                pixels[4] = padding[i,j]
                pixels[5] = padding[i,j+1]
                pixels[6] = padding[i+1,j-1]
                pixels[7] = padding[i+1,j]
                pixels[8] = padding[i+1,j+1]
                pixels.sort()
                img1[i, j] = pixels[4]
        return img1
            
    def imgConvol(self, w=np.ones([3, 3])):
        H, W = self.img.shape
        X, Y = w.shape

        pad = (Y - 1) // 2
        img = np.pad(self.img, (pad, pad), mode="constant")
        output = np.zeros([H, W])

        for i in np.arange(pad, H+pad):
            for j in np.arange(pad, W+pad):
                output[i-pad, j-pad] = (img[i-pad: i+pad+1, j-pad: j+pad+1] * w).sum()  
        return output

    # def displayOriginalImg(self):
    #     plt.figure(figsize = (15, 7))
    #     plt.imshow(self.img, cmap="gray", vmin="0", vmax="255")
    #     plt.axis("off")