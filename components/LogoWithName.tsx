import Image from "next/image";
import React from "react";

const LogoWithName = ({ className = "text-white" }: { className?: string }) => {
  return (
    <div className="flex-center w-fit h-[81.06832122802734px]">
      <div className="relative w-[85px] aspect-square">
        <Image src="/assets/images/logo.png" alt="logo" fill />
      </div>
      <p className={`font-medium text-3xl ${className}`}>Stora</p>
    </div>
  );
};

export default LogoWithName;
