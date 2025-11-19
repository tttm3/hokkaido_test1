import cv2
import numpy as np
import os

def convert_jpg_map_to_svg(input_path, output_path):
    # 1. 画像を読み込む
    img = cv2.imread(input_path)
    if img is None:
        print(f"エラー: 画像が見つかりません: {input_path}")
        return

    print(f"画像を読み込みました: {img.shape}")

    # ノイズ除去（平滑化）して、色の抽出精度を上げる
    img_blur = cv2.bilateralFilter(img, 9, 75, 75)

    # 2. 色域分離による輪郭抽出
    # 背景（白）と境界線（黒）を除外し、「色がついている部分」だけを取り出すマスクを作成
    
    # グレースケール化
    gray = cv2.cvtColor(img_blur, cv2.COLOR_BGR2GRAY)
    
    # 白い背景を除去 (閾値 230未満を有効とする) -> これで白以外が残る
    _, mask_no_bg = cv2.threshold(gray, 230, 255, cv2.THRESH_BINARY_INV)
    
    # 黒い境界線を除去 (閾値 50以上を有効とする) -> これで黒い線が消え、色のエリアが分離する
    _, mask_no_lines = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY)
    
    # 両方の条件を満たす部分（＝色がついているエリア）を合成
    color_regions_mask = cv2.bitwise_and(mask_no_bg, mask_no_lines)

    # モルフォロジー変換（小さなノイズ除去と、穴埋め）
    kernel = np.ones((3,3), np.uint8)
    # オープニング（収縮→膨張）で細かいゴミを消す
    color_regions_mask = cv2.morphologyEx(color_regions_mask, cv2.MORPH_OPEN, kernel, iterations=2)
    # クロージング（膨張→収縮）で中身の小さな穴を埋める
    color_regions_mask = cv2.morphologyEx(color_regions_mask, cv2.MORPH_CLOSE, kernel, iterations=2)

    # 3. 輪郭抽出
    contours, _ = cv2.findContours(color_regions_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    h, w = img.shape[:2]

    # 4. SVG生成
    with open(output_path, 'w', encoding='utf-8') as f:
        # ヘッダー：背景を白に指定
        f.write(f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" style="background-color: #ffffff;">\n')

        for i, cnt in enumerate(contours):
            # 小さすぎるエリア（ゴミ）は無視
            if cv2.contourArea(cnt) < 200:
                continue
            
            # 輪郭の近似（滑らかにする）
            epsilon = 0.002 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            
            # パスデータの作成
            path_data = "M"
            for point in approx:
                x, y = point[0]
                path_data += f" {x},{y}"
            path_data += " Z"

            # --- 色の均一化処理 ---
            # その輪郭の内側の色を取得する
            mask = np.zeros(gray.shape, dtype=np.uint8)
            cv2.drawContours(mask, [cnt], -1, 255, cv2.FILLED)
            
            # 境界線付近の混色を避けるため、マスクを少しだけ縮小(erode)して中心部の色を取る
            mask_eroded = cv2.erode(mask, kernel, iterations=3)
            
            # マスク内の色の平均値または中央値を取得
            # ここでは「中央値(median)」を使うことで、ノイズの影響を受けずに「そのエリアの代表色」を取得する
            mean_val = cv2.mean(img, mask=mask_eroded) # BGRの平均
            
            # 色情報の取得 (BGR -> HEX)
            # 平均値だと境界線の黒が混じって暗くなる場合があるので、少し明るさを補正しても良いが
            # ここではシンプルに抽出した色を使う
            b, g, r = int(mean_val[0]), int(mean_val[1]), int(mean_val[2])
            hex_color = f"#{r:02x}{g:02x}{b:02x}"

            # パスの書き込み
            # fill: 抽出した均一な色
            # stroke: 境界線（元の画像の黒い線は消えているので、SVG側で細いグレーの線を引くときれい）
            f.write(f'  <path id="path_{i}" d="{path_data}" fill="{hex_color}" stroke="#888888" stroke-width="1" />\n')

        f.write('</svg>')

    print(f"変換完了: {output_path}")
    print("・背景を白に設定しました。")
    print("・各エリアを均一な色（代表色）で塗りつぶしました。")

# --- 実行設定 ---
# 入力ファイル（JPG）
input_file = 'images/hokkaido/北海道エリア_文字なし.jpg'
# 出力ファイル
output_file = 'images/hokkaido/hokkaido_map_flat.svg'

# 実行
if os.path.exists(input_file):
    convert_jpg_map_to_svg(input_file, output_file)
else:
    print(f"ファイルが見つかりません: {input_file}")
    # 開発環境でのパス調整用（無視してください）
    convert_jpg_map_to_svg('北海道エリア_文字なし.jpg', 'hokkaido_map_flat.svg')