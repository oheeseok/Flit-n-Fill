export interface CategoryData {
  [key: string]: {
    대분류: string;
    중분류: {
      [key: string]: {
        icon: string; // 중분류별 아이콘 경로
        소분류: {
          [key: string]: string; // 소분류별 아이콘 경로
        } | null; // 소분류가 없는 경우 null
      };
    };
  };
}

export const CATEGORY_DATA: CategoryData = {
  식량작물: {
    대분류: "식량작물",
    중분류: {
      쌀: { icon: "/assets/icons/1.png", 소분류: null },
      찹쌀: { icon: "/assets/icons/1.png", 소분류: null },
      콩: { icon: "/assets/icons/2.png", 소분류: null },
      팥: { icon: "/assets/icons/58.png", 소분류: null },
      녹두: { icon: "/assets/icons/2.png", 소분류: null },
      메밀: { icon: "/assets/icons/3.png", 소분류: null },
      고구마: { icon: "/assets/icons/59.png", 소분류: null },
      감자: { icon: "/assets/icons/4.png", 소분류: null },
    },
  },
  채소류: {
    대분류: "채소류",
    중분류: {
      배추: { icon: "/assets/icons/5-2.png", 소분류: null },
      양배추: { icon: "/assets/icons/5-1.png", 소분류: null },
      알배기배추: { icon: "/assets/icons/5-2.png", 소분류: null },
      브로콜리: { icon: "/assets/icons/6.png", 소분류: null },
      시금치: { icon: "/assets/icons/7.png", 소분류: null },
      상추: { icon: "/assets/icons/8.png", 소분류: null },
      얼갈이배추: { icon: "/assets/icons/5.png", 소분류: null },
      갓: { icon: "/assets/icons/7.png", 소분류: null },
      수박: { icon: "/assets/icons/9.png", 소분류: null },
      참외: { icon: "/assets/icons/10.png", 소분류: null },
      오이: { icon: "/assets/icons/11.png", 소분류: null },
      호박: { icon: "/assets/icons/12.png", 소분류: null },
      토마토: { icon: "/assets/icons/13.png", 소분류: null },
      딸기: { icon: "/assets/icons/14.png", 소분류: null },
      무: { icon: "/assets/icons/15.png", 소분류: null },
      당근: { icon: "/assets/icons/16.png", 소분류: null },
      열무: { icon: "/assets/icons/15.png", 소분류: null },
      건고추: { icon: "/assets/icons/17.png", 소분류: null },
      풋고추: { icon: "/assets/icons/17.png", 소분류: null },
      붉은고추: { icon: "/assets/icons/17.png", 소분류: null },
      피마늘: { icon: "/assets/icons/18.png", 소분류: null },
      깐마늘: { icon: "/assets/icons/18.png", 소분류: null },
      양파: { icon: "/assets/icons/19.png", 소분류: null },
      파: { icon: "/assets/icons/20.png", 소분류: null },
      생강: { icon: "/assets/icons/21.png", 소분류: null },
      고춧가루: { icon: "/assets/icons/17.png", 소분류: null },
      미나리: { icon: "/assets/icons/7.png", 소분류: null },
      깻잎: { icon: "/assets/icons/22.png", 소분류: null },
      피망: { icon: "/assets/icons/23.png", 소분류: null },
      파프리카: { icon: "/assets/icons/23.png", 소분류: null },
      멜론: { icon: "/assets/icons/24.png", 소분류: null },
      방울토마토: { icon: "/assets/icons/13.png", 소분류: null },
    },
  },
  특용작물: {
    대분류: "특용작물",
    중분류: {
      참깨: { icon: "/assets/icons/25.png", 소분류: null },
      들깨: { icon: "/assets/icons/25.png", 소분류: null },
      땅콩: { icon: "/assets/icons/26.png", 소분류: null },
      느타리버섯: { icon: "/assets/icons/27.png", 소분류: null },
      팽이버섯: { icon: "/assets/icons/27.png", 소분류: null },
      새송이버섯: { icon: "/assets/icons/27.png", 소분류: null },
      호두: { icon: "/assets/icons/28.png", 소분류: null },
      아몬드: { icon: "/assets/icons/29.png", 소분류: null },
    },
  },
  과일류: {
    대분류: "과일류",
    중분류: {
      사과: { icon: "../assets/icons/30.png", 소분류: null },
      배: { icon: "/assets/icons/31.png", 소분류: null },
      복숭아: { icon: "/assets/icons/32.png", 소분류: null },
      포도: { icon: "/assets/icons/33.png", 소분류: null },
      감귤: { icon: "/assets/icons/34.png", 소분류: null },
      단감: { icon: "/assets/icons/35.png", 소분류: null },
      바나나: { icon: "/assets/icons/36.png", 소분류: null },
      참다래: { icon: "/assets/icons/37.png", 소분류: null },
      파인애플: { icon: "/assets/icons/38.png", 소분류: null },
      레몬: { icon: "/assets/icons/39.png", 소분류: null },
      체리: { icon: "/assets/icons/40.png", 소분류: null },
      건포도: { icon: "/assets/icons/41.png", 소분류: null },
      건블루베리: { icon: "/assets/icons/41.png", 소분류: null },
      망고: { icon: "/assets/icons/42.png", 소분류: null },
      아보카도: { icon: "/assets/icons/43.png", 소분류: null },
    },
  },
  축산물: {
    대분류: "축산물",
    중분류: {
      쇠고기: {
        icon: "/assets/icons/44.png",
        소분류: {
          갈비: "/assets/icons/44.png",
          등심: "/assets/icons/44.png",
          설도: "/assets/icons/44.png",
          양지: "/assets/icons/44.png",
          안심: "/assets/icons/44.png",
          불고기: "/assets/icons/44.png",
        },
      },
      돼지고기: {
        icon: "/assets/icons/45.png",
        소분류: {
          삼겹살: "/assets/icons/45.png",
          목살: "/assets/icons/45.png",
          돼지갈비: "/assets/icons/45.png",
          앞다리살: "/assets/icons/45.png",
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
