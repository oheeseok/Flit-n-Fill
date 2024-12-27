export interface CategoryData {
  [key: string]: {
    대분류: string;
    중분류: {
      [key: string]: {
        icon: string; // 중분류별 아이콘 경로
        소분류: {
          [key: string]: {
            id: number; // 고유 식별자
            icon: string; // 소분류별 아이콘 경로
          };
        } | null; // 소분류가 없는 경우 null
        id: number; // 중분류별 고유 ID
      };
    };
  };
}

export const CATEGORY_DATA: CategoryData = {
  식량작물: {
    대분류: "식량작물",
    중분류: {
      쌀: { id: 1, icon: "/assets/icons/1.png", 소분류: null },
      찹쌀: { id: 2, icon: "/assets/icons/1.png", 소분류: null },
      콩: { id: 3, icon: "/assets/icons/2.png", 소분류: null },
      팥: { id: 4, icon: "/assets/icons/58.png", 소분류: null },
      녹두: { id: 5, icon: "/assets/icons/2.png", 소분류: null },
      메밀: { id: 6, icon: "/assets/icons/3.png", 소분류: null },
      고구마: { id: 7, icon: "/assets/icons/59.png", 소분류: null },
      감자: { id: 8, icon: "/assets/icons/4.png", 소분류: null },
    },
  },
  채소류: {
    대분류: "채소류",
    중분류: {
      배추: { id: 9, icon: "/assets/icons/5.png", 소분류: null },
      양배추: { id: 10, icon: "/assets/icons/5.png", 소분류: null },
      알배기배추: { id: 11, icon: "/assets/icons/5.png", 소분류: null },
      브로콜리: { id: 12, icon: "/assets/icons/6.png", 소분류: null },
      시금치: { id: 13, icon: "/assets/icons/7.png", 소분류: null },
      상추: { id: 14, icon: "/assets/icons/8.png", 소분류: null },
      얼갈이배추: { id: 15, icon: "/assets/icons/5.png", 소분류: null },
      갓: { id: 16, icon: "/assets/icons/7.png", 소분류: null },
      수박: { id: 17, icon: "/assets/icons/9.png", 소분류: null },
      참외: { id: 18, icon: "/assets/icons/10.png", 소분류: null },
      오이: { id: 19, icon: "/assets/icons/11.png", 소분류: null },
      호박: { id: 20, icon: "/assets/icons/12.png", 소분류: null },
      토마토: { id: 21, icon: "/assets/icons/13.png", 소분류: null },
      딸기: { id: 22, icon: "/assets/icons/14.png", 소분류: null },
      무: { id: 23, icon: "/assets/icons/15.png", 소분류: null },
      당근: { id: 24, icon: "/assets/icons/16.png", 소분류: null },
      열무: { id: 25, icon: "/assets/icons/15.png", 소분류: null },
      건고추: { id: 26, icon: "/assets/icons/17.png", 소분류: null },
      풋고추: { id: 27, icon: "/assets/icons/17.png", 소분류: null },
      붉은고추: { id: 28, icon: "/assets/icons/17.png", 소분류: null },
      피마늘: { id: 29, icon: "/assets/icons/18.png", 소분류: null },
      깐마늘: { id: 30, icon: "/assets/icons/18.png", 소분류: null },
      양파: { id: 31, icon: "/assets/icons/19.png", 소분류: null },
      파: { id: 32, icon: "/assets/icons/20.png", 소분류: null },
      생강: { id: 33, icon: "/assets/icons/21.png", 소분류: null },
      고춧가루: { id: 34, icon: "/assets/icons/17.png", 소분류: null },
      미나리: { id: 35, icon: "/assets/icons/7.png", 소분류: null },
      깻잎: { id: 36, icon: "/assets/icons/22.png", 소분류: null },
      피망: { id: 37, icon: "/assets/icons/23.png", 소분류: null },
      파프리카: { id: 38, icon: "/assets/icons/23.png", 소분류: null },
      멜론: { id: 39, icon: "/assets/icons/24.png", 소분류: null },
      방울토마토: { id: 40, icon: "/assets/icons/13.png", 소분류: null },
    },
  },
  특용작물: {
    대분류: "특용작물",
    중분류: {
      참깨: { id: 41, icon: "/assets/icons/25.png", 소분류: null },
      들깨: { id: 42, icon: "/assets/icons/25.png", 소분류: null },
      땅콩: { id: 43, icon: "/assets/icons/26.png", 소분류: null },
      느타리버섯: { id: 44, icon: "/assets/icons/27.png", 소분류: null },
      팽이버섯: { id: 45, icon: "/assets/icons/27.png", 소분류: null },
      새송이버섯: { id: 46, icon: "/assets/icons/27.png", 소분류: null },
      호두: { id: 47, icon: "/assets/icons/28.png", 소분류: null },
      아몬드: { id: 48, icon: "/assets/icons/29.png", 소분류: null },
    },
  },
  과일류: {
    대분류: "과일류",
    중분류: {
      사과: { id: 49, icon: "../assets/icons/30.png", 소분류: null },
      배: { id: 50, icon: "/assets/icons/31.png", 소분류: null },
      복숭아: { id: 51, icon: "/assets/icons/32.png", 소분류: null },
      포도: { id: 52, icon: "/assets/icons/33.png", 소분류: null },
      감귤: { id: 53, icon: "/assets/icons/34.png", 소분류: null },
      단감: { id: 54, icon: "/assets/icons/35.png", 소분류: null },
      바나나: { id: 55, icon: "/assets/icons/36.png", 소분류: null },
      참다래: { id: 56, icon: "/assets/icons/37.png", 소분류: null },
      파인애플: { id: 57, icon: "/assets/icons/38.png", 소분류: null },
      레몬: { id: 58, icon: "/assets/icons/39.png", 소분류: null },
      체리: { id: 59, icon: "/assets/icons/40.png", 소분류: null },
      건포도: { id: 60, icon: "/assets/icons/41.png", 소분류: null },
      건블루베리: { id: 61, icon: "/assets/icons/41.png", 소분류: null },
      망고: { id: 62, icon: "/assets/icons/42.png", 소분류: null },
      아보카도: { id: 63, icon: "/assets/icons/43.png", 소분류: null },
    },
  },
  축산물: {
    대분류: "축산물",
    중분류: {
      쇠고기: {
        icon: "/assets/icons/44.png",
        소분류: {
          갈비: { id: 64, icon: "/assets/icons/44.png" },
          등심: { id: 65, icon: "/assets/icons/44.png" },
          설도: { id: 66, icon: "/assets/icons/44.png" },
          양지: { id: 67, icon: "/assets/icons/44.png" },
          안심: { id: 68, icon: "/assets/icons/44.png" },
          불고기: { id: 69, icon: "/assets/icons/44.png" },
        },
      },
      돼지고기: {
        icon: "/assets/icons/45.png",
        소분류: {
          삼겹살: { id: 70, icon: "/assets/icons/45.png" },
          목살: { id: 71, icon: "/assets/icons/45.png" },
          돼지갈비: { id: 72, icon: "/assets/icons/45.png" },
          앞다리살: { id: 73, icon: "/assets/icons/45.png" },
        },
      },
      닭고기: {
        icon: "/assets/icons/46.png",
        소분류: {
          닭고기: "/assets/icons/46.png",
          닭가슴살: "/assets/icons/46.png",
          닭다리살: "/assets/icons/46.png",
          닭발: "/assets/icons/46.png",
        },
      },
      달걀: { icon: "/assets/icons/47.png", 소분류: null },
      우유: { icon: "/assets/icons/48.png", 소분류: null },
      치즈: { icon: "/assets/icons/49.png", 소분류: null },
      버터: { icon: "/assets/icons/50.png", 소분류: null },
    },
  },
  수산물: {
    대분류: "수산물",
    중분류: {
      고등어: { icon: "/assets/icons/51.png", 소분류: null },
      갈치: { icon: "/assets/icons/51.png", 소분류: null },
      조기: { icon: "/assets/icons/51.png", 소분류: null },
      명태: { icon: "/assets/icons/51.png", 소분류: null },
      물오징어: { icon: "/assets/icons/52.png", 소분류: null },
      건멸치: { icon: "/assets/icons/51.png", 소분류: null },
      북어: { icon: "/assets/icons/51.png", 소분류: null },
      건오징어: { icon: "/assets/icons/52.png", 소분류: null },
      김: { icon: "/assets/icons/53.png", 소분류: null },
      건미역: { icon: "/assets/icons/53.png", 소분류: null },
      굴: { icon: "/assets/icons/54.png", 소분류: null },
      새우젓: { icon: "/assets/icons/55.png", 소분류: null },
      멸치액젓: { icon: "/assets/icons/55.png", 소분류: null },
      굵은소금: { icon: "/assets/icons/56.png", 소분류: null },
      꽁치: { icon: "/assets/icons/51.png", 소분류: null },
      전복: { icon: "/assets/icons/54.png", 소분류: null },
      새우: { icon: "/assets/icons/57.png", 소분류: null },
      가리비: { icon: "/assets/icons/54.png", 소분류: null },
      건다시마: { icon: "/assets/icons/53.png", 소분류: null },
      삼치: { icon: "/assets/icons/51.png", 소분류: null },
      홍합: { icon: "/assets/icons/54.png", 소분류: null },
    },
  },
};
