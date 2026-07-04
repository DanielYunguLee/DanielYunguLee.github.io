document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".section-nav a");
    const sections = document.querySelectorAll("section");

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the top part of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach((link) => link.classList.remove("active"));

                // Add active class to corresponding link
                const id = entry.target.getAttribute("id");
                const activeLink = document.querySelector(`.section-nav a[href="#${id}"]`);

                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }, observerOptions);

    sections.forEach((section) => {
        observer.observe(section);
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sectionNav = document.querySelector('.section-nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sectionNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active'); // Animate Hamburger
        });

        // Close menu when a link is clicked
        const navLinks = sectionNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sectionNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active'); // Reset Hamburger
            });
        });
    }

    // Accordion Logic for Mobile
    const accordionHeaders = document.querySelectorAll('.content-section h2');
    accordionHeaders.forEach(header => {
        // Skip Gallery from Accordion Logic
        if (header.parentElement.id === 'gallery') return;

        header.addEventListener('click', () => {
            // Only enable click toggle on mobile (아코디언 CSS 브레이크포인트와 동일하게 768px로 정렬)
            if (window.innerWidth <= 768) {
                const parent = header.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    // ============================================================
    // Project Photo Gallery (Lightbox)
    // gallery-data.js 의 PROJECT_GALLERIES 를 사용해
    //  - View 탭: 사진 클릭 → 갤러리 오버레이
    //  - Projects 탭: 프로젝트명 클릭 → 갤러리 오버레이
    //  - 기존 구글 지도 링크는 이름/사진 옆 지도 아이콘으로 이관
    // ============================================================
    initProjectGalleries();
});

function initProjectGalleries() {
    if (typeof PROJECT_GALLERIES === "undefined" || !Array.isArray(PROJECT_GALLERIES)) return;

    const normalize = (s) => (s || "").replace(/\s+/g, "").trim();
    const baseName = (path) => (path || "").split("/").pop();

    // 조회용 인덱스
    const byMain = new Map();   // 대표이미지 파일명 → project
    const byTitle = new Map();  // 정규화된 제목 → project
    PROJECT_GALLERIES.forEach((p) => {
        if (p.main) byMain.set(baseName(p.main), p);
        if (p.title) byTitle.set(normalize(p.title), p);
    });

    function findByMapUrl(url) {
        if (!url) return null;
        return PROJECT_GALLERIES.find((p) => p.maps && p.maps === url) || null;
    }

    // ---------- Lightbox DOM ----------
    const lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML = `
        <div class="lightbox-backdrop" data-close></div>
        <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="프로젝트 갤러리">
            <button class="lb-close" data-close type="button" aria-label="닫기"><i class="fas fa-xmark"></i></button>
            <button class="lb-prev" type="button" aria-label="이전 사진"><i class="fas fa-chevron-left"></i></button>
            <div class="lb-stage">
                <figure class="lb-figure">
                    <img class="lb-img" src="" alt="">
                    <figcaption class="lb-caption">
                        <span class="lb-counter"></span>
                        <span class="lb-hint"><i class="fas fa-arrows-left-right"></i> 좌우로 밀어 넘기기</span>
                    </figcaption>
                </figure>
                <div class="lb-overview" aria-live="polite"></div>
            </div>
            <button class="lb-next" type="button" aria-label="다음 사진"><i class="fas fa-chevron-right"></i></button>
        </div>`;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector(".lb-img");
    const lbFigure = lb.querySelector(".lb-figure");
    const lbCounter = lb.querySelector(".lb-counter");
    const lbHint = lb.querySelector(".lb-hint");
    const lbOverview = lb.querySelector(".lb-overview");
    const btnPrev = lb.querySelector(".lb-prev");
    const btnNext = lb.querySelector(".lb-next");

    let curImages = [];
    let curIndex = 0;
    let curTitle = "";
    let curProject = null;   // 현재 열린 프로젝트 (개요 표시용)
    let animating = false;   // 사진 전환 애니메이션 진행 중 여부
    let openToken = 0; // 갤러리를 다시 열 때마다 증가 → 이전 프로젝트의 자동 탐색 결과가 섞이지 않도록

    const escapeHtml = (s) =>
        String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    // 카운터·안내·좌우버튼 등 사진 외 정보 갱신 (transform 은 건드리지 않음)
    function drawInfo() {
        const multi = curImages.length > 1;
        lbCounter.textContent = multi ? (curIndex + 1) + " / " + curImages.length : "";
        btnPrev.style.display = multi ? "" : "none";
        btnNext.style.display = multi ? "" : "none";
        // 스와이프 안내는 사진이 2장 이상일 때만 (표시 여부는 CSS가 모바일에서만 노출)
        lbHint.style.display = multi ? "" : "none";
    }

    // 갤러리 하단 프로젝트 개요 렌더링 (값이 있는 항목만 표시)
    function renderOverview() {
        const p = curProject;
        const ov = (p && p.overview) || {};
        const rows = [
            ["프로젝트명", (p && p.title) || ""],
            ["분류", ov.category],
            ["수행기간", ov.period],
            ["규모", ov.scale],
            ["건축면적", ov.buildingArea],
            ["연면적", ov.grossFloorArea],
            ["수행업무", ov.role],
        ].filter(([, v]) => v && String(v).trim());

        if (!rows.length) {
            lbOverview.style.display = "none";
            lbOverview.innerHTML = "";
            return;
        }
        lbOverview.innerHTML =
            '<h3 class="lb-ov-title">프로젝트 개요</h3>' +
            '<dl class="lb-ov-list">' +
            rows.map(([k, v]) =>
                `<div class="lb-ov-row"><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`
            ).join("") +
            '</dl>';
        lbOverview.style.display = "";
    }

    // 애니메이션 없이 현재 사진을 그대로 그림 (열기·자동탐색 갱신용)
    function render() {
        if (!curImages.length) return;
        // 스와이프 도중 남은 이동/투명도 흔적을 초기화 (사진 교체 시 항상 중앙·불투명)
        lbImg.style.transition = "none";
        lbImg.style.transform = "";
        lbImg.style.opacity = "";
        lbImg.src = curImages[curIndex];
        lbImg.alt = curTitle + " 사진 " + (curIndex + 1);
        drawInfo();
    }

    // 한 장의 이미지가 실제로 존재하는지 확인 (폴더 목록을 읽을 수 없으므로 직접 로드해봄)
    function probeImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    // projects/<slug>/ 폴더에서 01, 02, 03... 순서로 사진을 자동 탐색해 갤러리에 채운다.
    //  - 각 번호마다 .jpg → .jpeg → .png → .webp (대문자 포함) 순으로 시도하고, 하나라도 있으면 채택
    //  - 특정 번호를 못 찾으면(결번·미지원) 건너뛰고 다음 번호를 계속 탐색
    //  - 다만 연속으로 MISS_LIMIT 개가 비면 사진이 끝난 것으로 보고 종료
    async function discoverImages(project, token) {
        if (!project || !project.slug) return;
        // jpg/jpeg/png/webp 모두 인식 (대·소문자 포함). 브라우저가 표시 못하는 파일은 자동으로 건너뜀.
        const exts = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
        const MAX = 40;         // 안전장치: 한 프로젝트당 최대 40번까지 탐색
        const MISS_LIMIT = 3;   // 연속으로 이 개수만큼 비면 사진 목록이 끝난 것으로 판단하고 종료
        let consecutiveMiss = 0;
        for (let n = 1; n <= MAX; n++) {
            const num = String(n).padStart(2, "0"); // 1 → "01"
            let hit = null;
            for (const ext of exts) {
                if (token !== openToken) return; // 그 사이 다른 갤러리를 열었으면 중단
                const url = `projects/${project.slug}/${num}.${ext}`;
                if (await probeImage(url)) { hit = url; break; }
            }
            if (token !== openToken) return;
            if (!hit) {
                // 이 번호를 못 찾음(결번 또는 브라우저 미지원 파일) → 건너뛰고 다음 번호 계속 탐색.
                // 단, 연속으로 여러 개가 비면 사진이 끝난 것으로 보고 종료한다.
                if (++consecutiveMiss >= MISS_LIMIT) break;
                continue;
            }
            consecutiveMiss = 0;
            curImages.push(hit);
            render();                   // 카운터/좌우버튼 갱신
        }
    }

    function open(project) {
        if (!project) return;
        const token = ++openToken;
        curProject = project;
        curTitle = project.title || "";
        curIndex = 0;
        animating = false;
        // 대표 사진(main)을 먼저 보여주고, 나머지는 폴더에서 자동으로 붙인다.
        curImages = project.main ? [project.main] : [];
        render();
        renderOverview();
        lb.classList.add("open");
        lb.setAttribute("aria-hidden", "false");
        document.body.classList.add("lb-lock");
        discoverImages(project, token); // 비동기: 추가 사진을 찾는 대로 갤러리에 채워짐
    }

    function close() {
        lb.classList.remove("open");
        lb.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lb-lock");
        lbImg.src = "";
    }

    // 사진을 부드럽게 슬라이드하며 전환 (데스크톱 버튼·키보드·모바일 스와이프 공통)
    const SLIDE_MS = 340; // 전환 속도(ms). 값이 클수록 더 천천히 넘어감
    function step(dir) {
        if (curImages.length < 2 || animating) return;
        animating = true;
        const dist = (lbImg.clientWidth || lbFigure.clientWidth || 320) * 1.05;

        // 1) 현재 사진을 진행 방향으로 서서히 밀어내며 흐리게
        lbImg.style.transition = `transform ${SLIDE_MS}ms ease, opacity ${SLIDE_MS}ms ease`;
        lbImg.style.transform = `translateX(${dir > 0 ? -dist : dist}px)`;
        lbImg.style.opacity = "0";

        let swapped = false;
        const swap = () => {
            if (swapped) return;
            swapped = true;
            lbImg.removeEventListener("transitionend", swap);

            // 2) 다음 사진을 반대편에 미리 놓고(애니메이션 없이)
            curIndex = (curIndex + dir + curImages.length) % curImages.length;
            lbImg.style.transition = "none";
            lbImg.style.transform = `translateX(${dir > 0 ? dist : -dist}px)`;
            lbImg.style.opacity = "0";
            lbImg.src = curImages[curIndex];
            lbImg.alt = curTitle + " 사진 " + (curIndex + 1);
            drawInfo();

            // 3) 강제 리플로우 후 중앙으로 서서히 들어오게
            void lbImg.offsetWidth;
            lbImg.style.transition = `transform ${SLIDE_MS}ms ease, opacity ${SLIDE_MS}ms ease`;
            lbImg.style.transform = "translateX(0)";
            lbImg.style.opacity = "1";

            let settled = false;
            const settle = () => {
                if (settled) return;
                settled = true;
                lbImg.removeEventListener("transitionend", settle);
                animating = false;
            };
            lbImg.addEventListener("transitionend", settle);
            setTimeout(settle, SLIDE_MS + 80); // transitionend 누락 대비 안전장치
        };
        lbImg.addEventListener("transitionend", swap);
        setTimeout(swap, SLIDE_MS + 80); // transitionend 누락 대비 안전장치
    }

    btnPrev.addEventListener("click", () => step(-1));
    btnNext.addEventListener("click", () => step(1));
    lb.querySelectorAll("[data-close]").forEach((el) =>
        el.addEventListener("click", close)
    );
    document.addEventListener("keydown", (e) => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
    });

    // ---------- 모바일 터치 스와이프 (좌우로 밀어 사진 넘기기) ----------
    let touchStartX = 0, touchStartY = 0, touchDX = 0, swiping = false;
    const SWIPE_THRESHOLD = 55; // 이 정도(px) 이상 가로로 밀어야 넘김으로 인정 (실수 방지)

    lbFigure.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDX = 0;
        swiping = true;
        lbImg.style.transition = "none"; // 손가락을 즉시 따라오도록 애니메이션 끔
    }, { passive: true });

    lbFigure.addEventListener("touchmove", (e) => {
        if (!swiping || animating || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        // 세로 이동이 더 크면 스크롤 의도로 보고 스와이프 취소
        if (Math.abs(dy) > Math.abs(dx)) {
            swiping = false;
            lbImg.style.transition = "transform .25s ease, opacity .25s ease";
            lbImg.style.transform = "";
            lbImg.style.opacity = "";
            return;
        }
        touchDX = dx;
        e.preventDefault(); // 가로 스와이프 중 브라우저 뒤로가기 제스처 등 차단
        if (curImages.length > 1) {
            // 손가락을 따라 부드럽게(감쇠) 움직여 과민하게 튀지 않도록
            lbImg.style.transform = `translateX(${dx}px)`;
            lbImg.style.opacity = String(Math.max(0.55, 1 - Math.abs(dx) / 600));
        }
    }, { passive: false });

    function endSwipe() {
        if (!swiping) return;
        swiping = false;
        if (curImages.length > 1 && Math.abs(touchDX) >= SWIPE_THRESHOLD) {
            // 왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전 → 현재 위치에서 이어서 슬라이드
            step(touchDX < 0 ? 1 : -1);
        } else {
            // 밀기가 부족하면 스르륵 제자리로 복귀
            lbImg.style.transition = "transform .25s ease, opacity .25s ease";
            lbImg.style.transform = "";
            lbImg.style.opacity = "";
        }
    }
    lbFigure.addEventListener("touchend", endSwipe);
    lbFigure.addEventListener("touchcancel", endSwipe);

    // ---------- 지도 아이콘 생성 ----------
    function makeMapIcon(url) {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "map-link";
        a.title = "구글 지도에서 보기";
        a.setAttribute("aria-label", "구글 지도에서 보기");
        a.innerHTML = '<i class="fas fa-location-dot"></i>';
        // 지도 아이콘 클릭은 갤러리 열기로 전파되지 않도록 차단
        a.addEventListener("click", (e) => e.stopPropagation());
        return a;
    }

    // ============================================================
    // View 탭 (#gallery .project-item) 배선
    // ============================================================
    document.querySelectorAll("#gallery .project-item").forEach((item) => {
        const imgEl = item.querySelector(".project-img");
        if (!imgEl) return;
        const bg = imgEl.style.backgroundImage || "";
        const m = bg.match(/url\(["']?([^"')]+)["']?\)/i);
        if (!m) return;
        const file = baseName(m[1]);
        const project = byMain.get(file);
        if (!project) return;

        // 기존 <a href="지도"> 를 갤러리 트리거로 전환 (중첩 <a> 방지 위해 div로 치환)
        const trigger = document.createElement("div");
        trigger.className = item.className; // .project-item 유지
        trigger.setAttribute("role", "button");
        trigger.setAttribute("tabindex", "0");
        trigger.setAttribute("aria-label", project.title + " 사진 갤러리 열기");
        trigger.innerHTML = item.innerHTML;
        trigger.style.cursor = "pointer";

        trigger.addEventListener("click", () => open(project));
        trigger.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(project);
            }
        });

        // 지도 아이콘을 카드 이미지 위에 배치
        if (project.maps) {
            const badge = makeMapIcon(project.maps);
            badge.classList.add("map-badge");
            const content = trigger.querySelector(".project-content") || trigger;
            content.appendChild(badge);
        }

        item.replaceWith(trigger);
    });

    // ============================================================
    // Projects 탭 (#projects-list .details) 배선
    // ============================================================
    document.querySelectorAll("#projects-list .entry .details").forEach((details) => {
        const anchor = details.querySelector("a.project-link");

        if (anchor) {
            // 이름 텍스트 → 갤러리 트리거, 기존 지도링크 → 아이콘
            const name = anchor.textContent.replace(/\s+/g, " ").trim();
            const project =
                byTitle.get(normalize(name)) ||
                findByMapUrl(anchor.getAttribute("href"));

            // 지도 URL은 gallery-data.js(project.maps)를 단일 출처로 사용하고,
            // 데이터에 없을 때만 원본 앵커 href로 폴백 (Projects·View 핀 링크 일치 보장)
            const mapsUrl = (project && project.maps) ? project.maps : anchor.getAttribute("href");
            const span = document.createElement("span");
            span.className = "project-link gallery-trigger";
            span.setAttribute("role", "button");
            span.setAttribute("tabindex", "0");
            span.textContent = anchor.textContent;

            if (project) {
                span.addEventListener("click", () => open(project));
                span.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        open(project);
                    }
                });
            }
            anchor.replaceWith(span);
            if (mapsUrl && mapsUrl !== "#") {
                span.after(makeMapIcon(mapsUrl));
            }
        } else {
            // 지도 링크가 없던 프로젝트(검단/숲둥/초월 등): 첫 텍스트를 트리거로
            const walker = document.createTreeWalker(details, NodeFilter.SHOW_TEXT, null);
            let node = walker.nextNode();
            while (node && !node.textContent.trim()) node = walker.nextNode();
            if (!node) return;
            const name = node.textContent.replace(/\s+/g, " ").trim();
            const project = byTitle.get(normalize(name));
            if (!project) return;

            const span = document.createElement("span");
            span.className = "project-link gallery-trigger";
            span.setAttribute("role", "button");
            span.setAttribute("tabindex", "0");
            span.textContent = name;
            span.addEventListener("click", () => open(project));
            span.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(project);
                }
            });
            node.replaceWith(span);
            if (project.maps) span.after(makeMapIcon(project.maps));
        }
    });
}
