// 地図の初期化とインタラクティブ機能

// 使用する地図画像のパス
const MAP_IMAGE_PATH = 'images/hokkaido/北海道エリア_文字なし.png';
const HAS_MAP_IMAGE = true;
const MAP_VIEWBOX = { width: 1152, height: 896 };

// 地図を描画する関数
function renderMap(containerId, selectedAreas = new Set(), selectedMunicipalities = new Set()) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 背景画像として市町村地図を使用（画像がある場合）
    // 画像がない場合はSVGで描画
    const mapImagePath = MAP_IMAGE_PATH;
    const hasMapImage = HAS_MAP_IMAGE;
    
    if (hasMapImage) {
        // 画像を使用する場合
        container.style.position = 'relative';
        container.style.backgroundImage = `url(${mapImagePath})`;
        container.style.backgroundSize = 'contain';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.backgroundPosition = 'center';
        
        // エリアオーバーレイをSVGで追加
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'all';
        drawAreaPaths(svg, selectedAreas, selectedMunicipalities, containerId);
        container.innerHTML = '';
        container.appendChild(svg);
    } else {
        // SVGで描画する場合
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`);
        svg.style.display = 'block';
        svg.style.background = '#f9f9f9';

        drawAreaPaths(svg, selectedAreas, selectedMunicipalities, containerId);
        container.innerHTML = '';
        container.appendChild(svg);
    }
}

function drawAreaPaths(svg, selectedAreas, selectedMunicipalities, containerId) {
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
                    fillColor = '#e0e0e0';
                }
            }

            path.setAttribute('fill', fillColor);
            path.setAttribute('stroke', '#666');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', '0.5');

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

// エリアリストを描画する関数
function renderAreaList(containerId, selectedAreas = new Set(), selectedMunicipalities = new Set()) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 【追加】リストのIDから、対応する地図のIDを逆算する
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
        
        // エリア全体のチェックボックス
        const areaCheckbox = document.createElement('label');
        areaCheckbox.className = 'area-checkbox';
        const areaInput = document.createElement('input');
        areaInput.type = 'checkbox';
        areaInput.value = areaId;
        areaInput.checked = selectedAreas.has(areaId);
        areaInput.addEventListener('change', (e) => {
            // 【修正】containerId ではなく mapContainerId を渡す
            toggleAreaSelection(areaId, mapContainerId);
        });
        areaCheckbox.appendChild(areaInput);
        const areaSpan = document.createElement('span');
        areaSpan.textContent = 'すべて選択';
        areaCheckbox.appendChild(areaSpan);
        itemsContainer.appendChild(areaCheckbox);
        
        // 市町村のチェックボックス
        area.municipalities.forEach(municipality => {
            const checkbox = document.createElement('label');
            checkbox.className = 'area-checkbox';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = municipality;
            input.checked = selectedMunicipalities.has(municipality);
            input.addEventListener('change', (e) => {
                // 【修正】containerId ではなく mapContainerId を渡す
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

// 選択状態を管理
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

// エリア選択のトグル
function toggleAreaSelection(areaId, mapContainerId) {
    const type = mapContainerId.includes('production') ? 'production' : 'spread';
    const state = selectionState[type];
    
    if (state.areas.has(areaId)) {
        state.areas.delete(areaId);
        // エリア内の市町村もすべて解除
        hokkaidoAreas[areaId].municipalities.forEach(m => state.municipalities.delete(m));
    } else {
        state.areas.add(areaId);
        // エリア内の市町村もすべて選択
        hokkaidoAreas[areaId].municipalities.forEach(m => state.municipalities.add(m));
    }
    
    updateMapAndList(mapContainerId, type);
}

// 市町村選択のトグル
function toggleMunicipalitySelection(municipality, areaId, mapContainerId) {
    const type = mapContainerId.includes('production') ? 'production' : 'spread';
    const state = selectionState[type];
    
    if (state.municipalities.has(municipality)) {
        state.municipalities.delete(municipality);
    } else {
        state.municipalities.add(municipality);
    }
    
    // エリア内のすべての市町村が選択されているかチェック
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

// 地図とリストを更新
function updateMapAndList(mapContainerId, type) {
    const state = selectionState[type];
    const mapId = mapContainerId;
    const listId = mapContainerId.replace('-map', '-list');
    
    renderMap(mapId, state.areas, state.municipalities);
    renderAreaList(listId, state.areas, state.municipalities);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 生産地の地図とリストを初期化
    renderMap('production-area-map', selectionState.production.areas, selectionState.production.municipalities);
    renderAreaList('production-area-list', selectionState.production.areas, selectionState.production.municipalities);
    
    // 散布対象場所の地図とリストを初期化
    renderMap('spread-area-map', selectionState.spread.areas, selectionState.spread.municipalities);
    renderAreaList('spread-area-list', selectionState.spread.areas, selectionState.spread.municipalities);
    
    // 検索ボタンのイベント
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

        renderSearchResults(searchParams);

        document.getElementById('search-form-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
    });

    // 戻るボタン
    document.getElementById('back-to-search').addEventListener('click', () => {
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('search-form-section').classList.remove('hidden');
    });
});

// 検索結果を描画
function renderSearchResults(params) {
    const results = getMockResults();

    document.getElementById('result-count').textContent = `${results.length}件`;

    const spreadMethodLabel = {
        self: '自分で散布',
        request: '散布までしてほしい',
        undecided: '決めていない'
    }[params.spreadMethod] || '指定なし';

    document.getElementById('summary-spread-method').textContent = spreadMethodLabel;
    document.getElementById('summary-livestock').textContent =
        params.livestock.length ? params.livestock.map(l => ({
            cattle: '牛ふん',
            pig: '豚ふん',
            chicken: '鶏ふん',
            other: 'その他'
        }[l] || l).join('、')) : '指定なし';

    const spreadMunicipalities = params.spreadMunicipalities;
    document.getElementById('summary-spread-area').textContent =
        spreadMunicipalities.length ? spreadMunicipalities.join('、') : '指定なし';

    const listEl = document.getElementById('results-list');
    listEl.innerHTML = '';

    results.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `result-card ${item.theme || ''}`.trim();

        card.innerHTML = `
            <div class="result-card-header">
                <span class="result-region-tag">${item.region}</span>
                <button class="result-cta">散布します</button>
            </div>
            <div class="result-company-name">${item.company}</div>
            <div class="result-details">
                ${item.lines.map(line => `<div>${line}</div>`).join('')}
            </div>
            <button class="result-detail-button">詳細</button>
        `;

        listEl.appendChild(card);
    });
}

// 地図の初期化とインタラクティブ機能

// 使用する地図画像のパス
const MAP_IMAGE_PATH = 'images/hokkaido/北海道エリア_文字なし.png';
const HAS_MAP_IMAGE = true;
const MAP_VIEWBOX = { width: 1152, height: 896 };

// ==========================================
// 1. 牧場データ（50件）
// ==========================================
const fertilizerData = [
    { "id": 1, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "宗谷岬ファーム", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　稚内市、猿払村", "散布可能時期：　周年"] },
    { "id": 2, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "合同会社 北の牧歌", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "350円/袋 (15kg)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.5", "荷姿1：　袋 (15kg)", "販売価格1：　350円/袋 (15kg)", "散布可能地域：　稚内市、豊富町", "散布可能時期：　周年"] },
    { "id": 3, "areaId": "wakkanai-soya", "municipality": "稚内市", "company": "稚内堆肥センター", "address": "北海道稚内市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,500円/バラ (4t)", "lines": ["所在地：　北海道稚内市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】45.0", "荷姿1：　バラ (4t)", "販売価格1：　6,500円/バラ (4t)", "散布可能地域：　稚内市、利尻富士町", "散布可能時期：　周年"] },
    { "id": 4, "areaId": "wakkanai-soya", "municipality": "猿払村", "company": "猿払酪農の恵み", "address": "北海道猿払村", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,400円/バラ (1t)", "lines": ["所在地：　北海道猿払村", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　4,400円/バラ (1t)", "散布可能地域：　猿払村、浜頓別町", "散布可能時期：　周年"] },
    { "id": 5, "areaId": "wakkanai-soya", "municipality": "浜頓別町", "company": "浜頓別グリーンファーム", "address": "北海道浜頓別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "380円/袋 (15kg)", "lines": ["所在地：　北海道浜頓別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】55.5", "荷姿1：　袋 (15kg)", "販売価格1：　380円/袋 (15kg)", "散布可能地域：　浜頓別町、中頓別町", "散布可能時期：　周年"] },
    { "id": 6, "areaId": "wakkanai-soya", "municipality": "豊富町", "company": "とよとみ堆肥工房", "address": "北海道豊富町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,200円/バラ (4t)", "lines": ["所在地：　北海道豊富町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】48.5", "荷姿1：　バラ (4t)", "販売価格1：　6,200円/バラ (4t)", "散布可能地域：　豊富町、幌延町", "散布可能時期：　周年"] },
    { "id": 7, "areaId": "wakkanai-soya", "municipality": "利尻富士町", "company": "利尻富士堆肥社", "address": "北海道利尻富士町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,600円/バラ (1t)", "lines": ["所在地：　北海道利尻富士町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】65.0", "荷姿1：　バラ (1t)", "販売価格1：　4,600円/バラ (1t)", "散布可能地域：　利尻富士町、利尻町", "散布可能時期：　周年"] },
    { "id": 8, "areaId": "wakkanai-soya", "municipality": "利尻町", "company": "利尻島ファーム", "address": "北海道利尻町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "390円/袋 (15kg)", "lines": ["所在地：　北海道利尻町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　袋 (15kg)", "販売価格1：　390円/袋 (15kg)", "散布可能地域：　利尻町、利尻富士町", "散布可能時期：　周年"] },
    { "id": 9, "areaId": "wakkanai-soya", "municipality": "礼文町", "company": "礼文堆肥供給", "address": "北海道礼文町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,500円/バラ (2t)", "lines": ["所在地：　北海道礼文町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.5", "荷姿1：　バラ (2t)", "販売価格1：　9,500円/バラ (2t)", "散布可能地域：　礼文町", "散布可能時期：　周年"] },
    { "id": 10, "areaId": "asahikawa-rumoi", "municipality": "旭川市", "company": "旭山エコファーム", "address": "北海道旭川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,800円/バラ (2t)", "lines": ["所在地：　北海道旭川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (2t)", "販売価格1：　8,800円/バラ (2t)", "散布可能地域：　旭川市、東神楽町、東川町", "散布可能時期：　周年"] },
    { "id": 11, "areaId": "asahikawa-rumoi", "municipality": "旭川市", "company": "大雪の恵み堆肥", "address": "北海道旭川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,300円/バラ (1t)", "lines": ["所在地：　北海道旭川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】61.5", "荷姿1：　バラ (1t)", "販売価格1：　4,300円/バラ (1t)", "散布可能地域：　旭川市、美瑛町", "散布可能時期：　周年"] },
    { "id": 12, "areaId": "asahikawa-rumoi", "municipality": "旭川市", "company": "旭川有機資源", "address": "北海道旭川市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "400円/袋 (15kg)", "lines": ["所在地：　北海道旭川市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】42.0", "荷姿1：　袋 (15kg)", "販売価格1：　400円/袋 (15kg)", "散布可能地域：　旭川市、鷹栖町", "散布可能時期：　周年"] },
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
    { "id": 27, "areaId": "hakodate", "municipality": "七飯町", "company": "七飯リサイクルファーム", "address": "北海道七飯町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,100円/バラ (4t)", "lines": ["所在地：　北海道七飯町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】47.0", "荷姿1：　バラ (4t)", "販売価格1：　7,100円/バラ (4t)", "散布可能地域：　七飯町、函館市、鹿部町", "散布可能時期：　周年"] },
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
    { "id": 40, "areaId": "hakodate", "municipality": "江差町", "company": "江差追分ファーム", "address": "北海道江差町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "9,800円/バラ (2t)", "lines": ["所在地：　北海道江差町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】44.0", "荷姿1：　バラ (2t)", "販売価格1：　9,800円/バラ (2t)", "散布可能地域：　江差町、厚沢部町、上ノ国町", "散布可能時期：　周年"] },
    { "id": 41, "areaId": "sapporo-otaru", "municipality": "江別市", "company": "江別レンガ堆肥", "address": "北海道江別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "5,000円/バラ (1t)", "lines": ["所在地：　北海道江別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.0", "荷姿1：　バラ (1t)", "販売価格1：　5,000円/バラ (1t)", "散布可能地域：　江別市、新篠津村、北広島市", "散布可能時期：　周年"] },
    { "id": 42, "areaId": "sapporo-otaru", "municipality": "石狩市", "company": "石狩サーモン肥料", "address": "北海道石狩市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,200円/バラ (2t)", "lines": ["所在地：　北海道石狩市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】57.0", "荷姿1：　バラ (2t)", "販売価格1：　8,200円/バラ (2t)", "散布可能地域：　石狩市、当別町", "散布可能時期：　周年"] },
    { "id": 43, "areaId": "sorachi", "municipality": "長沼町", "company": "長沼グリーン", "address": "北海道長沼町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "6,500円/バラ (4t)", "lines": ["所在地：　北海道長沼町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】46.0", "荷姿1：　バラ (4t)", "販売価格1：　6,500円/バラ (4t)", "散布可能地域：　長沼町、由仁町、栗山町", "散布可能時期：　周年"] },
    { "id": 44, "areaId": "sapporo-otaru", "municipality": "北広島市", "company": "北広島エコファーム", "address": "北海道北広島市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,900円/バラ (1t)", "lines": ["所在地：　北海道北広島市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】59.0", "荷姿1：　バラ (1t)", "販売価格1：　4,900円/バラ (1t)", "散布可能地域：　北広島市、恵庭市", "散布可能時期：　周年"] },
    { "id": 45, "areaId": "asahikawa-rumoi", "municipality": "士別市", "company": "士別サフォーク堆肥", "address": "北海道士別市", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "430円/袋 (18kg)", "lines": ["所在地：　北海道士別市", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】51.5", "荷姿1：　袋 (18kg)", "販売価格1：　430円/袋 (18kg)", "散布可能地域：　士別市、剣淵町、和寒町", "散布可能時期：　周年"] },
    { "id": 46, "areaId": "asahikawa-rumoi", "municipality": "和寒町", "company": "和寒パンプキンファーム", "address": "北海道和寒町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "8,300円/バラ (2t)", "lines": ["所在地：　北海道和寒町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】62.0", "荷姿1：　バラ (2t)", "販売価格1：　8,300円/バラ (2t)", "散布可能地域：　和寒町、剣淵町、比布町", "散布可能時期：　周年"] },
    { "id": 47, "areaId": "asahikawa-rumoi", "municipality": "下川町", "company": "下川森林堆肥", "address": "北海道下川町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,200円/バラ (1t)", "lines": ["所在地：　北海道下川町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】58.0", "荷姿1：　バラ (1t)", "販売価格1：　4,200円/バラ (1t)", "散布可能地域：　下川町、名寄市", "散布可能時期：　周年"] },
    { "id": 48, "areaId": "asahikawa-rumoi", "municipality": "幌加内町", "company": "幌加内そば堆肥", "address": "北海道幌加内町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "7,400円/バラ (4t)", "lines": ["所在地：　北海道幌加内町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】43.0", "荷姿1：　バラ (4t)", "販売価格1：　7,400円/バラ (4t)", "散布可能地域：　幌加内町、深川市", "散布可能時期：　周年"] },
    { "id": 49, "areaId": "abashiri-kitami-monbetsu", "municipality": "遠軽町", "company": "遠軽コスモスファーム", "address": "北海道遠軽町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "4,700円/バラ (1t)", "lines": ["所在地：　北海道遠軽町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】54.5", "荷姿1：　バラ (1t)", "販売価格1：　4,700円/バラ (1t)", "散布可能地域：　遠軽町、湧別町", "散布可能時期：　周年"] },
    { "id": 50, "areaId": "abashiri-kitami-monbetsu", "municipality": "湧別町", "company": "湧別チューリップ堆肥", "address": "北海道湧別町", "livestock": "cattle", "spreadable": true, "method": "request", "type": "牛ふん堆肥", "price": "360円/袋 (15kg)", "lines": ["所在地：　北海道湧別町", "商品名：　牛ふん堆肥", "畜種：　牛ふん", "成分（％）：　【水分】60.5", "荷姿1：　袋 (15kg)", "販売価格1：　360円/袋 (15kg)", "散布可能地域：　湧別町、遠軽町", "散布可能時期：　周年"] }
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
                    fillColor = '#e0e0e0';
                }
            }

            path.setAttribute('fill', fillColor);
            path.setAttribute('stroke', '#666');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('opacity', '0.5');

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
    renderMap('production-area-map', selectionState.production.areas, selectionState.production.municipalities);
    renderAreaList('production-area-list', selectionState.production.areas, selectionState.production.municipalities);
    
    renderMap('spread-area-map', selectionState.spread.areas, selectionState.spread.municipalities);
    renderAreaList('spread-area-list', selectionState.spread.areas, selectionState.spread.municipalities);
    
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

        // ここで検索ロジックを実行
        const filteredResults = filterResults(searchParams);
        renderSearchResults(filteredResults, searchParams);

        document.getElementById('search-form-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
    });

    document.getElementById('back-to-search').addEventListener('click', () => {
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('search-form-section').classList.remove('hidden');
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
        
        // 安全対策：hokkaidoAreasがない場合でもエラーで止めずに「北海道」と表示する
        let areaName = '北海道';
        try {
            if (typeof hokkaidoAreas !== 'undefined' && hokkaidoAreas[item.areaId]) {
                areaName = hokkaidoAreas[item.areaId].name;
            }
        } catch (e) {
            console.warn('エリア名の取得に失敗しました', e);
        }

        card.innerHTML = `
            <div class="result-card-header">
                <span class="result-region-tag">${areaName}</span>
                <button class="result-cta">散布します</button>
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