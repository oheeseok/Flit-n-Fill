export interface TradeRoomSimpleDto {
  tradeRoomId: string;
  postTitle: string;
  otherUserNickname: string;
  otherUserProfile: string;
  lastMessageTime: Date;
}

export interface TradeRoomMessageDto {
  time: Date;
  userId: number;
  comment: string;
}

export interface OtherUserDto {
  userId: number;
  userNickname: string;
  userAddress: string;
  userProfile: string;
  userKindness: number;
}

export interface PostSimpleDto {
  postId: number;
  postTitle: string;
  postPhoto1: string;
  tradeType: "SHARING" | "EXCHANGE";
  postCreatedDate: Date;
  userNickname: string;
  userProfile: string;
  address: string;
  progress: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}

export interface TradeRoomDetailDto {
  tradeRoomId: string;
  tradeProgress: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  myInfo: OtherUserDto;
  otherUserInfo: OtherUserDto;
  tradeRoomMessage: TradeRoomMessageDto[];
  postInfo: PostSimpleDto;
}

export interface TraderoomContextType {
  traderooms: TradeRoomSimpleDto[];
  setTraderooms: React.Dispatch<React.SetStateAction<TradeRoomSimpleDto[]>>;
  getTradeRoomList: () => Promise<void>;
  getTradeRoomDetail: (
    tradeRoomId: string
  ) => Promise<TradeRoomDetailDto | null>;
}