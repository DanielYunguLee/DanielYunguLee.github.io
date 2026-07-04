/* ============================================================
   Branding(브랜딩) 탭 데이터
   ------------------------------------------------------------
   내가 브랜딩한 로고들을 여기에 등록합니다.

   [로고 추가 방법]
   1) 로고 이미지 파일을 이 폴더의  branding/  안에 넣습니다.
        예)  branding/오만장.png ,  branding/WIMV-01.png
        - 권장 형식: 투명 배경 PNG 또는 SVG
        - 비율은 자유(정사각·가로형·세로형 모두 자동으로 가운데 맞춤됩니다)
   2) 아래 BRANDING_ITEMS 배열에 { logo, company } 를 한 줄씩 추가합니다.
        - logo    : 로고 이미지 경로 (branding/ 부터 시작)
        - company : 로고 하단에 표시할 회사(브랜드) 이름
        - link    : (선택) 라이트박스 하단 '바로가기' 버튼 주소. 없으면 "" 로 둡니다.

   [3분할 회전(캐러셀)]
   - PC(가로)에서는 한 번에 3개씩 가로로 보입니다.
   - 로고가 3개를 넘으면 줄(행)을 늘리지 않고, 3개씩 묶어 자동으로 '돌아가며' 보여줍니다.
   - 모바일에서는 1개씩 보이며 좌우로 넘어갑니다.
   - 현재 6개 → PC에서 3개씩 2묶음이 자동 회전합니다.
   ============================================================ */

const BRANDING_ITEMS = [
  { logo: "branding/긱오만장건축사사무소.png", company: "긱오만장건축사사무소", link: "" },
  { logo: "branding/오만장.png",             company: "오만장",             link: "" },
  { logo: "branding/건축윤구소.png",          company: "건축윤구소",          link: "" },
  { logo: "branding/조형윤구소.png",          company: "조형윤구소",          link: "" },
  { logo: "branding/WIMV-01.png",           company: "WIMV",              link: "" },
  { logo: "branding/WIMV-02.png",           company: "WIMV",              link: "" },
];
