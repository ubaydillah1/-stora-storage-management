import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="select-none">{children}</div>;
};

export default Layout;
