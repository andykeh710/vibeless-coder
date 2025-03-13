import React, { useState } from "react";
import { useAutomation } from "@/context/AutomationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_TEMPLATES = [
  { value: "help", label: "Help me understand this code", content: "Help me understand what this code is doing." },
  { value: "optimize", label: "Optimize this function", content: "Help me optimize this function for better performance." },
  { value: "refactor", label: "Refactor this code", content: "Refactor this code to improve readability and maintainability." },
  { value: "test", label: "Generate unit tests", content: "Generate comprehensive unit tests for this code." },
  { value: "explain", label: "Explain this error", content: "Explain why I'm getting this error and how to fix it." }
];

const MessageSettings: React.FC = () => {
  const { state, setMessageText } = useAutomation();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);
    
    if (value) {
      const template = DEFAULT_TEMPLATES.find(t => t.value === value);
      if (template) {
        setMessageText(template.content);
      }
    }
  };

  const handleSaveAsTemplate = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      // In a real app, this would save the template to the backend
      alert(`Template "${newTemplateName}" saved with content: ${state.messageText}`);
      setNewTemplateName("");
      setSaveDialogOpen(false);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-[#3D3D3D]">
      <h3 className="font-semibold mb-2">Message Configuration</h3>
      
      <div className="mb-3">
        <label htmlFor="messageText" className="block text-sm mb-1">Message Text</label>
        <textarea 
          id="messageText" 
          rows={4}
          value={state.messageText}
          onChange={handleMessageChange}
          className="w-full bg-[#1F1F1F] border border-[#3D3D3D] rounded px-2 py-1 text-sm resize-none font-mono focus:border-[#007ACC] focus:outline-none"
        />
        <p className="text-xs text-[#D4D4D4] opacity-70 mt-1">
          This message will be inserted at the cursor position
        </p>
      </div>
      
      <div className="mb-3">
        <label htmlFor="templateSelect" className="block text-sm mb-1">Quick Templates</label>
        <select 
          id="templateSelect"
          value={selectedTemplate}
          onChange={handleTemplateSelect}
          className="w-full bg-[#1F1F1F] border border-[#3D3D3D] rounded px-2 py-1 text-sm focus:border-[#007ACC] focus:outline-none"
        >
          <option value="">-- Select a template --</option>
          {DEFAULT_TEMPLATES.map((template) => (
            <option key={template.value} value={template.value}>{template.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <button 
          className="px-3 py-1 bg-[#007ACC] hover:bg-opacity-90 rounded text-white text-sm focus:outline-none"
          onClick={handleSaveAsTemplate}
        >
          Save Current as Template
        </button>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="bg-[#2D2D2D] border border-[#3D3D3D] text-[#D4D4D4]">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="templateName" className="block text-sm mb-1">Template Name</label>
            <Input
              id="templateName"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="bg-[#1F1F1F] border-[#3D3D3D] text-[#D4D4D4]"
              placeholder="Enter template name"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setSaveDialogOpen(false)}
              className="bg-[#1F1F1F] hover:bg-[#2A2D2E] text-[#D4D4D4]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTemplate}
              className="bg-[#007ACC] hover:bg-opacity-90 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageSettings;
