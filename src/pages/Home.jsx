import React from "react";

export default function Home() {
  return (
    <div
      className="w-screen h-screen flex items-start justify-center pt-24 sm:pt-32"
      style={{
        background: "linear-gradient(to top right, #FFBFCA, #FFE7EB)",
      }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#FA1239] text-center drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] leading-tight">
        Build & Manage Forms Effortlessly
      </h1>
    </div>
  );
}

