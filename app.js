const songData = `BÀI KHÔNG TÊN SỐ 8
Sáng tác: Vũ Thành An Điệu: Slow Rock / Boston Tông: A (La trưởng)

Phiên khúc 1:
[A] Chiều thơm ru [Aaug] hồn người bềnh [A6] bồng [A7]
[D] Chiều không im [Dm6] gọi người đợi [A] mong [A7]
[G#m7b5] Chiều trông cho [C#7] mềm mây ươm [F#m] nắng [A7]
[Bm7] Nắng đợi chiều [B7] nắng say
[E7] Nắng nhuộm chiều [E7aug] hây hây.

Phiên khúc 2:
[A] Ngày đi qua [Aaug] vài lần buồn [A6] phiền [A7]
[D] Người quen với [Dm6] cuộc tình đảo [A] điên [A7]
[G#m7b5] Người quên một [C#7] vòng tay ôm [F#m] nhớ [A7]
[Bm7] Có buồn nhưng [E7] vẫn chưa bao giờ bằng [A] hôm nay. [A7]

Điệp khúc:
Vắng nhau một [D#m7b5] đêm [G#7] càng xa thêm ngàn [C#m7] trùng [F#7]
Tiếc nhau một [Bm7] đêm rồi mai thêm ngại [A] ngùng [A7]
[D] Bao lâu rồi [F#7] tiếc những ngày còn ấu [G] thơ
Lần tìm trong [Bm7] nụ hôn lời nguyện [B7] xưa mặn [E7] đắng. [E7aug]

Phiên khúc 3:
[A] Về đâu tâm [Aaug] hồn này bềnh [A6] bồng [A7]
[D] Về đâu thân [Dm6] này mòn mỏi [A] không [A7]
[G#m7b5] Về sau và [C#7] nhiều năm sau [F#m] nữa [A7]
[Bm7] Có buồn nhưng [E7] vẫn chưa bao giờ bằng [A] hôm nay.

Điệp khúc:
Vắng nhau một [D#m7b5] đêm [G#7] càng xa thêm ngàn [C#m7] trùng [F#7]
Tiếc nhau một [Bm7] đêm rồi mai thêm ngại [A] ngùng [A7]
[D] Bao lâu rồi [F#7] tiếc những ngày còn ấu [G] thơ
Lần tìm trong [Bm7] nụ hôn lời nguyện [B7] xưa mặn [E7] đắng. [E7aug]

Phiên khúc 3:
[A] Về đâu tâm [Aaug] hồn này bềnh [A6] bồng [A7]
[D] Về đâu thân [Dm6] này mòn mỏi [A] không [A7]
[G#m7b5] Về sau và [C#7] nhiều năm sau [F#m] nữa [A7]
[Bm7] Có buồn nhưng [E7] vẫn chưa bao giờ bằng [A] hôm nay.

Coda:
[G#m7b5] Về sau và [C#7] nhiều năm sau [F#m] nữa [A7]
[Bm7] Có buồn nhưng [E7] vẫn chưa bao giờ bằng [A] hôm nay.`;

const notesMajor = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const notesFlat = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

let currentTranspose = 0;
let isScrolling = false;
let scrollInterval;

function transposeChord(chord, semitones) {
    if (semitones === 0) return chord;
    
    return chord.replace(/[A-G](b|#)?/g, (match) => {
        let index = notesMajor.indexOf(match);
        if (index === -1) index = notesFlat.indexOf(match);
        
        if (index === -1) return match;
        
        let newIndex = (index + semitones) % 12;
        if (newIndex < 0) newIndex += 12;
        
        return notesMajor[newIndex];
    });
}

