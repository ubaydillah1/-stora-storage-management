import Image from "next/image";
import React from "react";

const LogoWithName = () => {
  return (
    <div className="flex-center w-fit h-[81.06832122802734px]">
      <Image
        src="/assets/images/logo.png"
        alt="logo"
        width={100}
        height={100}
        className="h-auto"
      />
      <p className="text-white font-medium text-3xl">Stora</p>
    </div>
  );
};

export default LogoWithName;
