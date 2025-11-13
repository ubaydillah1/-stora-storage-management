import ItemsWrapper from "@/features/dashboard/components/ItemsWrapper";
import NavSide from "@/features/dashboard/components/NavSide";
import React from "react";

const ItemsPage = async ({ params }: { params: Promise<{ id: string[] }> }) => {
  const ids = (await params).id;

  const parentId = ids.length > 0 ? ids[ids.length - 1] : null;
  const path = ids;

  return (
    <main className="flex h-screen overflow-hidden">
      <NavSide />
      <ItemsWrapper parentId={parentId} path={path} />
    </main>
  );
};

export default ItemsPage;
