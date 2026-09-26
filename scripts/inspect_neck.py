from PIL import Image
import numpy as np

im = Image.open('public/hermes/hermes-2.png').convert('RGBA')
# Crop y from 300 to 550, x from 350 to 850
neck_crop = im.crop((350, 300, 850, 550))
neck_crop.save('scripts/neck_preview.png')
print("Neck preview saved at scripts/neck_preview.png")
