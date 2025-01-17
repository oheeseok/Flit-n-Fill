import React, { createContext, useState, useContext, ReactNode } from "react";

interface CommunityData {
  postTitle: string;
  postContent: string;
  meetingPlace: string;
  meetingTime: string;
  postPhoto1: string | null;
  tradeType: string;
  writerFoodId: number;
  proposerFoodListId: number;
}

// interface PostSimpleDto {
//   postId: number;
//   postTitle: string;
//   postPhoto1: string;
//   tradeType: "SHARING" | "EXCHANGE";
//   postCreatedDate: Date;
//   userNickname: string;
//   userProfile: string;
//   address: string;
//   progress: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
// }

// interface PostRegisterDto {
//   postTitle: string;
//   postContent: string;
//   meetingPlace: string;
//   meetingTime: string;
//   tradeType: "SHARING" | "EXCHANGE";
//   writerFoodId: number;
//   proposerFoodListId: number;
// };

interface CommunityContextProps {
  communityData: CommunityData | null;
  setCommunityData: (data: CommunityData | null) => void;
}

const CommunityContext = createContext<CommunityContextProps | undefined>(
  undefined
);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [communityData, setCommunityData] = useState<CommunityData | null>(
    null
  );

  return (
    <CommunityContext.Provider value={{ communityData, setCommunityData }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
