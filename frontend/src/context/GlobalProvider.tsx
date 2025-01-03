// src/context/GlobalProvider.tsx
import React from "react";
import { RecipeProvider } from "./RecipeContext";
import { FridgeProvider } from "./FridgeContext";
import { CommunityProvider } from "./CommunityContext";
import { UserProvider } from "./UserContext";
import { ChatRoomProvider } from "./ChatRoomContext";
import { NotificationProvider } from "./NotificationContext";
import { SSEProvider } from "./SSEContext";
import { ToastProvider } from "./ToastContext";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <NotificationProvider>
        <ToastProvider>
          <SSEProvider>
            <RecipeProvider>
              <FridgeProvider>
                <CommunityProvider>
                  <ChatRoomProvider>{children}</ChatRoomProvider>
                </CommunityProvider>
              </FridgeProvider>
            </RecipeProvider>
          </SSEProvider>
        </ToastProvider>
      </NotificationProvider>
    </UserProvider>
  );
};
