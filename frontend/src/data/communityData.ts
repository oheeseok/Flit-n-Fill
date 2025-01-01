export interface CommunityData {
  postTitle: string;
  postContent: string;
  meetingPlace: string;
  meetingTime: string;
  postPhoto1: string | null;
  postPhoto2: string | null;
  tradeType: string;
  writerFoodId: number;
  proposerFoodListId: number;
}

export const communityData: CommunityData[] = [
  {
    postTitle: "당근 -> 버섯",
    postContent: "당근을 버섯과 교환하고 싶어요.",
    meetingPlace: "서현역 AK프라자 앞",
    meetingTime: "2024-12-17T19:20:00",
    postPhoto1: "/assets/icons/1.png",
    postPhoto2: null,
    tradeType: "EXCHANGE",
    writerFoodId: 1,
    proposerFoodListId: 2,
  },
  {
    postTitle: "계란 나눔",
    postContent: "계란 6개를 무료로 나눔합니다.",
    meetingPlace: "판교역 광장",
    meetingTime: "2024-12-18T14:00:00",
    postPhoto1: "/assets/icons/2.png",
    postPhoto2: null,
    tradeType: "SHARE",
    writerFoodId: 3,
    proposerFoodListId: 0,
  },
  {
    postTitle: "파프리카 -> 계란",
    postContent: "파프리카를 계란과 교환 원합니다.",
    meetingPlace: "분당중앙공원 입구",
    meetingTime: "2024-12-19T10:30:00",
    postPhoto1: "/assets/icons/30.png",
    postPhoto2: null,
    tradeType: "EXCHANGE",
    writerFoodId: 4,
    proposerFoodListId: 3,
  },
  {
    postTitle: "새우 나눔",
    postContent: "냉동 새우를 나눔합니다. 필요하신 분 연락주세요.",
    meetingPlace: "미금역 4번 출구",
    meetingTime: "2024-12-20T16:45:00",
    postPhoto1: "/assets/icons/13.png",
    postPhoto2: null,
    tradeType: "SHARE",
    writerFoodId: 5,
    proposerFoodListId: 0,
  },
  {
    postTitle: "고등어 -> 연어",
    postContent: "고등어를 연어로 교환 원합니다.",
    meetingPlace: "정자역 카페거리",
    meetingTime: "2024-12-21T12:15:00",
    postPhoto1: "/assets/icons/27.png",
    postPhoto2: null,
    tradeType: "EXCHANGE",
    writerFoodId: 6,
    proposerFoodListId: 7,
  },
  {
    postTitle: "김치 나눔",
    postContent: "직접 담근 김치를 나눔합니다. 맛있게 드세요!",
    meetingPlace: "이매역 1번 출구",
    meetingTime: "2024-12-22T11:00:00",
    postPhoto1: "/assets/icons/52.png",
    postPhoto2: null,
    tradeType: "SHARE",
    writerFoodId: 8,
    proposerFoodListId: 0,
  },
];
