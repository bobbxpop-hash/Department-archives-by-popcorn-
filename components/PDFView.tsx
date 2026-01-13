
import React from 'react';
import { Note } from '../types';

interface PDFViewProps {
  note: Note;
  onClose: () => void;
  onTakeQuiz: () => void;
}

const PDFView: React.FC<PDFViewProps> = ({ note, onClose, onTakeQuiz }) => {
  return (
    <div className="max-w-5xl mx-auto fade-in">
       <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <i className="fas fa-times"></i>
               </button>
               <div>
                  <h3 className="font-bold text-sm md:text-base line-clamp-1">{note.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{note.subject} Archive</p>
               </div>
            </div>
            <button 
              onClick={onTakeQuiz}
              className="bg-yellow-400 text-yellow-900 text-xs md:text-sm px-4 py-2 rounded-xl font-bold hover:bg-yellow-500 transition-all flex items-center gap-2"
            >
              <i className="fas fa-brain"></i>
              Test Yourself
            </button>
          </div>

          <div className="h-[70vh] p-8 md:p-16 overflow-y-auto bg-gray-50">
             <div className="bg-white shadow-md mx-auto max-w-2xl min-h-full p-10 md:p-20 border border-gray-100 relative">
                {/* Mock PDF Content Styling */}
                <div className="absolute top-10 right-10 opacity-10">
                   <i className="fas fa-university text-9xl"></i>
                </div>

                <div className="mb-12">
                   <h1 className="text-4xl font-black text-gray-800 mb-4">{note.title}</h1>
                   <div className="flex items-center gap-4 text-gray-400 text-sm border-b pb-6">
                      <span>Course: {note.subject}</span>
                      <span>•</span>
                      <span>Date: {note.date}</span>
                   </div>
                </div>

                <div className="prose prose-yellow max-w-none text-gray-600 leading-relaxed space-y-6">
                   <p className="text-xl font-medium text-gray-800">Overview</p>
                   <p>{note.content}</p>
                   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                   
                   <div className="bg-yellow-50 p-6 rounded-2xl border-l-4 border-yellow-400 italic">
                      "Academic excellence is not an act, but a habit. The department archives provide the foundation for your continued success in COSIT."
                   </div>

                   <p className="font-bold text-gray-800 mt-10">Core Concepts</p>
                   <ul className="list-disc pl-6 space-y-2">
                      <li>Definition and initial properties</li>
                      <li>Relationship with related concepts in {note.subject}</li>
                      <li>Practical applications in modern computing</li>
                      <li>Case studies and historical context from archives</li>
                   </ul>

                   <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                <div className="mt-20 pt-10 border-t text-center text-gray-300 text-xs">
                   <p>© 2024 COSIT Department Archives - Academic Resource Division</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PDFView;
