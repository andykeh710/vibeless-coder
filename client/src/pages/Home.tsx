import React from "react";
import Sidebar from "@/components/Sidebar";
import SettingsPanel from "@/components/SettingsPanel";
import EditorPreview from "@/pages/EditorPreview";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#252526] text-[#D4D4D4] font-mono text-sm">
      <Sidebar />
      <SettingsPanel />
      <EditorPreview />
    </div>
  );
};

export default Home;
