import ItemsWrapper from "@/features/dashboard/components/ItemsWrapper";
import NavSide from "@/features/dashboard/components/NavSide";
import React from "react";

const MyPage = async () => {
  const path = "My Files";
  return (
    <main className="flex h-screen overflow-hidden">
      <NavSide />
      <ItemsWrapper path={path} />
    </main>
  );
};

export default MyPage;
