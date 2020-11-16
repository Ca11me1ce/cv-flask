import numpy as np
import skimage.io as io
# import matplotlib.pyplot as plt

class pointProcessing:
    def __init__(self, img):
        self.img = img
    
    def negative(self):
        img1 = 255 - self.img
        return img1
    
    def intensityLevelSlicing(self, intensity_level=1):
        return ((self.img / pow(2, intensity_level) *255).astype(np.uint8) - 1 ) * pow(2, intensity_level)
    
    def contrastStretching(self):
        H, W = self.img.shape
        img1 = self.img * 0

        for i, j in ((a,b) for a in range(H) for b in range(W)): 
            img1[i,j] = 255 * (self.img[i,j] - self.img.min()) / (self.img.max() - self.img.min())
            
        return img1
    
    def histogramEqualization(self):
        H, W = self.img.shape
        total_pixels = H * W
        img1 = self.img.copy()
        p = 0

        for i in range(1, 255):
            r = self.img == i
            p += len(self.img[r])
            img1[r] = 255 / total_pixels * p
        
        return img1

    def powerLaw(self, power=0.3):
        img1 = ((self.img / 255) ** power)
        return img1
    
    # def displayOriginalImg(self):
    #     plt.figure(figsize = (15, 7))
    #     plt.imshow(self.img, cmap="gray", vmin="0", vmax="255")
    #     plt.axis("off")