function parseAndRender(transposeAmount) {
    const container = document.getElementById('chord-sheet');
    container.innerHTML = '';
    
    const lines = songData.split('\n');
    let html = '';
    
    lines.forEach(line => {
        if (!line.trim()) {
            html += '<br>';
            return;
        }
        
        if (line.endsWith(':')) {
            html += `<h2 class="section-title">${line}</h2>`;
            return;
        }
        
        let renderedLine = line.replace(/\[([^\]]+)\]/g, (match, chord) => {
            const transposed = transposeChord(chord, transposeAmount);
            return `<span class="chord" data-chord="${transposed}"><span class="chord-spacer">${transposed}</span></span>`;
        });
        
        html += `<div class="line">${renderedLine}</div>`;
    });
    
    container.innerHTML = html;

    // Attach chord diagram listeners
    attachChordListeners();
}

function attachChordListeners() {
    document.querySelectorAll('.chord').forEach(chordEl => {
        chordEl.onmouseenter = (e) => showTooltip(e, e.target.closest('.chord').dataset.chord);
        chordEl.onmouseleave = hideTooltip;
        chordEl.onclick = (e) => {
            showTooltip(e, e.target.closest('.chord').dataset.chord);
            setTimeout(hideTooltip, 2000);
        };
    });
}

function transpose(val) {
    currentTranspose += val;
    parseAndRender(currentTranspose);
}

function resetTranspose() {
    currentTranspose = 0;
    parseAndRender(currentTranspose);
}

function toggleAutoScroll() {
    isScrolling = !isScrolling;
    if (isScrolling) {
        let speed = 1;
        scrollInterval = setInterval(() => {
            window.scrollBy(0, speed);
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                clearInterval(scrollInterval);
                isScrolling = false;
            }
        }, 50);
    } else {
        clearInterval(scrollInterval);
    }
}

// Initial Render
window.onload = () => {
    createTooltip();
    parseAndRender(0);
};

// Chord Fingerings Database (Fret, Finger)
// [E-string, A, D, G, B, e]
// Finger: 1 (Index), 2 (Middle), 3 (Ring), 4 (Pinky), 0 (Open), -1 (Muted)
const chordFingerings = {
    'A': [null, 0, [2,2], [2,3], [2,4], 0],
    'Aaug': [null, 0, [3,3], [2,2], [2,1], 1],
    'A6': [null, 0, [2,2], [2,3], [2,4], [2,4]],
    'A7': [null, 0, [2,2], 0, [2,3], 0],
    'D': [null, null, 0, [2,1], [3,3], [2,2]],
    'Dm6': [null, null, 0, [2,1], 0, 1],
    'E7': [0, [2,2], 0, [1,1], 0, 0],
    'G#m7b5': [[4,2], null, [4,3], [4,4], [3,1], null],
    'C#7': [null, [4,3], [3,2], [4,4], [2,1], null],
    'F#m': [[2,1], [4,3], [4,4], [2,1], [2,1], [2,1]], // Barred
    'Bm7': [null, [2,1], [4,3], [2,1], [3,2], [2,1]], // Barred
    'B7': [null, [2,2], [1,1], [2,3], 0, [2,4]],
    'E7aug': [0, [2,2], 0, [1,1], [1,1], 0],
    'D#m7b5': [null, [6,1], [7,3], [6,2], [7,4], null],
    'G#7': [[4,1], [6,3], [4,1], [5,2], [4,1], [4,1]], // Barred
    'C#m7': [null, [4,1], [6,3], [4,1], [5,2], [4,1]], // Barred
    'F#7': [[2,1], [4,3], [2,1], [3,2], [2,1], [2,1]], // Barred
    'G': [[3,2], [2,1], 0, 0, 0, [3,3]],
    // Sharp variants
    'A#': [null, [1,1], [3,2], [3,3], [3,4], [1,1]],
    'Bb': [null, [1,1], [3,2], [3,3], [3,4], [1,1]],
    'C#': [null, [4,1], [6,3], [6,4], [6,2], [4,1]],
    'Db': [null, [4,1], [6,3], [6,4], [6,2], [4,1]],
    'D#': [null, null, [1,1], [3,2], [4,4], [3,3]],
    'Eb': [null, null, [1,1], [3,2], [4,4], [3,3]],
    'F#': [[2,1], [4,3], [4,4], [3,2], [2,1], [2,1]],
    'Gb': [[2,1], [4,3], [4,4], [3,2], [2,1], [2,1]],
    'G#': [[4,1], [6,3], [6,4], [5,2], [4,1], [4,1]],
    'Ab': [[4,1], [6,3], [6,4], [5,2], [4,1], [4,1]]
};

