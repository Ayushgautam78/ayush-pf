from PIL import Image
import numpy as np
import glob

files = [
    'public/hermes/hermes-0.png',
    'public/hermes/hermes-1.png',
    'public/hermes/hermes-2.png',
    'public/hermes/hermes-3.png',
    'public/hermes/hermes-4.png',
]

for f in files:
    im = Image.open(f).convert('RGBA')
    arr = np.array(im)
    bbox = im.getbbox()
    print(f, "size:", im.size, "bbox:", bbox)

# Check differences in lower body (e.g. y > 600, rows 600 to 1254)
ref = np.array(Image.open('public/hermes/hermes-2.png').convert('RGBA'))
ref_lower = ref[600:, :, :]

for f in files:
    curr = np.array(Image.open(f).convert('RGBA'))
    curr_lower = curr[600:, :, :]
    diff = np.abs(curr_lower.astype(int) - ref_lower.astype(int))
    print(f, "Lower body max diff:", np.max(diff), "mean diff:", np.mean(diff))
