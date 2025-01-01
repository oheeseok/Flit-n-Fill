import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import {
  TradeRoomSimpleDto,
  TradeRoomDetailDto,
  TraderoomContextType,
} from "../interfaces/TradeRoomInterfaces";

// Context 기본 값
const ChatRoomContext = createContext<TraderoomContextType>({
  traderooms: [],
  setTraderooms: () => {},
  getTradeRoomList: async () => {},
  getTradeRoomDetail: async () => ({} as TradeRoomDetailDto),
});

// Provider 컴포넌트
export const ChatRoomProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [traderooms, setTraderooms] = useState<TradeRoomSimpleDto[]>([]);

  const getTradeRoomList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/trade", {
        withCredentials: true,
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch traderoom list");
      }
      const data: TradeRoomSimpleDto[] = response.data;
      setTraderooms(data);
      //   console.log("data: ", data);
    } catch (error) {
      console.error("Error fetching trade rooms:", error);
    }
  };

  const getTradeRoomDetail = async (
    tradeRoomId: string
  ): Promise<TradeRoomDetailDto | null> => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/trade/${tradeRoomId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch traderoom detail with tradeRoomId: ${tradeRoomId}`
        );
      }
      const data: TradeRoomDetailDto = response.data;
      return data;
    } catch (error) {
      console.error(
        `Error fetching traderoom detail with tradeRoomId: ${tradeRoomId} : ${error}`
      );
      // 400 상태 코드일 때 null 반환
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return null; // 400 오류 발생 시 null 반환
      }
      throw error; // 그 외 오류는 다시 던져서 처리
    }
  };

  // 컴포넌트가 마운트될 때 trade room 리스트를 가져옴
  useEffect(() => {
    getTradeRoomList();
  }, []);

  return (
    <ChatRoomContext.Provider
      value={{
        traderooms,
        setTraderooms,
        getTradeRoomList,
        getTradeRoomDetail,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
};

// Hook 생성
export const useChatRoom = () => useContext(ChatRoomContext);
