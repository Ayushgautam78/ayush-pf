from PIL import Image
import numpy as np

im = Image.open('public/hermes/hermes-2.png').convert('RGBA')
arr = np.array(im)
for y in range(0, 1254, 50):
    row_alpha = arr[y, :, 3]
    active_cols = np.where(row_alpha > 50)[0]
    if len(active_cols) > 0:
        print(f"y={y}: min_x={active_cols[0]}, max_x={active_cols[-1]}, width={active_cols[-1]-active_cols[0]}")
