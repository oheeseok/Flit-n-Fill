// src/context/GlobalProvider.tsx
import React from "react";
import { RecipeProvider } from "./RecipeContext";
// import { FridgeProvider } from "./FridgeContext";
// import { CommunityProvider } from "./CommunityContext";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecipeProvider>
      {children}
      {/* <FridgeProvider>
        <CommunityProvider>{children}</CommunityProvider>
      </FridgeProvider> */}
    </RecipeProvider>
  );
};
