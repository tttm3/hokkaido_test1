// 地図の初期化とインタラクティブ機能

// 使用する地図画像のパス
const MAP_IMAGE_PATH = 'images/hokkaido/北海道エリア_文字なし.jpg';
const HAS_MAP_IMAGE = true;
const MAP_VIEWBOX = { width: 1152, height: 896 };

// ==========================================
// 1. 牧場データ（50件）
// ==========================================
const fertilizerData = [
    { "id": 1, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "宗谷岬ファーム", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　稚内市、猿払村", "散布可能時期：　周年"] },
    { "id": 2, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "合同会社 北の牧歌", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "350円/袋 (15kg)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　袋 (15kg)", "販売価格1：　350円/袋 (15kg)", "散布可能地域：　稚内市、豊富町", "散布可能時期：　周年"] },
    { "id": 3, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "稚内堆肥センター", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,500円/バラ (4t)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.0", "荷姿1：　バラ (4t)", "販売価格1：　6,500円/バラ (4t)", "散布可能地域：　稚内市、利尻富士町", "散布可能時期：　周年"] },
    { "id": 4, "areaId": "wakkanai-soya", "municipality": "猿払村", "company": "猿払酪農の恵み", "address": "北海道猿払村", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道猿払村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　猿払村、浜頓別町", "散布可能時期：　周年"] },
    { "id": 5, "areaId": "wakkanai-soya", "municipality": "浜頓別町", "company": "浜頓別グリーンファーム", "address": "北海道浜頓別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道浜頓別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　浜頓別町、中頓別町", "散布可能時期：　周年"] },
    { "id": 6, "areaId": "wakkanai-soya", "municipality": "豊富町", "company": "とよとみ堆肥工房", "address": "北海道豊富町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,200円/バラ (4t)", "lines": ["所在地：　北海道豊富町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.5", "荷姿1：　バラ (4t)", "販売価格1：　6,200円/バラ (4t)", "散布可能地域：　豊富町、幌延町", "散布可能時期：　周年"] },
    { "id": 7, "areaId": "wakkanai-soya", "municipality": "利尻富士町", "company": "利尻富士堆肥社", "address": "北海道利尻富士町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道利尻富士町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】65.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　利尻富士町、利尻町", "散布可能時期：　周年"] },
    { "id": 8, "areaId": "wakkanai-soya", "municipality": "利尻町", "company": "利尻島ファーム", "address": "北海道利尻町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道利尻町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　利尻町、利尻富士町", "散布可能時期：　周年"] },
    { "id": 9, "areaId": "wakkanai-soya", "municipality": "礼文町", "company": "礼文堆肥供給", "address": "北海道礼文町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,500円/バラ (2t)", "lines": ["所在地：　北海道礼文町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.5", "荷姿1：　バラ (2t)", "販売価格1：　9,500円/バラ (2t)", "散布可能地域：　礼文町", "散布可能時期：　周年"] },
    { "id": 10, "areaId": "asahikawa-rumoi", "municipality": "旭川市", "company": "旭山エコファーム", "address": "北海道旭川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,800円/バラ (2t)", "lines": ["所在地：　北海道旭川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (2t)", "販売価格1：　8,800円/バラ (2t)", "散布可能地域：　旭川市、東神楽町、東川町", "散布可能時期：　周年"] },
    { "id": 11, "areaId": "asahikawa-rumoi", "municipality": "旭川市", "company": "大雪の恵み堆肥", "address": "北海道旭川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道旭川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.5", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　旭川市、美瑛町", "散布可能時期：　周年"] },
    { "id": 12, "areaId": "asahikawa-rumoi", "municipality": "旭川市", "company": "旭川有機資源", "address": "北海道旭川市", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道旭川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】42.0", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　旭川市、鷹栖町", "散布可能時期：　周年"] },
    { "id": 13, "areaId": "asahikawa-rumoi", "municipality": "富良野市", "company": "ふらの大地牧場", "address": "北海道富良野市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道富良野市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.0", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　富良野市、中富良野町、上富良野町", "散布可能時期：　周年"] },
    { "id": 14, "areaId": "asahikawa-rumoi", "municipality": "富良野市", "company": "ラベンダー堆肥組合", "address": "北海道富良野市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,000円/バラ (2t)", "lines": ["所在地：　北海道富良野市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】63.5", "荷姿1：　バラ (2t)", "販売価格1：　9,000円/バラ (2t)", "散布可能地域：　富良野市、南富良野町", "散布可能時期：　周年"] },
    { "id": 15, "areaId": "asahikawa-rumoi", "municipality": "上富良野町", "company": "かみふらの畜産", "address": "北海道上富良野町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,000円/バラ (4t)", "lines": ["所在地：　北海道上富良野町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.0", "荷姿1：　バラ (4t)", "販売価格1：　7,000円/バラ (4t)", "散布可能地域：　上富良野町、富良野市、美瑛町", "散布可能時期：　周年"] },
    { "id": 16, "areaId": "asahikawa-rumoi", "municipality": "留萌市", "company": "留萌海岸ファーム", "address": "北海道留萌市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道留萌市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　留萌市、増毛町", "散布可能時期：　周年"] },
    { "id": 17, "areaId": "asahikawa-rumoi", "municipality": "留萌市", "company": "留萌資源循環", "address": "北海道留萌市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "420円/袋 (20kg)", "lines": ["所在地：　北海道留萌市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.0", "荷姿1：　袋 (20kg)", "販売価格1：　420円/袋 (20kg)", "散布可能地域：　留萌市、小平町", "散布可能時期：　周年"] },
    { "id": 18, "areaId": "asahikawa-rumoi", "municipality": "小平町", "company": "小平グリーン肥料", "address": "北海道小平町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,200円/バラ (2t)", "lines": ["所在地：　北海道小平町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.5", "荷姿1：　バラ (2t)", "販売価格1：　9,200円/バラ (2t)", "散布可能地域：　小平町、留萌市、苫前町", "散布可能時期：　周年"] },
    { "id": 19, "areaId": "iburi-hidaka", "municipality": "登別市", "company": "登別エコファーム", "address": "北海道登別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道登別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　登別市、室蘭市、伊達市", "散布可能時期：　周年"] },
    { "id": 20, "areaId": "iburi-hidaka", "municipality": "日高町", "company": "門別有機センター", "address": "北海道日高町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,600円/バラ (2t)", "lines": ["所在地：　北海道日高町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.5", "荷姿1：　バラ (2t)", "販売価格1：　8,600円/バラ (2t)", "散布可能地域：　日高町、平取町", "散布可能時期：　周年"] },
    { "id": 21, "areaId": "iburi-hidaka", "municipality": "苫小牧市", "company": "苫小牧資源循環", "address": "北海道苫小牧市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,500円/バラ (4t)", "lines": ["所在地：　北海道苫小牧市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】40.0", "荷姿1：　バラ (4t)", "販売価格1：　7,500円/バラ (4t)", "散布可能地域：　苫小牧市、厚真町、安平町", "散布可能時期：　周年"] },
    { "id": 22, "areaId": "kushiro-nemuro", "municipality": "釧路市", "company": "釧路湿原堆肥", "address": "北海道釧路市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道釧路市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　釧路市、釧路町、白糠町", "散布可能時期：　周年"] },
    { "id": 23, "areaId": "kushiro-nemuro", "municipality": "根室市", "company": "根室酪農のエール", "address": "北海道根室市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "450円/袋 (20kg)", "lines": ["所在地：　北海道根室市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.5", "荷姿1：　袋 (20kg)", "販売価格1：　450円/袋 (20kg)", "散布可能地域：　根室市、別海町", "散布可能時期：　周年"] },
    { "id": 24, "areaId": "kushiro-nemuro", "municipality": "中標津町", "company": "中標津クリーンファーム", "address": "北海道中標津町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,800円/バラ (4t)", "lines": ["所在地：　北海道中標津町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.5", "荷姿1：　バラ (4t)", "販売価格1：　6,800円/バラ (4t)", "散布可能地域：　中標津町、標津町、別海町", "散布可能時期：　周年"] },
    { "id": 25, "areaId": "hakodate", "municipality": "函館市", "company": "函館湾岸堆肥", "address": "北海道函館市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道函館市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】64.0", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　函館市、北斗市", "散布可能時期：　周年"] },
    { "id": 26, "areaId": "hakodate", "municipality": "八雲町", "company": "八雲グリーン堆肥", "address": "北海道八雲町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "350円/袋 (10kg)", "lines": ["所在地：　北海道八雲町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.0", "荷姿1：　袋 (10kg)", "販売価格1：　350円/袋 (10kg)", "散布可能地域：　八雲町、森町", "散布可能時期：　周年"] },
    { "id": 27, "areaId": "hakodate", "municipality": "七飯町", "company": "七飯リサイクルファーム", "address": "北海道七飯町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "7,100円/バラ (4t)", "lines": ["所在地：　北海道七飯町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.0", "荷姿1：　バラ (4t)", "販売価格1：　7,100円/バラ (4t)", "散布可能地域：　七飯町、函館市、鹿部町", "散布可能時期：　周年"] },
    { "id": 28, "areaId": "sorachi", "municipality": "岩見沢市", "company": "岩見沢有機資材", "address": "北海道岩見沢市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,700円/バラ (2t)", "lines": ["所在地：　北海道岩見沢市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (2t)", "販売価格1：　8,700円/バラ (2t)", "散布可能地域：　岩見沢市、三笠市、美唄市", "散布可能時期：　周年"] },
    { "id": 29, "areaId": "sorachi", "municipality": "滝川市", "company": "滝川グリーンサービス", "address": "北海道滝川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道滝川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　滝川市、砂川市、赤平市", "散布可能時期：　周年"] },
    { "id": 30, "areaId": "sapporo-otaru", "municipality": "新篠津村", "company": "新篠津有機肥料", "address": "北海道新篠津村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,900円/バラ (4t)", "lines": ["所在地：　北海道新篠津村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.5", "荷姿1：　バラ (4t)", "販売価格1：　6,900円/バラ (4t)", "散布可能地域：　新篠津村、江別市", "散布可能時期：　周年"] },
    { "id": 31, "areaId": "sorachi", "municipality": "由仁町", "company": "由仁グリーンファーム", "address": "北海道由仁町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道由仁町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　由仁町、長沼町、栗山町", "散布可能時期：　周年"] },
    { "id": 32, "areaId": "sorachi", "municipality": "三笠市", "company": "三笠資源活用", "address": "北海道三笠市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道三笠市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.5", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　三笠市、岩見沢市、美唄市", "散布可能時期：　周年"] },
    { "id": 33, "areaId": "sapporo-otaru", "municipality": "倶知安町", "company": "羊蹄山麓堆肥", "address": "北海道倶知安町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "5,800円/バラ (2t)", "lines": ["所在地：　北海道倶知安町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.0", "荷姿1：　バラ (2t)", "販売価格1：　5,800円/バラ (2t)", "散布可能地域：　倶知安町、ニセコ町、京極町", "散布可能時期：　周年"] },
    { "id": 34, "areaId": "abashiri-kitami-monbetsu", "municipality": "北見市", "company": "北見エコファーム", "address": "北海道北見市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道北見市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】63.0", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　北見市、訓子府町、置戸町", "散布可能時期：　周年"] },
    { "id": 35, "areaId": "abashiri-kitami-monbetsu", "municipality": "網走市", "company": "オホーツク網走牧場", "address": "北海道網走市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,400円/バラ (2t)", "lines": ["所在地：　北海道網走市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.5", "荷姿1：　バラ (2t)", "販売価格1：　8,400円/バラ (2t)", "散布可能地域：　網走市、大空町、小清水町", "散布可能時期：　周年"] },
    { "id": 36, "areaId": "abashiri-kitami-monbetsu", "municipality": "紋別市", "company": "紋別流氷堆肥", "address": "北海道紋別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道紋別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.0", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　紋別市、興部町、湧別町", "散布可能時期：　周年"] },
    { "id": 37, "areaId": "tokachi", "municipality": "芽室町", "company": "芽室コーン＆ビーフ", "address": "北海道芽室町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,200円/バラ (4t)", "lines": ["所在地：　北海道芽室町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】41.0", "荷姿1：　バラ (4t)", "販売価格1：　7,200円/バラ (4t)", "散布可能地域：　芽室町、帯広市、清水町", "散布可能時期：　周年"] },
    { "id": 38, "areaId": "tokachi", "municipality": "大樹町", "company": "大樹宇宙堆肥", "address": "北海道大樹町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道大樹町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　大樹町、広尾町、幕別町", "散布可能時期：　周年"] },
    { "id": 39, "areaId": "hakodate", "municipality": "松前町", "company": "松前城下堆肥", "address": "北海道松前町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "370円/袋 (12kg)", "lines": ["所在地：　北海道松前町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.5", "荷姿1：　袋 (12kg)", "販売価格1：　370円/袋 (12kg)", "散布可能地域：　松前町、福島町", "散布可能時期：　周年"] },
    { "id": 40, "areaId": "hakodate", "municipality": "江差町", "company": "江差追分ファーム", "address": "北海道江差町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "9,800円/バラ (2t)", "lines": ["所在地：　北海道江差町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.0", "荷姿1：　バラ (2t)", "販売価格1：　9,800円/バラ (2t)", "散布可能地域：　江差町、厚沢部町、上ノ国町", "散布可能時期：　周年"] },
    { "id": 41, "areaId": "sapporo-otaru", "municipality": "江別市", "company": "江別レンガ堆肥", "address": "北海道江別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "5,000円/バラ (1t)", "lines": ["所在地：　北海道江別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　5,000円/バラ (1t)", "散布可能地域：　江別市、新篠津村、北広島市", "散布可能時期：　周年"] },
    { "id": 42, "areaId": "sapporo-otaru", "municipality": "石狩市", "company": "石狩サーモン肥料", "address": "北海道石狩市", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "8,200円/バラ (2t)", "lines": ["所在地：　北海道石狩市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (2t)", "販売価格1：　8,200円/バラ (2t)", "散布可能地域：　石狩市、当別町", "散布可能時期：　周年"] },
    { "id": 43, "areaId": "sorachi", "municipality": "長沼町", "company": "長沼グリーン", "address": "北海道長沼町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,500円/バラ (4t)", "lines": ["所在地：　北海道長沼町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.0", "荷姿1：　バラ (4t)", "販売価格1：　6,500円/バラ (4t)", "散布可能地域：　長沼町、由仁町、栗山町", "散布可能時期：　周年"] },
    { "id": 44, "areaId": "sapporo-otaru", "municipality": "北広島市", "company": "北広島エコファーム", "address": "北海道北広島市", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道北広島市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　北広島市、恵庭市", "散布可能時期：　周年"] },
    { "id": 45, "areaId": "asahikawa-rumoi", "municipality": "士別市", "company": "士別サフォーク堆肥", "address": "北海道士別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "430円/袋 (18kg)", "lines": ["所在地：　北海道士別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.5", "荷姿1：　袋 (18kg)", "販売価格1：　430円/袋 (18kg)", "散布可能地域：　士別市、剣淵町、和寒町", "散布可能時期：　周年"] },
    { "id": 46, "areaId": "asahikawa-rumoi", "municipality": "和寒町", "company": "和寒パンプキンファーム", "address": "北海道和寒町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "8,300円/バラ (2t)", "lines": ["所在地：　北海道和寒町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (2t)", "販売価格1：　8,300円/バラ (2t)", "散布可能地域：　和寒町、剣淵町、比布町", "散布可能時期：　周年"] },
    { "id": 47, "areaId": "asahikawa-rumoi", "municipality": "下川町", "company": "下川森林堆肥", "address": "北海道下川町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道下川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　下川町、名寄市", "散布可能時期：　周年"] },
    { "id": 48, "areaId": "asahikawa-rumoi", "municipality": "幌加内町", "company": "幌加内そば堆肥", "address": "北海道幌加内町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,400円/バラ (4t)", "lines": ["所在地：　北海道幌加内町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.0", "荷姿1：　バラ (4t)", "販売価格1：　7,400円/バラ (4t)", "散布可能地域：　幌加内町、深川市", "散布可能時期：　周年"] },
    { "id": 49, "areaId": "abashiri-kitami-monbetsu", "municipality": "遠軽町", "company": "遠軽コスモスファーム", "address": "北海道遠軽町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道遠軽町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.5", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　遠軽町、湧別町", "散布可能時期：　周年"] },
    { "id": 50, "areaId": "abashiri-kitami-monbetsu", "municipality": "湧別町", "company": "湧別チューリップ堆肥", "address": "北海道湧別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道湧別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　湧別町、遠軽町", "散布可能時期：　周年"] },
    { "id": 51, "areaId": "abashiri-kitami-monbetsu", "municipality": "湧別町", "company": "湧別牧場", "address": "北海道湧別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "3,000円/t", "lines": ["所在地：　北海道湧別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　バラ (1t)", "販売価格1：　3,000円/t", "散布可能地域：　湧別町、遠軽町", "散布可能時期：　周年"] },
    { "id": 52, "areaId": "abashiri-kitami-monbetsu", "municipality": "雄武町", "company": "雄武オホーツクファーム", "address": "北海道雄武町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,100円/バラ (1t)", "lines": ["所在地：　北海道雄武町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.0", "荷姿1：　バラ (1t)", "販売価格1：　4,100円/バラ (1t)", "散布可能地域：　雄武町、興部町", "散布可能時期：　周年"] },
    { "id": 53, "areaId": "abashiri-kitami-monbetsu", "municipality": "雄武町", "company": "雄武堆肥センター", "address": "北海道雄武町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道雄武町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.5", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　雄武町", "散布可能時期：　周年"] },
    { "id": 54, "areaId": "sorachi", "municipality": "深川市", "company": "深川ライス＆カウ", "address": "北海道深川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,500円/バラ (2t)", "lines": ["所在地：　北海道深川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　バラ (2t)", "販売価格1：　8,500円/バラ (2t)", "散布可能地域：　深川市、妹背牛町、秩父別町", "散布可能時期：　周年"] },
    { "id": 55, "areaId": "sorachi", "municipality": "浦臼町", "company": "浦臼ファーム", "address": "北海道浦臼町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道浦臼町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　浦臼町、新十津川町、月形町", "散布可能時期：　周年"] },
    { "id": 56, "areaId": "sorachi", "municipality": "美唄市", "company": "美唄グリーンリサイクル", "address": "北海道美唄市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,300円/バラ (4t)", "lines": ["所在地：　北海道美唄市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.5", "荷姿1：　バラ (4t)", "販売価格1：　7,300円/バラ (4t)", "散布可能地域：　美唄市、三笠市、岩見沢市", "散布可能時期：　周年"] },
    { "id": 57, "areaId": "sorachi", "municipality": "南幌町", "company": "南幌ベジ＆ソイル", "address": "北海道南幌町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道南幌町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　南幌町、江別市、長沼町", "散布可能時期：　周年"] },
    { "id": 58, "areaId": "sorachi", "municipality": "新十津川町", "company": "新十津川堆肥供給", "address": "北海道新十津川町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道新十津川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.0", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　新十津川町、滝川市", "散布可能時期：　周年"] },
    { "id": 59, "areaId": "sorachi", "municipality": "芦別市", "company": "芦別スターライト堆肥", "address": "北海道芦別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,000円/バラ (2t)", "lines": ["所在地：　北海道芦別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.0", "荷姿1：　バラ (2t)", "販売価格1：　9,000円/バラ (2t)", "散布可能地域：　芦別市、赤平市", "散布可能時期：　周年"] },
    { "id": 60, "areaId": "abashiri-kitami-monbetsu", "municipality": "訓子府町", "company": "訓子府クリーンファーム", "address": "北海道訓子府町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道訓子府町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　訓子府町、北見市、置戸町", "散布可能時期：　周年"] },
    { "id": 61, "areaId": "sorachi", "municipality": "奈井江町", "company": "奈井江オーガニック", "address": "北海道奈井江町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道奈井江町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　奈井江町、砂川市、美唄市", "散布可能時期：　周年"] },
    { "id": 62, "areaId": "sorachi", "municipality": "妹背牛町", "company": "妹背牛グリーン肥料", "address": "北海道妹背牛町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道妹背牛町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.5", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　妹背牛町、深川市、秩父別町", "散布可能時期：　周年"] },
    { "id": 63, "areaId": "sorachi", "municipality": "赤平市", "company": "赤平再生資源", "address": "北海道赤平市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,000円/バラ (4t)", "lines": ["所在地：　北海道赤平市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】42.0", "荷姿1：　バラ (4t)", "販売価格1：　7,000円/バラ (4t)", "散布可能地域：　赤平市、歌志内市、滝川市", "散布可能時期：　周年"] },
    { "id": 64, "areaId": "sorachi", "municipality": "上砂川町", "company": "上砂川エコファーム", "address": "北海道上砂川町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道上砂川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.5", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　上砂川町、砂川市、歌志内市", "散布可能時期：　周年"] },
    { "id": 65, "areaId": "sorachi", "municipality": "秩父別町", "company": "秩父別有機堆肥", "address": "北海道秩父別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,400円/バラ (2t)", "lines": ["所在地：　北海道秩父別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.5", "荷姿1：　バラ (2t)", "販売価格1：　8,400円/バラ (2t)", "散布可能地域：　秩父別町、深川市、沼田町", "散布可能時期：　周年"] },
    { "id": 66, "areaId": "tokachi", "municipality": "新得町", "company": "新得マウンテンファーム", "address": "北海道新得町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道新得町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　新得町、清水町、鹿追町", "散布可能時期：　周年"] },
    { "id": 67, "areaId": "abashiri-kitami-monbetsu", "municipality": "置戸町", "company": "置戸クリーン肥料", "address": "北海道置戸町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道置戸町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.0", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　置戸町、訓子府町、北見市", "散布可能時期：　周年"] },
    { "id": 68, "areaId": "tokachi", "municipality": "更別村", "company": "更別十勝平野牧場", "address": "北海道更別村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,800円/バラ (4t)", "lines": ["所在地：　北海道更別村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.0", "荷姿1：　バラ (4t)", "販売価格1：　6,800円/バラ (4t)", "散布可能地域：　更別村、中札内村、幕別町", "散布可能時期：　周年"] },
    { "id": 69, "areaId": "tokachi", "municipality": "足寄町", "company": "足寄ラワン堆肥", "address": "北海道足寄町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道足寄町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　足寄町、本別町、陸別町", "散布可能時期：　周年"] },
    { "id": 70, "areaId": "tokachi", "municipality": "上士幌町", "company": "上士幌バルーンファーム", "address": "北海道上士幌町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,600円/バラ (2t)", "lines": ["所在地：　北海道上士幌町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.5", "荷姿1：　バラ (2t)", "販売価格1：　8,600円/バラ (2t)", "散布可能地域：　上士幌町、士幌町、音更町", "散布可能時期：　周年"] },
    { "id": 71, "areaId": "tokachi", "municipality": "陸別町", "company": "陸別日本一寒い堆肥", "address": "北海道陸別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道陸別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　陸別町、足寄町、置戸町", "散布可能時期：　周年"] },
    { "id": 72, "areaId": "tokachi", "municipality": "鹿追町", "company": "鹿追ジオパーク堆肥", "address": "北海道鹿追町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "410円/袋 (18kg)", "lines": ["所在地：　北海道鹿追町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.5", "荷姿1：　袋 (18kg)", "販売価格1：　410円/袋 (18kg)", "散布可能地域：　鹿追町、新得町、士幌町", "散布可能時期：　周年"] },
    { "id": 73, "areaId": "iburi-hidaka", "municipality": "洞爺湖町", "company": "洞爺湖火山灰堆肥", "address": "北海道洞爺湖町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "9,400円/バラ (2t)", "lines": ["所在地：　北海道洞爺湖町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.5", "荷姿1：　バラ (2t)", "販売価格1：　9,400円/バラ (2t)", "散布可能地域：　洞爺湖町、豊浦町、壮瞥町", "散布可能時期：　周年"] },
    { "id": 74, "areaId": "iburi-hidaka", "municipality": "壮瞥町", "company": "壮瞥フルーツの里", "address": "北海道壮瞥町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道壮瞥町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】63.0", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　壮瞥町、伊達市、洞爺湖町", "散布可能時期：　周年"] },
    { "id": 75, "areaId": "tokachi", "municipality": "広尾町", "company": "広尾サンタランド堆肥", "address": "北海道広尾町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,600円/バラ (4t)", "lines": ["所在地：　北海道広尾町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.0", "荷姿1：　バラ (4t)", "販売価格1：　7,600円/バラ (4t)", "散布可能地域：　広尾町、大樹町", "散布可能時期：　周年"] },
    { "id": 76, "areaId": "tokachi", "municipality": "浦幌町", "company": "浦幌森林ファーム", "address": "北海道浦幌町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道浦幌町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.5", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　浦幌町、豊頃町、本別町", "散布可能時期：　周年"] },
    { "id": 77, "areaId": "tokachi", "municipality": "幕別町", "company": "幕別パークゴルフ堆肥", "address": "北海道幕別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "370円/袋 (15kg)", "lines": ["所在地：　北海道幕別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.0", "荷姿1：　袋 (15kg)", "販売価格1：　370円/袋 (15kg)", "散布可能地域：　幕別町、帯広市、池田町", "散布可能時期：　周年" ] },
    { "id": 78, "areaId": "tokachi", "municipality": "清水町", "company": "清水第九堆肥", "address": "北海道清水町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,800円/バラ (2t)", "lines": ["所在地：　北海道清水町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.0", "荷姿1：　バラ (2t)", "販売価格1：　8,800円/バラ (2t)", "散布可能地域：　清水町、新得町、芽室町", "散布可能時期：　周年"] },
    { "id": 79, "areaId": "tokachi", "municipality": "池田町", "company": "池田ワイン堆肥", "address": "北海道池田町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道池田町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　池田町、幕別町、豊頃町", "散布可能時期：　周年"] },
    { "id": 80, "areaId": "iburi-hidaka", "municipality": "安平町", "company": "安平チーズの郷", "address": "北海道安平町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,700円/バラ (4t)", "lines": ["所在地：　北海道安平町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.0", "荷姿1：　バラ (4t)", "販売価格1：　6,700円/バラ (4t)", "散布可能地域：　安平町、苫小牧市、千歳市", "散布可能時期：　周年"] },
    { "id": 81, "areaId": "iburi-hidaka", "municipality": "浦河町", "company": "浦河優駿堆肥", "address": "北海道浦河町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道浦河町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　浦河町、様似町", "散布可能時期：　周年"] },
    { "id": 82, "areaId": "kushiro-nemuro", "municipality": "標茶町", "company": "標茶大草原ファーム", "address": "北海道標茶町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,300円/バラ (2t)", "lines": ["所在地：　北海道標茶町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.5", "荷姿1：　バラ (2t)", "販売価格1：　9,300円/バラ (2t)", "散布可能地域：　標茶町、釧路町、弟子屈町", "散布可能時期：　周年"] },
    { "id": 83, "areaId": "kushiro-nemuro", "municipality": "白糠町", "company": "白糠酪農ヒルズ", "address": "北海道白糠町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道白糠町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　白糠町、釧路市", "散布可能時期：　周年"] },
    { "id": 84, "areaId": "iburi-hidaka", "municipality": "厚真町", "company": "厚真復興ファーム", "address": "北海道厚真町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "350円/袋 (15kg)", "lines": ["所在地：　北海道厚真町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.5", "荷姿1：　袋 (15kg)", "販売価格1：　350円/袋 (15kg)", "散布可能地域：　厚真町、むかわ町、安平町", "散布可能時期：　周年"] },
    { "id": 85, "areaId": "iburi-hidaka", "municipality": "新冠町", "company": "新冠レコード堆肥", "address": "北海道新冠町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,200円/バラ (2t)", "lines": ["所在地：　北海道新冠町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.5", "荷姿1：　バラ (2t)", "販売価格1：　8,200円/バラ (2t)", "散布可能地域：　新冠町、日高町、新ひだか町", "散布可能時期：　周年"] },
    { "id": 86, "areaId": "iburi-hidaka", "municipality": "様似町", "company": "様似アポイ堆肥", "address": "北海道様似町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道様似町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　様似町、浦河町、えりも町", "散布可能時期：　周年"] },
    { "id": 87, "areaId": "iburi-hidaka", "municipality": "新ひだか町", "company": "新ひだか桜堆肥", "address": "北海道新ひだか町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,600円/バラ (4t)", "lines": ["所在地：　北海道新ひだか町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.5", "荷姿1：　バラ (4t)", "販売価格1：　6,600円/バラ (4t)", "散布可能地域：　新ひだか町、新冠町", "散布可能時期：　周年"] },
    { "id": 88, "areaId": "iburi-hidaka", "municipality": "平取町", "company": "平取すずらん堆肥", "address": "北海道平取町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道平取町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　平取町、日高町、むかわ町", "散布可能時期：　周年"] },
    { "id": 89, "areaId": "iburi-hidaka", "municipality": "えりも町", "company": "えりも岬ファーム", "address": "北海道えりも町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道えりも町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.0", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　えりも町、様似町", "散布可能時期：　周年"] },
    { "id": 90, "areaId": "hakodate", "municipality": "知内町", "company": "知内カキ＆カウ", "address": "北海道知内町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,600円/バラ (2t)", "lines": ["所在地：　北海道知内町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.5", "荷姿1：　バラ (2t)", "販売価格1：　9,600円/バラ (2t)", "散布可能地域：　知内町、木古内町、福島町", "散布可能時期：　周年"] },
    { "id": 91, "areaId": "hakodate", "municipality": "森町", "company": "森町イカ飯堆肥", "address": "北海道森町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道森町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　森町、八雲町、鹿部町", "散布可能時期：　周年"] },
    { "id": 92, "areaId": "hakodate", "municipality": "北斗市", "company": "北斗新幹線ファーム", "address": "北海道北斗市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,900円/バラ (2t)", "lines": ["所在地：　北海道北斗市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (2t)", "販売価格1：　8,900円/バラ (2t)", "散布可能地域：　北斗市、函館市、木古内町", "散布可能時期：　周年"] },
    { "id": 93, "areaId": "hakodate", "municipality": "木古内町", "company": "木古内グリーン", "address": "北海道木古内町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道木古内町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.5", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　木古内町、知内町、北斗市", "散布可能時期：　周年"] },
    { "id": 94, "areaId": "hakodate", "municipality": "長万部町", "company": "長万部かにめし堆肥", "address": "北海道長万部町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "420円/袋 (20kg)", "lines": ["所在地：　北海道長万部町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.5", "荷姿1：　袋 (20kg)", "販売価格1：　420円/袋 (20kg)", "散布可能地域：　長万部町、八雲町、黒松内町", "散布可能時期：　周年"] },
    { "id": 95, "areaId": "hakodate", "municipality": "福島町", "company": "福島横綱ファーム", "address": "北海道福島町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,500円/バラ (4t)", "lines": ["所在地：　北海道福島町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.5", "荷姿1：　バラ (4t)", "販売価格1：　7,500円/バラ (4t)", "散布可能地域：　福島町、松前町、知内町", "散布可能時期：　周年"] },
    { "id": 96, "areaId": "hakodate", "municipality": "鹿部町", "company": "鹿部間歇泉堆肥", "address": "北海道鹿部町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道鹿部町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　鹿部町、七飯町、森町", "散布可能時期：　周年"] },
    { "id": 97, "areaId": "hakodate", "municipality": "乙部町", "company": "乙部湧水ファーム", "address": "北海道乙部町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,200円/バラ (2t)", "lines": ["所在地：　北海道乙部町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.5", "荷姿1：　バラ (2t)", "販売価格1：　8,200円/バラ (2t)", "散布可能地域：　乙部町、江差町、厚沢部町", "散布可能時期：　周年"] },
    { "id": 98, "areaId": "hakodate", "municipality": "せたな町", "company": "せたな清流堆肥", "address": "北海道せたな町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道せたな町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.5", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　せたな町、今金町", "散布可能時期：　周年"] },
    { "id": 99, "areaId": "hakodate", "municipality": "上ノ国町", "company": "上ノ国天の川堆肥", "address": "北海道上ノ国町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道上ノ国町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.0", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　上ノ国町、江差町、木古内町", "散布可能時期：　周年"] },
    { "id": 100, "areaId": "hakodate", "municipality": "奥尻町", "company": "奥尻アイランド堆肥", "address": "北海道奥尻町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,900円/バラ (4t)", "lines": ["所在地：　北海道奥尻町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.0", "荷姿1：　バラ (4t)", "販売価格1：　6,900円/バラ (4t)", "散布可能地域：　奥尻町", "散布可能時期：　周年"] },
    { "id": 101, "areaId": "sapporo-otaru", "municipality": "小樽市", "company": "小樽運河肥料", "address": "北海道小樽市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道小樽市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　小樽市、余市町、赤井川村", "散布可能時期：　周年"] },
    { "id": 102, "areaId": "sapporo-otaru", "municipality": "余市町", "company": "余市フルーツコンポスト", "address": "北海道余市町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道余市町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.5", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　余市町、仁木町、古平町", "散布可能時期：　周年"] },
    { "id": 103, "areaId": "sapporo-otaru", "municipality": "仁木町", "company": "仁木銀山堆肥", "address": "北海道仁木町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道仁木町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　仁木町、余市町、倶知安町", "散布可能時期：　周年"] },
    { "id": 104, "areaId": "sapporo-otaru", "municipality": "赤井川村", "company": "赤井川カルデラ堆肥", "address": "北海道赤井川村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,500円/バラ (4t)", "lines": ["所在地：　北海道赤井川村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.0", "荷姿1：　バラ (4t)", "販売価格1：　7,500円/バラ (4t)", "散布可能地域：　赤井川村、余市町、倶知安町", "散布可能時期：　周年"] },
    { "id": 105, "areaId": "sapporo-otaru", "municipality": "古平町", "company": "古平積丹ファーム", "address": "北海道古平町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,200円/バラ (2t)", "lines": ["所在地：　北海道古平町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　バラ (2t)", "販売価格1：　9,200円/バラ (2t)", "散布可能地域：　古平町、積丹町、余市町", "散布可能時期：　周年"] },
    { "id": 106, "areaId": "sapporo-otaru", "municipality": "積丹町", "company": "積丹ブルー肥料", "address": "北海道積丹町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道積丹町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.0", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　積丹町、古平町、神恵内村", "散布可能時期：　周年"] },
    { "id": 107, "areaId": "sapporo-otaru", "municipality": "神恵内村", "company": "神恵内ドラゴン堆肥", "address": "北海道神恵内村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道神恵内村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.5", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　神恵内村、泊村、積丹町", "散布可能時期：　周年"] },
    { "id": 108, "areaId": "sapporo-otaru", "municipality": "泊村", "company": "泊原子力堆肥センター", "address": "北海道泊村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,800円/バラ (4t)", "lines": ["所在地：　北海道泊村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.5", "荷姿1：　バラ (4t)", "販売価格1：　7,800円/バラ (4t)", "散布可能地域：　泊村、共和町、岩内町", "散布可能時期：　周年"] },
    { "id": 109, "areaId": "sapporo-otaru", "municipality": "岩内町", "company": "岩内アスパラ堆肥", "address": "北海道岩内町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道岩内町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　岩内町、共和町、泊村", "散布可能時期：　周年"] },
    { "id": 110, "areaId": "sapporo-otaru", "municipality": "共和町", "company": "共和メロンファーム", "address": "北海道共和町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,600円/バラ (2t)", "lines": ["所在地：　北海道共和町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.0", "荷姿1：　バラ (2t)", "販売価格1：　8,600円/バラ (2t)", "散布可能地域：　共和町、岩内町、倶知安町", "散布可能時期：　周年"] },
    { "id": 111, "areaId": "sorachi", "municipality": "夕張市", "company": "夕張メロン堆肥組合", "address": "北海道夕張市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "5,000円/バラ (1t)", "lines": ["所在地：　北海道夕張市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.5", "荷姿1：　バラ (1t)", "販売価格1：　5,000円/バラ (1t)", "散布可能地域：　夕張市、栗山町、由仁町", "散布可能時期：　周年"] },
    { "id": 112, "areaId": "sorachi", "municipality": "歌志内市", "company": "歌志内リサイクル堆肥", "address": "北海道歌志内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "350円/袋 (15kg)", "lines": ["所在地：　北海道歌志内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.0", "荷姿1：　袋 (15kg)", "販売価格1：　350円/袋 (15kg)", "散布可能地域：　歌志内市、砂川市、赤平市", "散布可能時期：　周年"] },
    { "id": 113, "areaId": "sorachi", "municipality": "月形町", "company": "月形花の里堆肥", "address": "北海道月形町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,900円/バラ (4t)", "lines": ["所在地：　北海道月形町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.0", "荷姿1：　バラ (4t)", "販売価格1：　6,900円/バラ (4t)", "散布可能地域：　月形町、当別町、浦臼町", "散布可能時期：　周年"] },
    { "id": 114, "areaId": "sorachi", "municipality": "北竜町", "company": "北竜ひまわり堆肥", "address": "北海道北竜町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道北竜町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　北竜町、沼田町、秩父別町", "散布可能時期：　周年"] },
    { "id": 115, "areaId": "sorachi", "municipality": "沼田町", "company": "沼田雪国堆肥", "address": "北海道沼田町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,400円/バラ (2t)", "lines": ["所在地：　北海道沼田町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.0", "荷姿1：　バラ (2t)", "販売価格1：　8,400円/バラ (2t)", "散布可能地域：　沼田町、北竜町、深川市", "散布可能時期：　周年"] },
    { "id": 116, "areaId": "sorachi", "municipality": "雨竜町", "company": "雨竜米の里堆肥", "address": "北海道雨竜町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道雨竜町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　雨竜町、北竜町、滝川市", "散布可能時期：　周年"] },
    { "id": 117, "areaId": "sorachi", "municipality": "砂川市", "company": "砂川スイート堆肥", "address": "北海道砂川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道砂川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.0", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　砂川市、滝川市、奈井江町", "散布可能時期：　周年"] },
    { "id": 118, "areaId": "sorachi", "municipality": "栗山町", "company": "栗山環境ファーム", "address": "北海道栗山町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,100円/バラ (4t)", "lines": ["所在地：　北海道栗山町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.0", "荷姿1：　バラ (4t)", "販売価格1：　7,100円/バラ (4t)", "散布可能地域：　栗山町、由仁町、夕張市", "散布可能時期：　周年"] },
    { "id": 119, "areaId": "asahikawa-rumoi", "municipality": "名寄市", "company": "名寄サンピラー堆肥", "address": "北海道名寄市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道名寄市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】63.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　名寄市、下川町、美深町", "散布可能時期：　周年"] },
    { "id": 120, "areaId": "asahikawa-rumoi", "municipality": "美深町", "company": "美深チョウザメ堆肥", "address": "北海道美深町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,000円/バラ (2t)", "lines": ["所在地：　北海道美深町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.0", "荷姿1：　バラ (2t)", "販売価格1：　9,000円/バラ (2t)", "散布可能地域：　美深町、名寄市、音威子府村", "散布可能時期：　周年"] },
    { "id": 121, "areaId": "asahikawa-rumoi", "municipality": "音威子府村", "company": "音威子府森の堆肥", "address": "北海道音威子府村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "410円/袋 (18kg)", "lines": ["所在地：　北海道音威子府村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.5", "荷姿1：　袋 (18kg)", "販売価格1：　410円/袋 (18kg)", "散布可能地域：　音威子府村、美深町、中川町", "散布可能時期：　周年"] },
    { "id": 122, "areaId": "asahikawa-rumoi", "municipality": "中川町", "company": "中川アンモナイト堆肥", "address": "北海道中川町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道中川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.5", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　中川町、音威子府村、天塩町", "散布可能時期：　周年"] },
    { "id": 123, "areaId": "asahikawa-rumoi", "municipality": "天塩町", "company": "天塩川清流堆肥", "address": "北海道天塩町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,000円/バラ (2t)", "lines": ["所在地：　北海道天塩町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.5", "荷姿1：　バラ (2t)", "販売価格1：　8,000円/バラ (2t)", "散布可能地域：　天塩町、遠別町、幌延町", "散布可能時期：　周年"] },
    { "id": 124, "areaId": "asahikawa-rumoi", "municipality": "遠別町", "company": "遠別ライス堆肥", "address": "北海道遠別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道遠別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　遠別町、天塩町、初山別村", "散布可能時期：　周年"] },
    { "id": 125, "areaId": "asahikawa-rumoi", "municipality": "初山別村", "company": "初山別スター堆肥", "address": "北海道初山別村", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "370円/袋 (15kg)", "lines": ["所在地：　北海道初山別村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.5", "荷姿1：　袋 (15kg)", "販売価格1：　370円/袋 (15kg)", "散布可能地域：　初山別村、羽幌町、遠別町", "散布可能時期：　周年"] },
    { "id": 126, "areaId": "asahikawa-rumoi", "municipality": "羽幌町", "company": "羽幌オロロン堆肥", "address": "北海道羽幌町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,700円/バラ (4t)", "lines": ["所在地：　北海道羽幌町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.0", "荷姿1：　バラ (4t)", "販売価格1：　6,700円/バラ (4t)", "散布可能地域：　羽幌町、初山別村、苫前町", "散布可能時期：　周年"] },
    { "id": 127, "areaId": "asahikawa-rumoi", "municipality": "苫前町", "company": "苫前風力堆肥", "address": "北海道苫前町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道苫前町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.5", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　苫前町、羽幌町、小平町", "散布可能時期：　周年"] },
    { "id": 128, "areaId": "asahikawa-rumoi", "municipality": "増毛町", "company": "増毛フルーツ堆肥", "address": "北海道増毛町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,500円/バラ (2t)", "lines": ["所在地：　北海道増毛町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.0", "荷姿1：　バラ (2t)", "販売価格1：　9,500円/バラ (2t)", "散布可能地域：　増毛町、留萌市", "散布可能時期：　周年"] },
    { "id": 129, "areaId": "asahikawa-rumoi", "municipality": "鷹栖町", "company": "鷹栖あったか堆肥", "address": "北海道鷹栖町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道鷹栖町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.5", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　鷹栖町、旭川市、和寒町", "散布可能時期：　周年"] },
    { "id": 130, "areaId": "asahikawa-rumoi", "municipality": "東神楽町", "company": "東神楽花の里堆肥", "address": "北海道東神楽町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道東神楽町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.0", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　東神楽町、旭川市、東川町", "散布可能時期：　周年"] },
    { "id": 131, "areaId": "asahikawa-rumoi", "municipality": "当麻町", "company": "当麻でんすけ堆肥", "address": "北海道当麻町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,300円/バラ (4t)", "lines": ["所在地：　北海道当麻町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.5", "荷姿1：　バラ (4t)", "販売価格1：　7,300円/バラ (4t)", "散布可能地域：　当麻町、旭川市、愛別町", "散布可能時期：　周年"] },
    { "id": 132, "areaId": "asahikawa-rumoi", "municipality": "比布町", "company": "比布スキー堆肥", "address": "北海道比布町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道比布町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　比布町、当麻町、和寒町", "散布可能時期：　周年"] },
    { "id": 133, "areaId": "asahikawa-rumoi", "municipality": "愛別町", "company": "愛別きのこ堆肥", "address": "北海道愛別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,800円/バラ (2t)", "lines": ["所在地：　北海道愛別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.5", "荷姿1：　バラ (2t)", "販売価格1：　8,800円/バラ (2t)", "散布可能地域：　愛別町、上川町、当麻町", "散布可能時期：　周年"] },
    { "id": 134, "areaId": "asahikawa-rumoi", "municipality": "上川町", "company": "上川大雪堆肥", "address": "北海道上川町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道上川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　上川町、愛別町", "散布可能時期：　周年"] },
    { "id": 135, "areaId": "asahikawa-rumoi", "municipality": "東川町", "company": "東川写真の町堆肥", "address": "北海道東川町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道東川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.5", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　東川町、旭川市、東神楽町", "散布可能時期：　周年"] },
    { "id": 136, "areaId": "asahikawa-rumoi", "municipality": "美瑛町", "company": "美瑛丘のまち堆肥", "address": "北海道美瑛町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,000円/バラ (4t)", "lines": ["所在地：　北海道美瑛町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.5", "荷姿1：　バラ (4t)", "販売価格1：　7,000円/バラ (4t)", "散布可能地域：　美瑛町、上富良野町、旭川市", "散布可能時期：　周年"] },
    { "id": 137, "areaId": "asahikawa-rumoi", "municipality": "中富良野町", "company": "中富良野ラベンダー堆肥", "address": "北海道中富良野町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道中富良野町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　中富良野町、富良野市、上富良野町", "散布可能時期：　周年"] },
    { "id": 138, "areaId": "asahikawa-rumoi", "municipality": "南富良野町", "company": "南富良野金山湖堆肥", "address": "北海道南富良野町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,100円/バラ (2t)", "lines": ["所在地：　北海道南富良野町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.0", "荷姿1：　バラ (2t)", "販売価格1：　9,100円/バラ (2t)", "散布可能地域：　南富良野町、富良野市、占冠村", "散布可能時期：　周年"] },
    { "id": 139, "areaId": "asahikawa-rumoi", "municipality": "占冠村", "company": "占冠リゾート堆肥", "address": "北海道占冠村", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道占冠村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　占冠村、南富良野町", "散布可能時期：　周年"] },
    { "id": 140, "areaId": "abashiri-kitami-monbetsu", "municipality": "佐呂間町", "company": "佐呂間サロマ湖堆肥", "address": "北海道佐呂間町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道佐呂間町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.5", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　佐呂間町、湧別町、北見市", "散布可能時期：　周年"] },
    { "id": 141, "areaId": "abashiri-kitami-monbetsu", "municipality": "清里町", "company": "清里焼酎堆肥", "address": "北海道清里町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,800円/バラ (4t)", "lines": ["所在地：　北海道清里町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.5", "荷姿1：　バラ (4t)", "販売価格1：　6,800円/バラ (4t)", "散布可能地域：　清里町、斜里町、小清水町", "散布可能時期：　周年"] },
    { "id": 142, "areaId": "abashiri-kitami-monbetsu", "municipality": "小清水町", "company": "小清水原生花園堆肥", "address": "北海道小清水町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道小清水町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　小清水町、網走市、清里町", "散布可能時期：　周年"] },
    { "id": 143, "areaId": "abashiri-kitami-monbetsu", "municipality": "斜里町", "company": "斜里知床堆肥", "address": "北海道斜里町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,500円/バラ (2t)", "lines": ["所在地：　北海道斜里町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.5", "荷姿1：　バラ (2t)", "販売価格1：　8,500円/バラ (2t)", "散布可能地域：　斜里町、清里町、小清水町", "散布可能時期：　周年"] },
    { "id": 144, "areaId": "abashiri-kitami-monbetsu", "municipality": "大空町", "company": "大空女満別堆肥", "address": "北海道大空町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道大空町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.5", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　大空町、網走市、美幌町", "散布可能時期：　周年"] },
    { "id": 145, "areaId": "abashiri-kitami-monbetsu", "municipality": "美幌町", "company": "美幌峠堆肥", "address": "北海道美幌町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道美幌町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.5", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　美幌町、大空町、津別町", "散布可能時期：　周年"] },
    { "id": 146, "areaId": "abashiri-kitami-monbetsu", "municipality": "津別町", "company": "津別ウッド堆肥", "address": "北海道津別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,200円/バラ (4t)", "lines": ["所在地：　北海道津別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.0", "荷姿1：　バラ (4t)", "販売価格1：　7,200円/バラ (4t)", "散布可能地域：　津別町、美幌町、北見市", "散布可能時期：　周年"] },
    { "id": 147, "areaId": "abashiri-kitami-monbetsu", "municipality": "興部町", "company": "興部ミルク堆肥", "address": "北海道興部町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道興部町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　興部町、雄武町、紋別市", "散布可能時期：　周年"] },
    { "id": 148, "areaId": "abashiri-kitami-monbetsu", "municipality": "西興部村", "company": "西興部ディア堆肥", "address": "北海道西興部村", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "8,800円/バラ (2t)", "lines": ["所在地：　北海道西興部村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.5", "荷姿1：　バラ (2t)", "販売価格1：　8,800円/バラ (2t)", "散布可能地域：　西興部村、興部町、滝上町", "散布可能時期：　周年"] },
    { "id": 149, "areaId": "abashiri-kitami-monbetsu", "municipality": "滝上町", "company": "滝上芝桜堆肥", "address": "北海道滝上町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道滝上町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　滝上町、紋別市、西興部村", "散布可能時期：　周年"] },
    { "id": 150, "areaId": "wakkanai-soya", "municipality": "枝幸町", "company": "枝幸カニ堆肥", "address": "北海道枝幸町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "370円/袋 (15kg)", "lines": ["所在地：　北海道枝幸町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.0", "荷姿1：　袋 (15kg)", "販売価格1：　370円/袋 (15kg)", "散布可能地域：　枝幸町、浜頓別町、中頓別町", "散布可能時期：　周年"] },
    { "id": 151, "areaId": "sapporo-otaru", "municipality": "島牧村", "company": "島牧狩場山堆肥", "address": "北海道島牧村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道島牧村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　島牧村、寿都町、黒松内町", "散布可能時期：　周年"] },
    { "id": 152, "areaId": "hakodate", "municipality": "今金町", "company": "今金男爵ポテト堆肥", "address": "北海道今金町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,800円/バラ (1t)", "lines": ["所在地：　北海道今金町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　バラ (1t)", "販売価格1：　4,800円/バラ (1t)", "散布可能地域：　今金町、せたな町", "散布可能時期：　周年"] },
    { "id": 153, "areaId": "iburi-hidaka", "municipality": "むかわ町", "company": "むかわ竜竜堆肥", "address": "北海道むかわ町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,500円/バラ (2t)", "lines": ["所在地：　北海道むかわ町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.0", "荷姿1：　バラ (2t)", "販売価格1：　8,500円/バラ (2t)", "散布可能地域：　むかわ町、厚真町、日高町", "散布可能時期：　周年"] },
    { "id": 154, "areaId": "iburi-hidaka", "municipality": "豊浦町", "company": "豊浦ホタテ＆カウ", "address": "北海道豊浦町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道豊浦町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.0", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　豊浦町、洞爺湖町、黒松内町", "散布可能時期：　周年"] },
    { "id": 155, "areaId": "kushiro-nemuro", "municipality": "標津町", "company": "標津サーモンパーク堆肥", "address": "北海道標津町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,200円/バラ (4t)", "lines": ["所在地：　北海道標津町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.0", "荷姿1：　バラ (4t)", "販売価格1：　7,200円/バラ (4t)", "散布可能地域：　標津町、中標津町、別海町", "散布可能時期：　周年"] },
    { "id": 156, "areaId": "kushiro-nemuro", "municipality": "釧路町", "company": "釧路町昆布森堆肥", "address": "北海道釧路町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道釧路町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.5", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　釧路町、釧路市、厚岸町", "散布可能時期：　周年"] },
    { "id": 157, "areaId": "asahikawa-rumoi", "municipality": "初山別村", "company": "初山別天文台ファーム", "address": "北海道初山別村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,000円/バラ (2t)", "lines": ["所在地：　北海道初山別村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.0", "荷姿1：　バラ (2t)", "販売価格1：　8,000円/バラ (2t)", "散布可能地域：　初山別村、羽幌町、遠別町", "散布可能時期：　周年"] },
    { "id": 158, "areaId": "sapporo-otaru", "municipality": "京極町", "company": "京極ふきだし堆肥", "address": "北海道京極町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道京極町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　京極町、倶知安町、喜茂別町", "散布可能時期：　周年"] },
    { "id": 159, "areaId": "sapporo-otaru", "municipality": "喜茂別町", "company": "喜茂別峠堆肥", "address": "北海道喜茂別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道喜茂別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.0", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　喜茂別町、京極町、留寿都村", "散布可能時期：　周年"] },
    { "id": 160, "areaId": "sapporo-otaru", "municipality": "留寿都村", "company": "留寿都リゾート堆肥", "address": "北海道留寿都村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,300円/バラ (2t)", "lines": ["所在地：　北海道留寿都村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.5", "荷姿1：　バラ (2t)", "販売価格1：　9,300円/バラ (2t)", "散布可能地域：　留寿都村、真狩村、喜茂別町", "散布可能時期：　周年"] },
    { "id": 161, "areaId": "sapporo-otaru", "municipality": "真狩村", "company": "真狩ゆり根堆肥", "address": "北海道真狩村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道真狩村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】63.5", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　真狩村、ニセコ町、留寿都村", "散布可能時期：　周年"] },
    { "id": 162, "areaId": "sapporo-otaru", "municipality": "ニセコ町", "company": "ニセコパウダー堆肥", "address": "北海道ニセコ町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道ニセコ町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.0", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　ニセコ町、倶知安町、真狩村", "散布可能時期：　周年"] },
    { "id": 163, "areaId": "sapporo-otaru", "municipality": "黒松内町", "company": "黒松内ブナの森堆肥", "address": "北海道黒松内町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,600円/バラ (4t)", "lines": ["所在地：　北海道黒松内町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.0", "荷姿1：　バラ (4t)", "販売価格1：　7,600円/バラ (4t)", "散布可能地域：　黒松内町、寿都町、長万部町", "散布可能時期：　周年"] },
    { "id": 164, "areaId": "sapporo-otaru", "municipality": "蘭越町", "company": "蘭越米の郷堆肥", "address": "北海道蘭越町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道蘭越町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　蘭越町、ニセコ町、黒松内町", "散布可能時期：　周年"] },
    { "id": 165, "areaId": "sapporo-otaru", "municipality": "寿都町", "company": "寿都風力ファーム", "address": "北海道寿都町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,000円/バラ (2t)", "lines": ["所在地：　北海道寿都町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.0", "荷姿1：　バラ (2t)", "販売価格1：　9,000円/バラ (2t)", "散布可能地域：　寿都町、島牧村、黒松内町", "散布可能時期：　周年"] },
    { "id": 166, "areaId": "kushiro-nemuro", "municipality": "弟子屈町", "company": "弟子屈摩周堆肥", "address": "北海道弟子屈町", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道弟子屈町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　弟子屈町、標茶町、中標津町", "散布可能時期：　周年"] },
    { "id": 167, "areaId": "kushiro-nemuro", "municipality": "厚岸町", "company": "厚岸カキ柄堆肥", "address": "北海道厚岸町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道厚岸町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.5", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　厚岸町、釧路町、浜中町", "散布可能時期：　周年"] },
    { "id": 168, "areaId": "kushiro-nemuro", "municipality": "鶴居村", "company": "鶴居タンチョウ堆肥", "address": "北海道鶴居村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,900円/バラ (4t)", "lines": ["所在地：　北海道鶴居村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.5", "荷姿1：　バラ (4t)", "販売価格1：　6,900円/バラ (4t)", "散布可能地域：　鶴居村、釧路市、標茶町", "散布可能時期：　周年"] },
    { "id": 169, "areaId": "kushiro-nemuro", "municipality": "羅臼町", "company": "羅臼知床ファーム", "address": "北海道羅臼町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,500円/バラ (2t)", "lines": ["所在地：　北海道羅臼町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】42.5", "荷姿1：　バラ (2t)", "販売価格1：　9,500円/バラ (2t)", "散布可能地域：　羅臼町、標津町", "散布可能時期：　周年"] },
    { "id": 170, "areaId": "abashiri-kitami-monbetsu", "municipality": "滝上町", "company": "滝上ハーブ堆肥", "address": "北海道滝上町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道滝上町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　滝上町、紋別市", "散布可能時期：　周年"] },
    { "id": 171, "areaId": "sapporo-otaru", "municipality": "千歳市", "company": "千歳空港ファーム", "address": "北海道千歳市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,400円/バラ (4t)", "lines": ["所在地：　北海道千歳市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.0", "荷姿1：　バラ (4t)", "販売価格1：　7,400円/バラ (4t)", "散布可能地域：　千歳市、恵庭市、苫小牧市", "散布可能時期：　周年"] },
    { "id": 172, "areaId": "sapporo-otaru", "municipality": "恵庭市", "company": "恵庭ガーデン堆肥", "address": "北海道恵庭市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "370円/袋 (15kg)", "lines": ["所在地：　北海道恵庭市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.5", "荷姿1：　袋 (15kg)", "販売価格1：　370円/袋 (15kg)", "散布可能地域：　恵庭市、千歳市、北広島市", "散布可能時期：　周年"] },
    { "id": 173, "areaId": "sapporo-otaru", "municipality": "当別町", "company": "当別スウェーデン堆肥", "address": "北海道当別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,600円/バラ (2t)", "lines": ["所在地：　北海道当別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.5", "荷姿1：　バラ (2t)", "販売価格1：　8,600円/バラ (2t)", "散布可能地域：　当別町、石狩市、札幌市", "散布可能時期：　周年"] },
    { "id": 174, "areaId": "iburi-hidaka", "municipality": "室蘭市", "company": "室蘭白鳥大橋堆肥", "address": "北海道室蘭市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道室蘭市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.5", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　室蘭市、登別市、伊達市", "散布可能時期：　周年"] },
    { "id": 175, "areaId": "iburi-hidaka", "municipality": "伊達市", "company": "伊達武者堆肥", "address": "北海道伊達市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道伊達市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.5", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　伊達市、壮瞥町、室蘭市", "散布可能時期：　周年"] },
    { "id": 176, "areaId": "iburi-hidaka", "municipality": "白老町", "company": "白老ウポポイ堆肥", "address": "北海道白老町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,200円/バラ (2t)", "lines": ["所在地：　北海道白老町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.5", "荷姿1：　バラ (2t)", "販売価格1：　9,200円/バラ (2t)", "散布可能地域：　白老町、登別市、苫小牧市", "散布可能時期：　周年"] },
    { "id": 177, "areaId": "abashiri-kitami-monbetsu", "municipality": "北見市", "company": "北見ハッカ堆肥", "address": "北海道北見市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道北見市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】56.0", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　北見市、訓子府町、美幌町", "散布可能時期：　周年"] },
    { "id": 178, "areaId": "sapporo-otaru", "municipality": "札幌市", "company": "札幌モエレ堆肥", "address": "北海道札幌市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,000円/バラ (4t)", "lines": ["所在地：　北海道札幌市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.5", "荷姿1：　バラ (4t)", "販売価格1：　7,000円/バラ (4t)", "散布可能地域：　札幌市、江別市、石狩市", "散布可能時期：　周年"] },
    { "id": 179, "areaId": "sapporo-otaru", "municipality": "札幌市", "company": "札幌羊ヶ丘堆肥", "address": "北海道札幌市", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "420円/袋 (15kg)", "lines": ["所在地：　北海道札幌市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.5", "荷姿1：　袋 (15kg)", "販売価格1：　420円/袋 (15kg)", "散布可能地域：　札幌市、北広島市、恵庭市", "散布可能時期：　周年"] },
    { "id": 180, "areaId": "tokachi", "municipality": "帯広市", "company": "帯広競馬場堆肥", "address": "北海道帯広市", "livestock": "other", "spreadable": true, "method": "request", "type": "馬ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道帯広市", "商品名：　馬ふん堆肥", "畜種：　その他", "成分（％）：　【水分】58.5", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　帯広市、芽室町、音更町", "散布可能時期：　周年"] },
    { "id": 181, "areaId": "tokachi", "municipality": "帯広市", "company": "帯広大平原ファーム", "address": "北海道帯広市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,800円/バラ (2t)", "lines": ["所在地：　北海道帯広市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.0", "荷姿1：　バラ (2t)", "販売価格1：　8,800円/バラ (2t)", "散布可能地域：　帯広市、幕別町、中札内村", "散布可能時期：　周年"] },
    { "id": 182, "areaId": "tokachi", "municipality": "足寄町", "company": "足寄チーズ堆肥", "address": "北海道足寄町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道足寄町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　足寄町、本別町", "散布可能時期：　周年"] },
    { "id": 183, "areaId": "kushiro-nemuro", "municipality": "別海町", "company": "別海ミルク堆肥", "address": "北海道別海町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "350円/袋 (15kg)", "lines": ["所在地：　北海道別海町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.0", "荷姿1：　袋 (15kg)", "販売価格1：　350円/袋 (15kg)", "散布可能地域：　別海町、中標津町、標津町", "散布可能時期：　周年"] },
    { "id": 184, "areaId": "kushiro-nemuro", "municipality": "別海町", "company": "別海パイロットファーム", "address": "北海道別海町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,500円/バラ (4t)", "lines": ["所在地：　北海道別海町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.0", "荷姿1：　バラ (4t)", "販売価格1：　7,500円/バラ (4t)", "散布可能地域：　別海町、根室市、浜中町", "散布可能時期：　周年"] },
    { "id": 185, "areaId": "hakodate", "municipality": "八雲町", "company": "八雲酪農センター", "address": "北海道八雲町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道八雲町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　八雲町、森町、長万部町", "散布可能時期：　周年"] },
    { "id": 186, "areaId": "hakodate", "municipality": "七飯町", "company": "七飯アップル堆肥", "address": "北海道七飯町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,100円/バラ (2t)", "lines": ["所在地：　北海道七飯町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】52.5", "荷姿1：　バラ (2t)", "販売価格1：　9,100円/バラ (2t)", "散布可能地域：　七飯町、函館市、北斗市", "散布可能時期：　周年"] },
    { "id": 187, "areaId": "asahikawa-rumoi", "municipality": "富良野市", "company": "富良野チーズ工房堆肥", "address": "北海道富良野市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道富良野市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　富良野市、中富良野町", "散布可能時期：　周年"] },
    { "id": 188, "areaId": "asahikawa-rumoi", "municipality": "美瑛町", "company": "美瑛青い池堆肥", "address": "北海道美瑛町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道美瑛町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】50.5", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　美瑛町、旭川市、上富良野町", "散布可能時期：　周年"] },
    { "id": 189, "areaId": "sorachi", "municipality": "岩見沢市", "company": "岩見沢ファーム21", "address": "北海道岩見沢市", "livestock": "cattle", "spreadable": true, "method": "self", "type": "牛ふん堆肥", "price": "6,800円/バラ (4t)", "lines": ["所在地：　北海道岩見沢市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.5", "荷姿1：　バラ (4t)", "販売価格1：　6,800円/バラ (4t)", "散布可能地域：　岩見沢市、三笠市", "散布可能時期：　周年"] },
    { "id": 190, "areaId": "sorachi", "municipality": "砂川市", "company": "砂川オアシス堆肥", "address": "北海道砂川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道砂川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　砂川市、滝川市", "散布可能時期：　周年"] },
    { "id": 191, "areaId": "sorachi", "municipality": "滝川市", "company": "滝川カノラ堆肥", "address": "北海道滝川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,900円/バラ (2t)", "lines": ["所在地：　北海道滝川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.5", "荷姿1：　バラ (2t)", "販売価格1：　8,900円/バラ (2t)", "散布可能地域：　滝川市、新十津川町", "散布可能時期：　周年"] },
    { "id": 192, "areaId": "sapporo-otaru", "municipality": "江別市", "company": "江別酪農学園堆肥", "address": "北海道江別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道江別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　江別市、札幌市", "散布可能時期：　周年"] },
    { "id": 193, "areaId": "sapporo-otaru", "municipality": "北広島市", "company": "北広島ボールパーク堆肥", "address": "北海道北広島市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道北広島市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.0", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　北広島市、札幌市", "散布可能時期：　周年"] },
    { "id": 194, "areaId": "sapporo-otaru", "municipality": "石狩市", "company": "石狩番屋堆肥", "address": "北海道石狩市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,300円/バラ (4t)", "lines": ["所在地：　北海道石狩市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.0", "荷姿1：　バラ (4t)", "販売価格1：　7,300円/バラ (4t)", "散布可能地域：　石狩市、札幌市", "散布可能時期：　周年"] },
    { "id": 195, "areaId": "iburi-hidaka", "municipality": "苫小牧市", "company": "苫小牧勇払原野堆肥", "address": "北海道苫小牧市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,500円/バラ (1t)", "lines": ["所在地：　北海道苫小牧市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　バラ (1t)", "販売価格1：　4,500円/バラ (1t)", "散布可能地域：　苫小牧市、白老町", "散布可能時期：　周年"] },
    { "id": 196, "areaId": "kushiro-nemuro", "municipality": "釧路市", "company": "釧路丹頂堆肥", "address": "北海道釧路市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,400円/バラ (2t)", "lines": ["所在地：　北海道釧路市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】53.0", "荷姿1：　バラ (2t)", "販売価格1：　8,400円/バラ (2t)", "散布可能地域：　釧路市、釧路町", "散布可能時期：　周年"] },
    { "id": 197, "areaId": "abashiri-kitami-monbetsu", "municipality": "北見市", "company": "北見オニオン堆肥", "address": "北海道北見市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道北見市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　北見市、訓子府町", "散布可能時期：　周年"] },
    { "id": 198, "areaId": "abashiri-kitami-monbetsu", "municipality": "網走市", "company": "網走監獄堆肥", "address": "北海道網走市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道網走市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】49.0", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　網走市、大空町", "散布可能時期：　周年"] },
    { "id": 199, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "稚内ノシャップ堆肥", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,800円/バラ (4t)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.0", "荷姿1：　バラ (4t)", "販売価格1：　7,800円/バラ (4t)", "散布可能地域：　稚内市、豊富町", "散布可能時期：　周年"] },
    { "id": 200, "areaId": "hakodate", "municipality": "函館市", "company": "函館五稜郭堆肥", "address": "北海道函館市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道函館市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.5", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　函館市、七飯町", "散布可能時期：　周年"] }
];

// 地図を描画する関数
function renderMap(containerId, selectedAreas = new Set(), selectedMunicipalities = new Set()) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const mapImagePath = MAP_IMAGE_PATH;
    const hasMapImage = HAS_MAP_IMAGE;
    
    if (hasMapImage) {
        container.style.position = 'relative';
        container.style.backgroundImage = `url(${mapImagePath})`;
        container.style.backgroundSize = 'contain';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.backgroundPosition = 'center';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'all';
        
        // 安全対策：hokkaidoAreasが存在しない場合は描画しない
        if (typeof hokkaidoAreas !== 'undefined') {
            drawAreaPaths(svg, selectedAreas, selectedMunicipalities, containerId);
        }
        
        container.innerHTML = '';
        container.appendChild(svg);
    } else {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`);
        svg.style.display = 'block';
        svg.style.background = '#f9f9f9';

        // 安全対策
        if (typeof hokkaidoAreas !== 'undefined') {
            drawAreaPaths(svg, selectedAreas, selectedMunicipalities, containerId);
        }
        
        container.innerHTML = '';
        container.appendChild(svg);
    }
}

function drawAreaPaths(svg, selectedAreas, selectedMunicipalities, containerId) {
    // 安全対策：hokkaidoAreasやareaShapesの確認
    if (typeof hokkaidoAreas === 'undefined' || typeof areaShapes === 'undefined') return;

    for (const [areaId, area] of Object.entries(hokkaidoAreas)) {
        const shape = areaShapes[areaId];
        if (!shape) continue;

        shape.paths.forEach(pathString => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathString);
            path.setAttribute('class', 'map-area');
            path.setAttribute('data-area-id', areaId);

            let fillColor = area.color;
            if (selectedAreas.has(areaId) || selectedMunicipalities.size > 0) {
                const isSelected = selectedAreas.has(areaId) ||
                    area.municipalities.some(m => selectedMunicipalities.has(m));
                if (isSelected) {
                    path.classList.add('selected');
                } else {
                    fillColor = 'transparent';
                }
            }

            path.setAttribute('fill', fillColor);
            path.setAttribute('stroke', '#666');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', '1.0');

            path.addEventListener('click', () => {
                toggleAreaSelection(areaId, containerId);
            });

            path.addEventListener('mouseenter', () => {
                path.setAttribute('opacity', '0.7');
            });

            path.addEventListener('mouseleave', () => {
                path.setAttribute('opacity', '0.5');
            });

            svg.appendChild(path);
        });
    }
}

function renderAreaList(containerId, selectedAreas = new Set(), selectedMunicipalities = new Set()) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 安全対策：hokkaidoAreasがない場合は何もしない
    if (typeof hokkaidoAreas === 'undefined') {
        container.innerHTML = '<div style="padding:10px; color:red;">エリアデータを読み込めませんでした(data.jsを確認してください)</div>';
        return;
    }

    const mapContainerId = containerId.replace('-list', '-map');
    container.innerHTML = '';

    for (const [areaId, area] of Object.entries(hokkaidoAreas)) {
        const areaGroup = document.createElement('div');
        areaGroup.className = 'area-group';
        
        const title = document.createElement('div');
        title.className = 'area-group-title';
        title.style.color = area.color;
        title.textContent = area.name;
        areaGroup.appendChild(title);
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'area-group-items';
        
        const areaCheckbox = document.createElement('label');
        areaCheckbox.className = 'area-checkbox';
        const areaInput = document.createElement('input');
        areaInput.type = 'checkbox';
        areaInput.value = areaId;
        areaInput.checked = selectedAreas.has(areaId);
        areaInput.addEventListener('change', (e) => {
            toggleAreaSelection(areaId, mapContainerId);
        });
        areaCheckbox.appendChild(areaInput);
        const areaSpan = document.createElement('span');
        areaSpan.textContent = 'すべて選択';
        areaCheckbox.appendChild(areaSpan);
        itemsContainer.appendChild(areaCheckbox);
        
        area.municipalities.forEach(municipality => {
            const checkbox = document.createElement('label');
            checkbox.className = 'area-checkbox';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = municipality;
            input.checked = selectedMunicipalities.has(municipality);
            input.addEventListener('change', (e) => {
                toggleMunicipalitySelection(municipality, areaId, mapContainerId);
            });
            checkbox.appendChild(input);
            const span = document.createElement('span');
            span.textContent = municipality;
            checkbox.appendChild(span);
            itemsContainer.appendChild(checkbox);
        });
        
        areaGroup.appendChild(itemsContainer);
        container.appendChild(areaGroup);
    }
}

const selectionState = {
    production: {
        areas: new Set(),
        municipalities: new Set()
    },
    spread: {
        areas: new Set(),
        municipalities: new Set()
    }
};

function toggleAreaSelection(areaId, mapContainerId) {
    if (typeof hokkaidoAreas === 'undefined') return; // 安全対策

    const type = mapContainerId.includes('production') ? 'production' : 'spread';
    const state = selectionState[type];
    
    if (state.areas.has(areaId)) {
        state.areas.delete(areaId);
        hokkaidoAreas[areaId].municipalities.forEach(m => state.municipalities.delete(m));
    } else {
        state.areas.add(areaId);
        hokkaidoAreas[areaId].municipalities.forEach(m => state.municipalities.add(m));
    }
    
    updateMapAndList(mapContainerId, type);
}

function toggleMunicipalitySelection(municipality, areaId, mapContainerId) {
    if (typeof hokkaidoAreas === 'undefined') return; // 安全対策

    const type = mapContainerId.includes('production') ? 'production' : 'spread';
    const state = selectionState[type];
    
    if (state.municipalities.has(municipality)) {
        state.municipalities.delete(municipality);
    } else {
        state.municipalities.add(municipality);
    }
    
    const allSelected = hokkaidoAreas[areaId].municipalities.every(m => 
        state.municipalities.has(m)
    );
    
    if (allSelected) {
        state.areas.add(areaId);
    } else {
        state.areas.delete(areaId);
    }
    
    updateMapAndList(mapContainerId, type);
}

function updateMapAndList(mapContainerId, type) {
    const state = selectionState[type];
    const mapId = mapContainerId;
    const listId = mapContainerId.replace('-map', '-list');
    
    renderMap(mapId, state.areas, state.municipalities);
    renderAreaList(listId, state.areas, state.municipalities);
}

document.addEventListener('DOMContentLoaded', () => {
    // 初期表示
    renderMap('production-area-map', selectionState.production.areas, selectionState.production.municipalities);
    renderAreaList('production-area-list', selectionState.production.areas, selectionState.production.municipalities);
    
    renderMap('spread-area-map', selectionState.spread.areas, selectionState.spread.municipalities);
    renderAreaList('spread-area-list', selectionState.spread.areas, selectionState.spread.municipalities);
    
    // ▼▼▼ ブラウザの「戻る」ボタン検知処理（ここを追加） ▼▼▼
    window.addEventListener('popstate', (event) => {
        // 履歴の状態がない（＝最初のフォーム画面に戻った）場合
        if (!event.state || event.state.view !== 'results') {
            document.getElementById('results-section').classList.add('hidden');
            document.getElementById('search-form-section').classList.remove('hidden');
            // スクロールをトップに戻す（任意）
            window.scrollTo(0, 0);
        } else {
            // 進むボタンで結果画面に来た場合などは結果を表示
            document.getElementById('search-form-section').classList.add('hidden');
            document.getElementById('results-section').classList.remove('hidden');
        }
    });

    // 検索ボタンクリック時の処理
    document.getElementById('search-button').addEventListener('click', () => {
        const spreadMethod = document.querySelector('input[name="spread-method"]:checked')?.value;
        const livestock = Array.from(document.querySelectorAll('input[name="livestock"]:checked')).map(cb => cb.value);
        const packageType = Array.from(document.querySelectorAll('input[name="package"]:checked')).map(cb => cb.value);

        const searchParams = {
            spreadMethod,
            livestock,
            packageType,
            productionAreas: Array.from(selectionState.production.areas),
            productionMunicipalities: Array.from(selectionState.production.municipalities),
            spreadAreas: Array.from(selectionState.spread.areas),
            spreadMunicipalities: Array.from(selectionState.spread.municipalities)
        };

        const filteredResults = filterResults(searchParams);
        renderSearchResults(filteredResults, searchParams);

        // ▼▼▼ 履歴に「結果画面」を追加する（ここを追加） ▼▼▼
        history.pushState({ view: 'results' }, '', '#results');

        document.getElementById('search-form-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
        
        // 結果画面のトップへスクロール
        window.scrollTo(0, 0);
    });

    // 「戻る」ボタン（画面内のボタン）クリック時の処理
    document.getElementById('back-to-search').addEventListener('click', () => {
        // ▼▼▼ ブラウザの戻る機能と同じ挙動にする（ここを変更） ▼▼▼
        history.back(); 
    });
});

// ==========================================
// 検索ロジック（安全版）
// ==========================================
function filterResults(params) {
    return fertilizerData.filter(item => {
        // 1. 散布方法のフィルタ（未選択・決めていない場合は全表示）
        if (params.spreadMethod && params.spreadMethod !== 'undecided') {
            if (item.method !== params.spreadMethod) return false;
        }

        // 2. 畜種のフィルタ（選択がある場合のみチェック）
        if (params.livestock.length > 0) {
            if (!params.livestock.includes(item.livestock)) return false;
        }

        // 3. 生産地のフィルタ（選択がある場合のみチェック）
        if (params.productionMunicipalities.length > 0) {
             if (!params.productionMunicipalities.includes(item.municipality)) return false;
        } 
        else if (params.productionAreas.length > 0) {
            if (!params.productionAreas.includes(item.areaId)) return false;
        }

        // 4. 散布可能地域のフィルタ（選択がある場合のみチェック）
        if (params.spreadMunicipalities.length > 0) {
             // item.linesが存在しない場合の安全対策
             const lines = item.lines || [];
             const spreadAreaText = lines.find(l => l.startsWith('散布可能地域')) || '';
             const isMatch = params.spreadMunicipalities.some(m => spreadAreaText.includes(m));
             if (!isMatch) return false;
        }

        return true;
    });
}

function renderSearchResults(results, params) {
    document.getElementById('result-count').textContent = `${results.length}件`;

    const spreadMethodLabel = {
        self: '自分で散布',
        request: '散布までしてほしい',
        undecided: '決めていない'
    }[params.spreadMethod] || '指定なし';

    document.getElementById('summary-spread-method').textContent = spreadMethodLabel;
    
    const livestockLabels = {
        cattle: '牛ふん',
        pig: '豚ふん',
        chicken: '鶏ふん',
        other: 'その他'
    };
    const selectedLivestockLabels = params.livestock.map(l => livestockLabels[l] || l);
    document.getElementById('summary-livestock').textContent =
        selectedLivestockLabels.length ? selectedLivestockLabels.join('、') : '指定なし';

    const spreadMunicipalities = params.spreadMunicipalities;
    document.getElementById('summary-spread-area').textContent =
        spreadMunicipalities.length ? spreadMunicipalities.join('、') : '指定なし';

    const listEl = document.getElementById('results-list');
    listEl.innerHTML = '';
    
    if (results.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding:20px;">条件に一致する堆肥は見つかりませんでした。</div>';
        return;
    }

    results.forEach((item) => {
        const card = document.createElement('div');
        card.className = `result-card ${item.theme || ''}`.trim();
        
        let areaName = '北海道';
        try {
            if (typeof hokkaidoAreas !== 'undefined' && hokkaidoAreas[item.areaId]) {
                areaName = hokkaidoAreas[item.areaId].name;
            }
        } catch (e) {
            console.warn('エリア名の取得に失敗しました', e);
        }

        // ▼▼▼ ここが修正ポイント ▼▼▼
        // 「散布までしてほしい(request)」の時だけボタンを表示する
        const ctaHtml = item.method === 'request' 
            ? '<button class="result-cta">散布します</button>' 
            : ''; // それ以外（selfなど）なら何も表示しない
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        card.innerHTML = `
            <div class="result-card-header">
                <span class="result-region-tag">${areaName}</span>
                ${ctaHtml}
            </div>
            <div class="result-company-name">${item.company}</div>
            <div class="result-details">
                ${item.lines ? item.lines.map(line => `<div>${line}</div>`).join('') : ''}
            </div>
            <button class="result-detail-button">詳細</button>
        `;

        listEl.appendChild(card);
    });
}