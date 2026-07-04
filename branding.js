/* ============================================================
   Branding 탭
   - PC: 한 번에 3개씩 가로로 표시 (가로 3분할)
   - 로고가 3개 초과 시: 행을 늘리지 않고 3개씩 묶어 '돌아가며'(회전) 표시
   - 모바일(≤768px): 1개씩 표시하며 좌우로 넘어감
   - 로고 클릭 시: 해당 로고를 크게 보여주는 라이트박스 (좌우 이동 · 스와이프 지원)
   데이터는 branding-data.js 의 BRANDING_ITEMS 를 사용합니다.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initBranding();
});

function initBranding() {
    const section = document.getElementById("branding");
    if (!section) return;

    // 데이터가 없으면 섹션과 내비 링크를 숨긴다.
    const items = (typeof BRANDING_ITEMS !== "undefined" && Array.isArray(BRANDING_ITEMS))
        ? BRANDING_ITEMS.filter((it) => it && it.logo)
        : [];
    if (!items.length) {
        section.style.display = "none";
        const navLink = document.querySelector('.section-nav a[href="#branding"]');
        if (navLink) navLink.style.display = "none";
        return;
    }

    const track = section.querySelector(".branding-track");
    const dotsWrap = section.querySelector(".branding-dots");
    const btnPrev = section.querySelector(".brand-nav-prev");
    const btnNext = section.querySelector(".brand-nav-next");

    const AUTOPLAY_MS = 4500;   // 자동 회전 간격(ms)
    const FADE_MS = 240;        // 페이지 전환 페이드(ms)

    let perPage = computePerPage();
    let pages = chunk(items, perPage);
    let curPage = 0;
    let timer = null;

    function computePerPage() {
        return window.innerWidth <= 768 ? 1 : 3;
    }

    function chunk(arr, size) {
        const out = [];
        for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
        return out;
    }

    // 한 페이지(3개 묶음)를 렌더링. animate=true 면 페이드로 교체.
    function renderPage(pageIdx, animate) {
        curPage = (pageIdx + pages.length) % pages.length;
        const build = () => {
            track.innerHTML = "";
            pages[curPage].forEach((it) => track.appendChild(makeCell(it)));
            // 마지막 페이지가 3개 미만이어도 왼쪽 정렬 폭을 유지하도록 빈 칸 채움
            const missing = perPage - pages[curPage].length;
            for (let i = 0; i < missing; i++) {
                const filler = document.createElement("div");
                filler.className = "brand-cell brand-cell--empty";
                filler.setAttribute("aria-hidden", "true");
                track.appendChild(filler);
            }
            updateDots();
        };
        if (animate) {
            track.classList.add("is-fading");
            setTimeout(() => {
                build();
                // 리플로우 후 페이드 인
                void track.offsetWidth;
                track.classList.remove("is-fading");
            }, FADE_MS);
        } else {
            build();
        }
    }

    function makeCell(it) {
        const idx = items.indexOf(it);
        const cell = document.createElement("div");
        cell.className = "brand-cell";
        cell.setAttribute("role", "button");
        cell.setAttribute("tabindex", "0");
        cell.setAttribute("aria-label", (it.company || "브랜딩 로고") + " 로고 크게 보기");

        const wrap = document.createElement("div");
        wrap.className = "brand-logo-wrap";
        const img = document.createElement("img");
        img.className = "brand-logo";
        img.src = it.logo;
        img.alt = (it.company || "브랜딩") + " 로고";
        img.loading = "lazy";
        img.decoding = "async";
        wrap.appendChild(img);

        const name = document.createElement("div");
        name.className = "brand-name";
        name.textContent = it.company || "";

        cell.appendChild(wrap);
        cell.appendChild(name);

        cell.addEventListener("click", () => openLightbox(idx));
        cell.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(idx);
            }
        });
        return cell;
    }

    function updateDots() {
        if (!dotsWrap) return;
        // 페이지가 1개뿐이면 점·화살표 숨김
        const single = pages.length <= 1;
        dotsWrap.style.display = single ? "none" : "";
        if (btnPrev) btnPrev.style.display = single ? "none" : "";
        if (btnNext) btnNext.style.display = single ? "none" : "";
        if (single) { dotsWrap.innerHTML = ""; return; }

        dotsWrap.innerHTML = "";
        pages.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "brand-dot" + (i === curPage ? " active" : "");
            dot.setAttribute("aria-label", (i + 1) + "번째 로고 묶음 보기");
            dot.addEventListener("click", () => { goTo(i); restart(); });
            dotsWrap.appendChild(dot);
        });
    }

    function goTo(pageIdx) { renderPage(pageIdx, true); }
    function next() { goTo(curPage + 1); }
    function prev() { goTo(curPage - 1); }

    function start() {
        stop();
        if (pages.length > 1) timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { start(); }

    if (btnNext) btnNext.addEventListener("click", () => { next(); restart(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { prev(); restart(); });

    // 마우스/포커스가 올라가 있으면 자동 회전 일시정지
    section.addEventListener("mouseenter", stop);
    section.addEventListener("mouseleave", start);
    section.addEventListener("focusin", stop);
    section.addEventListener("focusout", start);

    // 반응형: 화면 폭이 바뀌면 3분할↔1분할 재구성
    let resizeRAF = null;
    window.addEventListener("resize", () => {
        if (resizeRAF) cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(() => {
            const np = computePerPage();
            if (np === perPage) return;
            // 현재 보고 있던 첫 항목을 기준으로 새 페이지 위치를 잡는다.
            const firstItemIdx = curPage * perPage;
            perPage = np;
            pages = chunk(items, perPage);
            curPage = Math.min(Math.floor(firstItemIdx / perPage), pages.length - 1);
            renderPage(curPage, false);
            start();
        });
    });

    renderPage(0, false);
    start();

    // ========================================================
    //  Branding 라이트박스 (로고 크게 보기)
    // ========================================================
    const lb = document.createElement("div");
    lb.className = "brand-lightbox";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML = `
        <div class="brand-lb-backdrop" data-close></div>
        <div class="brand-lb-panel" role="dialog" aria-modal="true" aria-label="브랜딩 로고">
            <button class="brand-lb-close" data-close type="button" aria-label="닫기"><i class="fas fa-xmark"></i></button>
            <button class="brand-lb-prev" type="button" aria-label="이전 로고"><i class="fas fa-chevron-left"></i></button>
            <div class="brand-lb-stage">
                <div class="brand-lb-imgwrap">
                    <img class="brand-lb-img" src="" alt="">
                </div>
                <div class="brand-lb-name"></div>
                <a class="brand-lb-link" target="_blank" rel="noopener">바로가기 <i class="fas fa-arrow-up-right-from-square"></i></a>
                <div class="brand-lb-meta">
                    <span class="brand-lb-counter"></span>
                    <span class="brand-lb-hint"><i class="fas fa-arrows-left-right"></i> 좌우로 밀어 넘기기</span>
                </div>
            </div>
            <button class="brand-lb-next" type="button" aria-label="다음 로고"><i class="fas fa-chevron-right"></i></button>
        </div>`;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector(".brand-lb-img");
    const lbImgWrap = lb.querySelector(".brand-lb-imgwrap");
    const lbName = lb.querySelector(".brand-lb-name");
    const lbLink = lb.querySelector(".brand-lb-link");
    const lbCounter = lb.querySelector(".brand-lb-counter");
    const lbHint = lb.querySelector(".brand-lb-hint");
    const lbPrev = lb.querySelector(".brand-lb-prev");
    const lbNext = lb.querySelector(".brand-lb-next");

    let lbIndex = 0;

    function drawLightbox() {
        const it = items[lbIndex];
        if (!it) return;
        lbImg.src = it.logo;
        lbImg.alt = (it.company || "브랜딩") + " 로고";
        lbName.textContent = it.company || "";
        if (it.link) {
            lbLink.href = it.link;
            lbLink.style.display = "";
        } else {
            lbLink.removeAttribute("href");
            lbLink.style.display = "none";
        }
        const multi = items.length > 1;
        lbCounter.textContent = multi ? (lbIndex + 1) + " / " + items.length : "";
        lbPrev.style.display = multi ? "" : "none";
        lbNext.style.display = multi ? "" : "none";
        lbHint.style.display = multi ? "" : "none";
    }

    function openLightbox(index) {
        stop(); // 라이트박스가 열려 있는 동안 캐러셀 자동회전 정지
        lbIndex = (index + items.length) % items.length;
        drawLightbox();
        lb.classList.add("open");
        lb.setAttribute("aria-hidden", "false");
        document.body.classList.add("lb-lock");
    }

    function closeLightbox() {
        lb.classList.remove("open");
        lb.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lb-lock");
        lbImg.src = "";
        start(); // 캐러셀 자동회전 재개
    }

    function stepLightbox(dir) {
        if (items.length < 2) return;
        lbIndex = (lbIndex + dir + items.length) % items.length;
        // 방향에 맞춰 살짝 밀리며 교체되는 페이드
        lbImgWrap.style.transition = "none";
        lbImgWrap.style.transform = `translateX(${dir > 0 ? 24 : -24}px)`;
        lbImgWrap.style.opacity = "0";
        drawLightbox();
        void lbImgWrap.offsetWidth;
        lbImgWrap.style.transition = "transform .25s ease, opacity .25s ease";
        lbImgWrap.style.transform = "translateX(0)";
        lbImgWrap.style.opacity = "1";
    }

    lbPrev.addEventListener("click", () => stepLightbox(-1));
    lbNext.addEventListener("click", () => stepLightbox(1));
    lb.querySelectorAll("[data-close]").forEach((el) =>
        el.addEventListener("click", closeLightbox)
    );
    document.addEventListener("keydown", (e) => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowLeft") stepLightbox(-1);
        else if (e.key === "ArrowRight") stepLightbox(1);
    });

    // 모바일 터치 스와이프
    let tStartX = 0, tStartY = 0, tDX = 0, tSwiping = false;
    const SWIPE_MIN = 45;
    lbImgWrap.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        tStartX = e.touches[0].clientX;
        tStartY = e.touches[0].clientY;
        tDX = 0;
        tSwiping = true;
        lbImgWrap.style.transition = "none";
    }, { passive: true });
    lbImgWrap.addEventListener("touchmove", (e) => {
        if (!tSwiping || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - tStartX;
        const dy = e.touches[0].clientY - tStartY;
        if (Math.abs(dy) > Math.abs(dx)) {
            tSwiping = false;
            lbImgWrap.style.transition = "transform .2s ease, opacity .2s ease";
            lbImgWrap.style.transform = "";
            lbImgWrap.style.opacity = "";
            return;
        }
        tDX = dx;
        e.preventDefault();
        if (items.length > 1) {
            lbImgWrap.style.transform = `translateX(${dx}px)`;
            lbImgWrap.style.opacity = String(Math.max(0.5, 1 - Math.abs(dx) / 500));
        }
    }, { passive: false });
    function endLbSwipe() {
        if (!tSwiping) return;
        tSwiping = false;
        if (items.length > 1 && Math.abs(tDX) >= SWIPE_MIN) {
            stepLightbox(tDX < 0 ? 1 : -1);
        } else {
            lbImgWrap.style.transition = "transform .2s ease, opacity .2s ease";
            lbImgWrap.style.transform = "";
            lbImgWrap.style.opacity = "";
        }
    }
    lbImgWrap.addEventListener("touchend", endLbSwipe);
    lbImgWrap.addEventListener("touchcancel", endLbSwipe);
}
