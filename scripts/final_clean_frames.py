"""
Final Hermes frame cleanup script.

Goals:
1. All 9 frames must have IDENTICAL pixels below the neck seam (y >= 440).
2. All semi-transparent edge pixels with red-dominant RGB must be neutralized.
3. Output both .png (lossless source of truth) and .webp (lossless=True for web).
4. Canvas size, position, scale must be identical across all frames.

The 9 named frames are built from the 5 original source images (hermes-0 through hermes-4).
The body below y=440 is always taken from hermes-2 (master center frame).
The head region (y < 440) uses optical flow morphing for intermediate frames.
"""

import os
import sys
import numpy as np
from PIL import Image

try:
    import cv2
except ImportError:
    print("ERROR: opencv-python is required. Install with: pip install opencv-python")
    sys.exit(1)


def run():
    hermes_dir = os.path.abspath("public/hermes")

    # Load the 5 original source images
    originals = []
    for i in range(5):
        path = os.path.join(hermes_dir, f"hermes-{i}.png")
        img = Image.open(path).convert("RGBA")
        originals.append(np.array(img))
        print(f"Loaded hermes-{i}.png: {img.size}")

    master = originals[2]  # hermes-2 is the center/master
    h, w, _ = master.shape
    print(f"Canvas: {w}x{h}")

    # ---- STEP 1: Lock body below y=440 to master across all 5 originals ----
    # Create a smooth vertical blend mask at the neck seam
    # 1.0 = use the frame's own pixels (head), 0.0 = use master body
    blend_mask = np.zeros((h, w), dtype=np.float32)
    blend_mask[:380, :] = 1.0
    for y in range(380, 440):
        # Cosine blend from 1.0 to 0.0 over 60 pixels
        t = (y - 380) / 60.0
        blend_mask[y, :] = 0.5 * (1.0 + np.cos(np.pi * t))
    # Below 440: blend_mask is 0.0 (pure master body)

    mask_4ch = np.dstack([blend_mask] * 4)

    def attach_head(frame_arr):
        """Composite frame's head onto master's locked body."""
        result = (
            frame_arr.astype(np.float64) * mask_4ch
            + master.astype(np.float64) * (1.0 - mask_4ch)
        )
        result = np.clip(result, 0, 255).astype(np.uint8)
        return result

    # Build the 5 body-locked images
    locked = [attach_head(originals[i]) for i in range(5)]

    # ---- STEP 2: Create 4 intermediate morphed frames ----
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)

    def morph_heads(arrA, arrB):
        """Morph only the head region (y < 440) between two frames at t=0.5."""
        cropA = arrA[:440, :].copy()
        cropB = arrB[:440, :].copy()

        grayA = cv2.cvtColor(cropA[:, :, :3], cv2.COLOR_RGB2GRAY)
        grayB = cv2.cvtColor(cropB[:, :, :3], cv2.COLOR_RGB2GRAY)

        flow_ab = dis.calc(grayA, grayB, None)
        flow_ba = dis.calc(grayB, grayA, None)

        ch, cw = grayA.shape
        gx, gy = np.meshgrid(np.arange(cw, dtype=np.float32), np.arange(ch, dtype=np.float32))

        map_a_x = gx + 0.5 * flow_ab[:, :, 0]
        map_a_y = gy + 0.5 * flow_ab[:, :, 1]
        map_b_x = gx - 0.5 * flow_ba[:, :, 0]
        map_b_y = gy - 0.5 * flow_ba[:, :, 1]

        warped_a = cv2.remap(cropA, map_a_x, map_a_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        warped_b = cv2.remap(cropB, map_b_x, map_b_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

        morphed_head = (0.5 * warped_a.astype(np.float64) + 0.5 * warped_b.astype(np.float64))
        morphed_head = np.clip(morphed_head, 0, 255).astype(np.uint8)

        # Combine morphed head with master body
        full = master.copy()
        full[:440, :] = morphed_head
        return attach_head(full)

    print("Morphing intermediate frames...")
    morph_01 = morph_heads(locked[0], locked[1])
    morph_12 = morph_heads(locked[1], locked[2])
    morph_23 = morph_heads(locked[2], locked[3])
    morph_34 = morph_heads(locked[3], locked[4])

    # The 9 frames in order:
    all_frames = [
        ("hermes-left-strong", locked[0]),
        ("hermes-left-stronger", morph_01),
        ("hermes-left", locked[1]),
        ("hermes-left-center", morph_12),
        ("hermes-center", locked[2]),
        ("hermes-right-center", morph_23),
        ("hermes-right", locked[3]),
        ("hermes-right-stronger", morph_34),
        ("hermes-right-strong", locked[4]),
    ]

    # ---- STEP 3: Defringe all semi-transparent edge pixels ----
    for name, arr in all_frames:
        alpha = arr[:, :, 3]

        # Kill very low alpha noise
        arr[alpha < 12, :] = 0

        # For semi-transparent edge pixels (alpha 1-200), clamp red channel
        semi = (alpha > 0) & (alpha < 200)
        r, g, b = arr[semi, 0].astype(np.int16), arr[semi, 1].astype(np.int16), arr[semi, 2].astype(np.int16)
        # If R exceeds max(G, B) by more than 15, clamp it
        max_gb = np.maximum(g, b)
        excess = r - max_gb
        arr[semi, 0] = np.clip(r - np.maximum(excess - 15, 0), 0, 255).astype(np.uint8)

    # ---- STEP 4: Verify body is IDENTICAL across all 9 frames ----
    ref_body = all_frames[0][1][440:, :, :]
    for name, arr in all_frames[1:]:
        diff = np.max(np.abs(arr[440:, :, :].astype(np.int16) - ref_body.astype(np.int16)))
        if diff > 0:
            print(f"WARNING: {name} body differs from reference by {diff}!")
        else:
            print(f"OK: {name} body is identical")

    # ---- STEP 5: Save all frames ----
    for name, arr in all_frames:
        im = Image.fromarray(arr, "RGBA")
        png_path = os.path.join(hermes_dir, f"{name}.png")
        webp_path = os.path.join(hermes_dir, f"{name}.webp")
        im.save(png_path, optimize=True)
        im.save(webp_path, lossless=True)  # LOSSLESS webp = pixel-perfect
        png_size = os.path.getsize(png_path)
        webp_size = os.path.getsize(webp_path)
        print(f"Saved {name}: PNG={png_size//1024}KB, WebP={webp_size//1024}KB")

    # ---- STEP 6: Final verification on saved files ----
    print("\n=== FINAL VERIFICATION ON SAVED FILES ===")
    saved = []
    names = [n for n, _ in all_frames]
    for name in names:
        path = os.path.join(hermes_dir, f"{name}.webp")
        im = np.array(Image.open(path).convert("RGBA"))
        saved.append(im)

    for i in range(len(saved)):
        for j in range(i + 1, len(saved)):
            diff = np.max(np.abs(saved[i][440:, :, :].astype(np.int16) - saved[j][440:, :, :].astype(np.int16)))
            if diff > 0:
                print(f"FAIL: {names[i]} vs {names[j]} body diff = {diff}")

    # Check semi-transparent red edge pixels
    for idx, name in enumerate(names):
        img = saved[idx]
        edge = (img[:, :, 3] > 0) & (img[:, :, 3] < 200)
        if np.sum(edge) > 0:
            r = img[edge, 0].astype(np.int16)
            g = img[edge, 1].astype(np.int16)
            b = img[edge, 2].astype(np.int16)
            red_excess = np.sum((r > g + 30) & (r > b + 30))
            print(f"{name}: {red_excess} red-dominant edge pixels")

    print("\nDONE.")


if __name__ == "__main__":
    run()
