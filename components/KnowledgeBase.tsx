import React, { useCallback, useState } from 'react';
import { KnowledgeDoc } from '../types';

interface KnowledgeBaseProps {
  docs: KnowledgeDoc[];
  onAddDoc: (doc: KnowledgeDoc) => void;
  systemInstruction: string;
  onUpdateSystemInstruction: (instruction: string) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ docs, onAddDoc, systemInstruction, onUpdateSystemInstruction }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Simulate file processing
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      const newDoc: KnowledgeDoc = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'policy',
        content: "Simulated extracted content...",
        uploadDate: new Date()
      };
      
      onAddDoc(newDoc);
      
      const newInstruction = `${systemInstruction}\n\n[NEW KNOWLEDGE ADDED FROM ${file.name}]:\n Ensure you mention our new policy regarding ${file.name.split('.')[0]} when asked.`;
      onUpdateSystemInstruction(newInstruction);
    }
  }, [onAddDoc, systemInstruction, onUpdateSystemInstruction]);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
      <div className="pt-4 mb-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Knowledge Base</h1>
        <p className="text-slate-500 font-medium">Train your Voice Agent with company policies, scripts, and product info.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 pb-6">
        {/* Left Col: Uploads */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer group ${
              dragActive 
                ? 'border-black bg-gray-50 scale-[1.02]' 
                : 'border-gray-200 hover:border-black hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors ${dragActive ? 'bg-black text-white' : 'bg-gray-100 text-slate-400 group-hover:bg-black group-hover:text-white'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="text-slate-900 font-bold text-lg">Drop files here</p>
            <p className="text-slate-500 text-sm mt-2 font-medium">PDF, DOCX, TXT supported</p>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="font-bold text-slate-900">Uploaded Documents</h3>
            </div>
            <ul className="divide-y divide-gray-50">
              {docs.length === 0 && (
                <li className="p-8 text-center text-slate-400 text-sm font-medium">No documents uploaded yet.</li>
              )}
              {docs.map(doc => (
                <li key={doc.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{doc.uploadDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: System Prompt Editor */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 flex-1 flex flex-col p-8 relative overflow-hidden">
             {/* Decorative BG */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

            <div className="relative z-10 mb-6">
                <h3 className="font-bold text-xl text-slate-900 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mr-3 text-xs">AI</span>
                System Instructions
                </h3>
                <p className="text-sm text-slate-500 mt-2 font-medium max-w-lg">
                This is the "Brain" of your agent. The content below is dynamically updated when you upload documents, but you can also edit it manually to fine-tune the persona.
                </p>
            </div>
            
            <textarea
              className="flex-1 w-full bg-gray-50 border-2 border-transparent focus:border-black/10 focus:bg-white rounded-2xl p-6 font-mono text-sm text-slate-800 focus:outline-none resize-none transition-all leading-relaxed"
              value={systemInstruction}
              onChange={(e) => onUpdateSystemInstruction(e.target.value)}
              placeholder="You are a helpful assistant..."
              spellCheck={false}
            />
            <div className="mt-6 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Auto-saves on change</span>
              <button className="bg-black hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;