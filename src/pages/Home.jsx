import React from "react";

export default function Home() {
  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(to top right, #FFBFCA, #FFE7EB)",
      }}
    >
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
        Welcome to AirForms
      </h1>
    </div>
  );
}
