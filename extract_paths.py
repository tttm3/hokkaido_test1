# -*- coding: utf-8 -*-
import cv2
import numpy as np
import os
import json

def imread_unicode(path):
    data = np.fromfile(path, dtype=np.uint8)
    return cv2.imdecode(data, cv2.IMREAD_COLOR)

image_path = os.path.join('images', 'hokkaido', '北海道エリア_文字なし.png')
img = imread_unicode(image_path)
if img is None:
    raise SystemExit(f'image not found: {image_path}')

h, w = img.shape[:2]
print(f'loaded image: {w}x{h}')
Z = img.reshape((-1,3)).astype(np.float32)
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 1.0)
K = 15
attempts = 10
ret, label, center = cv2.kmeans(Z, K, None, criteria, attempts, cv2.KMEANS_PP_CENTERS)
label_image = label.flatten().reshape((h,w))
clusters = []
for cluster in range(K):
    mask = np.uint8((label_image==cluster))*255
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cnts:
        continue
    cnt = max(cnts, key=cv2.contourArea)
    area = cv2.contourArea(cnt)
    if area < 300 or area > 500000:
        continue
    M = cv2.moments(cnt)
    cx = M['m10']/M['m00'] if M['m00'] else 0
    cy = M['m01']/M['m00'] if M['m00'] else 0
    approx = cv2.approxPolyDP(cnt, 2, True)
    points = approx.reshape(-1,2).tolist()
    clusters.append({
        'cluster': cluster,
        'centroid': [float(cx), float(cy)],
        'area': float(area),
        'points': points
    })
clusters.sort(key=lambda c: c['centroid'][1])
result = {'width': w, 'height': h, 'clusters': clusters}

output_path = os.path.join(os.path.dirname(__file__), 'clusters.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f'wrote {len(clusters)} clusters to {output_path}')
