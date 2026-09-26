import os
import cv2
import numpy as np
from PIL import Image

def build_normalized_frames():
    hermes_dir = os.path.abspath('public/hermes')
    
    # 5 Original Frames
    f0 = os.path.join(hermes_dir, 'hermes-0.png')
    f1 = os.path.join(hermes_dir, 'hermes-1.png')
    f2 = os.path.join(hermes_dir, 'hermes-2.png') # Master center frame
    f3 = os.path.join(hermes_dir, 'hermes-3.png')
    f4 = os.path.join(hermes_dir, 'hermes-4.png')
    
    master_center = Image.open(f2).convert('RGBA')
    arr_master = np.array(master_center)
    h, w, _ = arr_master.shape
    
    # Create smooth vertical transition mask at neck seam (y: 380 to 440)
    # 1.0 = use head from frame, 0.0 = use master body
    blend_mask = np.zeros((h, w), dtype=np.float32)
    blend_mask[:380, :] = 1.0
    for y in range(380, 440):
        val = 0.5 * (1.0 + np.cos(np.pi * (y - 380) / 60.0))
        blend_mask[y, :] = val
    # Below 440, blend_mask is 0.0 (pure master body)
    
    # Expand to 4 channels
    mask_4ch = np.dstack([blend_mask] * 4)
    
    # Function to attach a head onto the locked master body
    def attach_head_to_master(head_arr):
        res = head_arr.astype(np.float32) * mask_4ch + arr_master.astype(np.float32) * (1.0 - mask_4ch)
        # Ensure alpha is crisp and clean
        res = np.clip(res, 0, 255).astype(np.uint8)
        # Zero any stray background noise
        res[res[:, :, 3] < 15, 3] = 0
        return res
    
    # Load original 5 heads onto locked body
    img0 = attach_head_to_master(np.array(Image.open(f0).convert('RGBA')))
    img1 = attach_head_to_master(np.array(Image.open(f1).convert('RGBA')))
    img2 = attach_head_to_master(arr_master.copy()) # Filtered identically
    img3 = attach_head_to_master(np.array(Image.open(f3).convert('RGBA')))
    img4 = attach_head_to_master(np.array(Image.open(f4).convert('RGBA')))
    
    # Function to morph ONLY the head region between two frames (y < 420)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    
    def morph_heads(arrA, arrB):
        # Only compute optical flow on head region (y: 0 to 440, x: 200 to 1100)
        cropA = arrA[:440, :]
        cropB = arrB[:440, :]
        
        grayA = cv2.cvtColor(cropA[:, :, :3], cv2.COLOR_RGB2GRAY)
        grayB = cv2.cvtColor(cropB[:, :, :3], cv2.COLOR_RGB2GRAY)
        
        flow_ab = dis.calc(grayA, grayB, None)
        flow_ba = dis.calc(grayB, grayA, None)
        
        ch, cw = grayA.shape
        gx, gy = np.meshgrid(np.arange(cw), np.arange(ch))
        gx = gx.astype(np.float32)
        gy = gy.astype(np.float32)
        
        # Warp at t=0.5
        map_a_x = gx + 0.5 * flow_ab[:, :, 0]
        map_a_y = gy + 0.5 * flow_ab[:, :, 1]
        map_b_x = gx - 0.5 * flow_ba[:, :, 0]
        map_b_y = gy - 0.5 * flow_ba[:, :, 1]
        
        warped_a = cv2.remap(cropA, map_a_x, map_a_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
        warped_b = cv2.remap(cropB, map_b_x, map_b_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
        
        morphed_head = 0.5 * warped_a.astype(np.float32) + 0.5 * warped_b.astype(np.float32)
        morphed_head = np.clip(morphed_head, 0, 255).astype(np.uint8)
        
        # Combine morphed head with master body
        full_arr = arr_master.copy()
        full_arr[:440, :] = morphed_head
        return attach_head_to_master(full_arr)
    
    print("Generating clean 9 frames with 100% LOCKED body...")
    # 0: left-strong
    f_0 = img0
    # 1: left-stronger (morph 0 & 1)
    f_1 = morph_heads(img0, img1)
    # 2: left
    f_2 = img1
    # 3: left-center (morph 1 & 2)
    f_3 = morph_heads(img1, img2)
    # 4: center
    f_4 = img2
    # 5: right-center (morph 2 & 3)
    f_5 = morph_heads(img2, img3)
    # 6: right
    f_6 = img3
    # 7: right-stronger (morph 3 & 4)
    f_7 = morph_heads(img3, img4)
    # 8: right-strong
    f_8 = img4
    
    frame_list = [
        ('hermes-left-strong', f_0),
        ('hermes-left-stronger', f_1),
        ('hermes-left', f_2),
        ('hermes-left-center', f_3),
        ('hermes-center', f_4),
        ('hermes-right-center', f_5),
        ('hermes-right', f_6),
        ('hermes-right-stronger', f_7),
        ('hermes-right-strong', f_8),
    ]
    
    for name, arr in frame_list:
        # Final cleanup: defringe any reddish edge pixels
        alpha = arr[:, :, 3]
        semi = (alpha > 0) & (alpha < 180)
        # Ensure R channel does not exceed G/B on semi-transparent silhouette edges
        arr[semi, 0] = np.minimum(arr[semi, 0], np.maximum(arr[semi, 1], arr[semi, 2]))
        
        im = Image.fromarray(arr, 'RGBA')
        png_path = os.path.join(hermes_dir, f'{name}.png')
        webp_path = os.path.join(hermes_dir, f'{name}.webp')
        im.save(png_path)
        im.save(webp_path, quality=95)
        print(f"Saved {name}: size={im.size}, bbox={im.getbbox()}")
        
    print("ALL 9 HERMES FRAMES BUILT AND VERIFIED!")

if __name__ == '__main__':
    build_normalized_frames()
