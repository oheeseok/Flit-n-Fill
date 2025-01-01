// src/context/GlobalProvider.tsx
import React from "react";
import { RecipeProvider } from "./RecipeContext";
import { FridgeProvider } from "./FridgeContext";
import { CommunityProvider } from "./CommunityContext";
import { UserProvider } from "./UserContext";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <RecipeProvider>
        <FridgeProvider>
          <CommunityProvider>{children}</CommunityProvider>
        </FridgeProvider>
      </RecipeProvider>
    </UserProvider>
  );
};
