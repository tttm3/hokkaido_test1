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

// みやざきサイトを参考にしたダミー結果（3件）
function getMockResults() {
    return [
        {
            region: '中部',
            company: '日高　好幸',
            lines: [
                '所在地：　宮崎市',
                '商品名：　牛堆肥',
                '畜種：　牛ふん',
                '散布料金：　3,000円/t',
                '散布可能地域：　宮崎市'
            ],
            theme: ''
        },
        {
            region: '中部',
            company: '株式会社　松山',
            lines: [
                '所在地：　宮崎市',
                '商品名：　牛ふん堆肥',
                '畜種：　牛ふん',
                '成分（％）：　【水分】65.2　【N】0.78　【P】0.91　【K】0.56　【EC】3.2　【C/N比】19',
                '荷姿1：　バラ（1t）',
                '販売価格1：　4,400円/バラ（1t）',
                '散布料金：　11,000円/t',
                '散布可能地域：　宮崎市',
                '散布可能時期：　周年'
            ],
            theme: ''
        },
        {
            region: '北諸県',
            company: '神内ファーム ニ十一株式会社　ひまわり牧場',
            lines: [
                '所在地：　都城市',
                '商品名：　ひまわり牧場有機',
                '畜種：　牛ふん',
                '成分（％）：　【水分】41.5　【N】1.6　【P】1.5　【K】2.3　【EC】6.7　【C/N比】20.1',
                '荷姿1：　袋（15kg）',
                '販売価格1：　350円/袋（15kg）',
                '荷姿2：　バラ（2t）',
                '販売価格2：　3,000円/バラ（2t）',
                '荷姿3：　バラ（4t）',
                '販売価格3：　6,000円/バラ（4t）',
                '荷姿4：　バラ（軽トラ）',
                '販売価格4：　2,000円/バラ（軽トラ）',
                '散布料金：　1,500円/t',
                '散布可能地域：　宮崎市、都城市、小林市、三股町、国富町、綾町、高原町',
                '散布可能時期：　周年'
            ],
            theme: 'green-theme'
        }
    ];
}

