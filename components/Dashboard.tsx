
import React, { useState } from 'react';
import { Note } from '../types';

interface DashboardProps {
  onSelectNote: (note: Note) => void;
  onTakeQuiz: (note: Note) => void;
}

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Data Structures 101', subject: 'CS201', content: 'Stacks and Queues are fundamental data structures. A Stack is LIFO while a Queue is FIFO.', type: 'pdf', date: '2023-10-12' },
  { id: '2', title: 'Operating Systems - Processes', subject: 'CS302', content: 'A process is an instance of a computer program that is being executed. It contains program code and its current activity.', type: 'pdf', date: '2023-11-05' },
  { id: '3', title: 'Calculus IV: Integrals', subject: 'MTH401', content: 'Integration is the process of finding the area under a curve. Fundamental Theorem of Calculus connects differentiation and integration.', type: 'pdf', date: '2023-12-01' },
];

const Dashboard: React.FC<DashboardProps> = ({ onSelectNote, onTakeQuiz }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = MOCK_NOTES.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 fade-in">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back, Scholar</h2>
        <p className="text-gray-600 mt-2">Access your department archives and test your knowledge.</p>
      </header>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search notes or subjects..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-2xl transition-all shadow-md">
            <i className="fas fa-upload"></i>
            Upload New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {note.subject}
                </span>
                <span className="text-gray-400 text-xs">
                  {note.date}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
                {note.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                {note.content}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => onSelectNote(note)}
                className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-file-pdf"></i>
                View PDF
              </button>
              <button 
                onClick={() => onTakeQuiz(note)}
                className="flex-1 py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <i className="fas fa-brain"></i>
                Take Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <i className="fas fa-folder-open text-5xl text-gray-200 mb-4"></i>
          <p className="text-gray-400 font-medium">No notes found match your search.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
