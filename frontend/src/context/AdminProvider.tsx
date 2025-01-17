// src/context/AdminProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

// AdminContext 타입 정의
interface AdminContextType {
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
    user: { email: string, role: string } | null;
    setUser: React.Dispatch<React.SetStateAction<{ email: string, role: string } | null>>;
    accessToken: string | null;
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

// AdminContext 생성
export const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
    const [user, setUser] = useState<{ email: string, role: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // 로컬스토리지에서 user와 accessToken을 가져옴
        const userFromStorage = localStorage.getItem("user");
        const tokenFromStorage = localStorage.getItem("accessToken");

        if (userFromStorage) {
            const userData = JSON.parse(userFromStorage);
            setUser(userData);
            setAccessToken(tokenFromStorage); // 인증 토큰 설정
        }

        // 관리자인지 여부 확인
        if (user?.role === "ADMIN") {
            setIsAdmin(true);
        }
    }, [user]);

    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin, user, setUser, accessToken, setAccessToken }}>
            {children}
        </AdminContext.Provider>
    );
};



// // src/context/AdminProvider.tsx
// import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
//
// // AdminContext 타입 정의
// interface AdminContextType {
//     isAdmin: boolean;
//     setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
//     user: { role: string } | null;
//     setUser: React.Dispatch<React.SetStateAction<{ role: string } | null>>;
// }
//
// // AdminContext 생성
// export const AdminContext = createContext<AdminContextType | undefined>(undefined);
//
// interface AdminProviderProps {
//     children: ReactNode;
// }
//
// export const AdminProvider = ({ children }: AdminProviderProps) => {
//     const [user, setUser] = useState<{ role: string } | null>(null); // user 상태 관리
//     const [isAdmin, setIsAdmin] = useState<boolean>(false);
//
//     useEffect(() => {
//         // 예시로 로컬스토리지에서 user 정보를 가져오거나, 로그인 API 등을 통해 받아옵니다.
//         // 여기서는 임의로 role을 "ADMIN"으로 설정하는 로직을 작성했습니다.
//         const userFromStorage = localStorage.getItem("user");
//         if (userFromStorage) {
//             const userData = JSON.parse(userFromStorage);
//             setUser(userData);
//         }
//
//         // 관리자인지 여부 확인
//         if (user?.role === "ADMIN") {
//             setIsAdmin(true);
//         } else {
//             setIsAdmin(true);
//         }
//     }, [user]); // user 상태 변경 시마다 실행
//
//     return (
//         <AdminContext.Provider value={{ isAdmin, setIsAdmin, user, setUser }}>
//             {children}
//         </AdminContext.Provider>
//     );
// };
