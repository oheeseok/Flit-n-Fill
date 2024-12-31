// enums.ts
export enum FoodUnit {
    KG = "kg",
    G = "g",
    L = "L",
    ML = "mL",
    PIECE = "개",
}

export enum FoodStorage {
    ROOM_TEMPERATURE = "실온",
    FROZEN = "냉동",
    REFRIGERATED = "냉장",
}

export enum AuthProvider {
    LOCAL = "일반가입",
    GOOGLE = "google",
    KAKAO = "kakao",
}

export enum FoodCategory {
    INGREDIENT = "재료",
    COOKED = "완제품",
}

export enum KindnessType {
    GREAT = "좋아요",
    BAD = "별로예요",
}

export enum Notification {
    EXPIRATION = "소비기한",
    TRADE_REQUEST ="교환 요청",
    SHARE_REQUEST = "나눔 요청",
    TRADE_REQUEST_RESULT = "교환 요청 결과",
    SHARE_REQUEST_RESULT = "나눔 요청 결과",
    TRADE_CANCEL = "교환 취소",
    SHARE_CANCEL = "나눔 취소",
    FOOD_REQUEST_RESULT = "재료 추가 요청 결과",
    REPORT_AGAINST_ME = "신고 당함",
    REPORT_RESULT = "신고 결과",
    NEW_COMMENT = "새 댓글",
    LEVEL_CHANGE = "레벨 변동",
}

export enum Progress {
    PENDING= "대기",
    IN_PROGRESS = "진행중",
    COMPLETED = "완료",
    CANCELED = "취소",
}

export enum RequestType {
    ADD_FOOD = "재료 추가",
    REPORT = "신고",
}

export enum TaskStatus {
    PENDING = "대기",
    ACCEPTED = "수락",
    DENIED = "거절",
}

export enum TradeType {
    SHARING = "나눔",
    EXCHANGE = "교환",
}

export enum EnumAttributes {
    // Unit
    KG = "kg",
    G = "g",
    L = "L",
    ML = "mL",
    PIECE = "개",

    // Storage
    ROOM_TEMPERATURE = "실온",
    FROZEN = "냉동",
    REFRIGERATED = "냉장",

    // AuthProvider
    LOCAL = "일반가입",
    GOOGLE = "google",
    KAKAO = "kakao",

    // FoodCategory
    INGREDIENT = "재료",
    COOKED = "완제품",

    // KindnessType
    GREAT = "좋아요",
    BAD = "별로예요",

    // Notification
    EXPIRATION = "소비기한",
    TRADE_REQUEST ="교환 요청",
    SHARE_REQUEST = "나눔 요청",
    TRADE_REQUEST_RESULT = "교환 요청 결과",
    SHARE_REQUEST_RESULT = "나눔 요청 결과",
    TRADE_CANCEL = "교환 취소",
    SHARE_CANCEL = "나눔 취소",
    FOOD_REQUEST_RESULT = "재료 추가 요청 결과",
    REPORT_AGAINST_ME = "신고 당함",
    REPORT_RESULT = "신고 결과",
    NEW_COMMENT = "새 댓글",
    LEVEL_CHANGE = "레벨 변동",

    // Progress
    PENDING= "대기",
    IN_PROGRESS = "진행중",
    COMPLETED = "완료",
    CANCELED = "취소",

    // RequestType
    ADD_FOOD = "재료 추가",
    REPORT = "신고",

    // TaskStatus
    // PENDING 은 Progress 와 공유
    ACCEPTED = "수락",
    DENIED = "거잘",

    // TradeType
    SHARING = "나눔",
    EXCHANGE = "교환",
}

// description -> Enum 변환
export const fromDescriptionToEnum = (
    description: string,
    type: "unit" | "storage" | "auth" | "category" | "kindness" | "notification" | "progress" | "request" | "task" | "trade"
): FoodUnit | FoodStorage | AuthProvider| FoodCategory | KindnessType |
    Notification | Progress | RequestType | TaskStatus | TradeType | null => {
    switch (type) {
        case "unit":
            return Object.entries(FoodUnit).find(([_, value]) => value === description)?.[0] as FoodUnit || null;
        case "storage":
            return Object.entries(FoodStorage).find(([_, value]) => value === description)?.[0] as FoodStorage || null;
        case "auth":
            return Object.entries(AuthProvider).find(([_, value]) => value === description)?.[0] as AuthProvider || null;
        case "category":
            return Object.entries(FoodCategory).find(([_, value]) => value === description)?.[0] as FoodCategory || null;
        case "kindness":
            return Object.entries(KindnessType).find(([_, value]) => value === description)?.[0] as KindnessType || null;
        case "notification":
            return Object.entries(Notification).find(([_, value]) => value === description)?.[0] as Notification || null;
        case "progress":
            return Object.entries(Progress).find(([_, value]) => value === description)?.[0] as Progress || null;
        case "request":
            return Object.entries(RequestType).find(([_, value]) => value === description)?.[0] as RequestType || null;
        case "task":
            return Object.entries(TaskStatus).find(([_, value]) => value === description)?.[0] as TaskStatus || null;
        case "trade":
            return Object.entries(TradeType).find(([_, value]) => value === description)?.[0] as TradeType || null;
        default: return null;
    }
}

// Enum -> description 변환
export const fromEnumToDescription = (value: string): string => {
    // Enum의 value를 탐색하여 해당 값을 반환
    const found = Object.entries(EnumAttributes).find(([v,]) => v === value);

    // 찾은 결과가 없을 경우 경고 출력 후 원래 값 반환
    if (!found) {
        console.warn(`No matching description found for value: ${value}`);
        return value; // value 그대로 반환
    }

    return found[1];
};