// Map sharp/flat variants if needed (simple normalization)
function normalizeChord(chord) {
    const maps = {
        'A#': 'Bb', 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab',
        // Also map equivalents if base is missing but shape is known
        'Bb': 'A#', 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#'
    };
    return chord.replace(/^[A-G](b|#)?/, m => maps[m] || m);
}

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'chord-tooltip';
    tooltip.className = 'chord-tooltip';
    document.body.appendChild(tooltip);
}

function renderChordSVG(chordName) {
    const normalized = normalizeChord(chordName);
    // Try exact match first, then normalized match
    const fingering = chordFingerings[chordName] || chordFingerings[normalized] || [null, null, null, null, null, null];
    
    // Determine base fret (if any fret > 5)
    let maxFret = 0;
    fingering.forEach(f => {
        if (Array.isArray(f)) maxFret = Math.max(maxFret, f[0]);
        else if (typeof f === 'number') maxFret = Math.max(maxFret, f);
    });
    
    const baseFret = maxFret > 5 ? Math.min(...fingering.filter(f => Array.isArray(f) || (typeof f === 'number' && f > 0)).map(f => Array.isArray(f) ? f[0] : f)) : 1;

    let svg = `<svg class="chord-svg" viewBox="0 0 100 120">`;
    
    // Draw Frets (5 frets)
    for (let i = 0; i <= 5; i++) {
        const y = 20 + i * 20;
        svg += `<line class="${i === 0 && baseFret === 1 ? 'nut' : 'fret-line'}" x1="20" y1="${y}" x2="80" y2="${y}" />`;
    }
    
    // Draw Strings (6 strings)
    for (let i = 0; i < 6; i++) {
        const x = 20 + i * 12;
        svg += `<line class="string-line" x1="${x}" y1="20" x2="${x}" y2="120" />`;
    }
    
    // Draw base fret number if > 1
    if (baseFret > 1) {
        svg += `<text class="open-text" x="2" y="35">${baseFret}fr</text>`;
    }

    // Draw Dots & X/O
    fingering.forEach((val, stringIndex) => {
        const x = 20 + stringIndex * 12;
        let fret = null;
        let finger = null;

        if (Array.isArray(val)) {
            fret = val[0];
            finger = val[1];
        } else {
            fret = val;
        }

        if (fret === null) {
            svg += `<text class="open-text" x="${x-4}" y="15">×</text>`;
        } else if (fret === 0) {
            svg += `<circle cx="${x}" cy="10" r="3" stroke="#94A3B8" fill="none" stroke-width="1" />`;
        } else {
            const displayFret = baseFret > 1 ? (fret - baseFret + 1) : fret;
            const y = 20 + displayFret * 20 - 10;
            svg += `<circle class="dot" cx="${x}" cy="${y}" r="5" />`;
            if (finger) {
                svg += `<text x="${x}" y="${y+3.5}" text-anchor="middle" style="fill:#000; font-size:9px; font-weight:bold; font-family:sans-serif;">${finger}</text>`;
            }
        }
    });
    
    svg += `</svg>`;
    return svg;
}

function showTooltip(e, chordName) {
    const tooltip = document.getElementById('chord-tooltip');
    tooltip.innerHTML = `<h3>${chordName}</h3>${renderChordSVG(chordName)}`;
    tooltip.classList.add('visible');
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('chord-tooltip');
    tooltip.classList.remove('visible');
}
