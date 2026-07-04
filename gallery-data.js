/* ============================================================
   프로젝트별 갤러리 정보
   ------------------------------------------------------------
   [1] 사진 추가 (이 파일 수정 불필요 — 자동 탐색)
     projects/<슬러그>/ 폴더에 사진을 "01, 02, 03..." 순서로 넣으면
     갤러리가 자동으로 찾아서 보여줍니다.
     - 각 번호마다 .jpg / .jpeg / .png 를 자동 시도
     - 번호가 중간에 비면(예: 01,02,04) 거기서 멈춤 → 연속 번호 필수
     - 대표 사진(main)이 항상 첫 장, 그 뒤로 01, 02...가 붙음

   [2] 프로젝트 개요 채우기 (이 파일에서 직접 입력)
     갤러리 하단에 표시되는 "프로젝트 개요"입니다.
     아래 각 프로젝트의 overview 안 따옴표("") 사이에 값을 적으면 됩니다.
     - 프로젝트명은 title 값이 자동으로 쓰입니다(따로 입력 X).
     - 비워둔("") 항목은 갤러리에 표시되지 않습니다. 아는 것만 채우면 됩니다.
     예)
       overview: {
         category: "상업시설 / 인테리어",
         period: "2023.03 ~ 2024.02",
         scale: "지상 3층",
         buildingArea: "320.5㎡",
         grossFloorArea: "1,050.2㎡",
         role: "실시설계, 시공 총괄",
       },

   ● 수정 금지 항목: slug(폴더명), main(대표 이미지 파일명)
   ● title : 갤러리 상단 + 개요의 "프로젝트명" 으로 표시
   ● maps  : 지도 아이콘에 연결되는 구글 지도 주소 (없으면 "")
   ============================================================ */

const PROJECT_GALLERIES = [
  {
    slug: "adidas-dosan",
    title: "아디다스 도산 오리지널스 플래그십 스토어",
    main: "2024-Adidas-DS.PNG",
    maps: "https://maps.app.goo.gl/kLQb3S2rPLiwxqT2A",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "adidas-myeongdong",
    title: "아디다스 명동 오리지널스",
    main: "2024-Adidas-MD.PNG",
    maps: "https://maps.app.goo.gl/wdUwbHupgqgu8bTw6",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "adidas-seongsu",
    title: "아디다스 성수 오리지널스 플래그십 스토어",
    main: "2024-Adidas-SS.png",
    maps: "https://maps.app.goo.gl/uy9Epcx4sUyUFzTU7",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "hanho-artcenter",
    title: "한호 아트센터",
    main: "2024-HH-ATC.jpg",
    maps: "https://maps.app.goo.gl/mW8Yvb61kHzQ73Hq5",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "adidas-hongdae",
    title: "아디다스 홍대 브랜드센터",
    main: "2023-Adidas-HD.png",
    maps: "https://maps.app.goo.gl/vytXRt8kePyzPz6K7",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "songdo-moment",
    title: "부산 송도 모멘트캡슐",
    main: "2023-GP-SDMC.PNG",
    maps: "https://maps.app.goo.gl/Evucp1E1CSmhezcN9",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "gumdan-plaza",
    title: "검단 광장 디자인",
    main: "2022-GD.jpg",
    maps: "",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "sacheon-forest",
    title: "사천 박재삼거리 시의 숲",
    main: "2022-GP-SC.jpg",
    maps: "https://maps.app.goo.gl/kwBFM8etn4NMUhK26",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "soopdung",
    title: "숲둥숲둥",
    main: "2022-SDSD.jpg",
    maps: "",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "chowol-cafe",
    title: "초월카페 마스터플랜",
    main: "2022-CW.jpg",
    maps: "",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "hyojahun",
    title: "효자헌",
    main: "2021-HHH.jpg",
    maps: "https://maps.app.goo.gl/wPHjeDcRuHvzJSHS9",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "gonggan-ssagi",
    title: "공간 쌓기",
    main: "2021-GGSG.jpg",
    maps: "https://maps.app.goo.gl/EDspnj4RqABuyFZJ8",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "acro-seoulforest",
    title: "아크로 서울 포레스트 물과 숲 사이의 틈",
    main: "2020-Acro-MST.jpg",
    maps: "https://maps.app.goo.gl/AUEtpNuDRGG79Y1LA",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "banpo-bumunju",
    title: "반포 디에이치라클라스 부문주",
    main: "2020-BP-THEHB.jpg",
    maps: "https://maps.app.goo.gl/wy9Jya1esbggLBtu5",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "banpo-jumunju",
    title: "반포 디에이치라클라스 주문주",
    main: "2020-BP-THEHJ.jpg",
    maps: "https://maps.app.goo.gl/wy9Jya1esbggLBtu5",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "gamgye-dangsan",
    title: "감계무량 당산",
    main: "2019-GGMR-DS.jpg",
    maps: "https://maps.app.goo.gl/6rjQJHYgUCNcMGdEA",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
  {
    slug: "ilmirak-seongsu",
    title: "일미락 성수",
    main: "2017-IMR-SS.jpg",
    maps: "https://maps.app.goo.gl/gneCCs8VV1HETgCZ9",
    overview: {
      category: "",       // 분류
      period: "",         // 수행기간
      scale: "",          // 규모
      buildingArea: "",   // 건축면적
      grossFloorArea: "", // 연면적
      role: "",           // 수행업무
    },
  },
];
