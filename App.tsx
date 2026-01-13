
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// --- CONFIGURATION ---
// 1. Set this to your email to gain Admin powers (Drop Note button)
const ADMIN_EMAIL = "popcorn.cosit@gmail.com"; 

// 2. Add your Google Client ID here once generated at https://console.cloud.google.com/
// If this stays as placeholder, the app will offer "Developer Bypass Mode"
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// --- Types ---
interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
  tag: string;
}

interface User {
  name: string;
  email: string;
  picture: string;
  role: 'ADMIN' | 'STUDENT';
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  title: string;
  questions: Question[];
}

enum Screen {
  INTRO,
  LOGIN,
  DASHBOARD,
  VIEWER,
  QUIZ
}

// --- Helpers ---
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// --- Sub-Components ---

const Intro: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 2200);
    const t3 = setTimeout(onFinish, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 yellow-gradient flex flex-col items-center justify-center z-50 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="particle text-yellow-400 opacity-20"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`, 
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          <i className="fas fa-circle"></i>
        </div>
      ))}
      <div className="relative text-center z-10 px-6">
        {stage >= 1 && (
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter pop-animation">
            COSIT <span className="text-yellow-500 underline decoration-yellow-300 decoration-8">DEPARTMENT</span> ARCHIVES
          </h1>
        )}
        {stage >= 2 && (
          <div className="mt-8 flex items-center justify-center gap-4 pop-animation">
            <span className="text-xl md:text-2xl text-gray-400 font-medium">by</span>
            <span className="bg-yellow-400 text-yellow-950 px-10 py-4 rounded-full font-black text-2xl md:text-4xl shadow-2xl border-b-8 border-yellow-600 active:scale-95 transition-transform">
              POPCORN
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Login: React.FC<{ onAuth: (user: User) => void }> = ({ onAuth }) => {
  const [useDev, setUseDev] = useState(false);
  const [email, setEmail] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const google = (window as any).google;
    if (google && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp: any) => {
          const p = parseJwt(resp.credential);
          if (p) onAuth({
            name: p.name,
            email: p.email,
            picture: p.picture,
            role: p.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'STUDENT'
          });
        }
      });
      google.accounts.id.renderButton(googleBtnRef.current, { theme: "outline", size: "large", width: "100%", shape: "pill" });
    }
  }, [onAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 fade-slide-up">
      <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-2xl border border-white w-full max-w-md text-center">
        <div className="bg-yellow-400 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-yellow-200">
          <i className="fas fa-user-graduate text-4xl text-yellow-900"></i>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Archives Portal</h2>
        <p className="text-gray-500 mb-10 font-medium italic opacity-70">"Knowledge is the only wealth that grows when shared."</p>

        {!useDev ? (
          <div className="space-y-6">
            <div ref={googleBtnRef} className="flex justify-center w-full"></div>
            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={() => setUseDev(true)}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-yellow-600 transition-colors"
              >
                OAuth Blocked? Use Developer Bypass
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            onAuth({
              name: email.split('@')[0],
              email: email,
              picture: `https://ui-avatars.com/api/?name=${email}&background=facc15&color=422006`,
              role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'STUDENT'
            });
          }} className="space-y-4 fade-slide-up">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4">Bypass Active</p>
            <input 
              required
              type="email"
              placeholder="Enter your email address"
              className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold text-gray-800 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all">
              Continue as {email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'Admin' : 'Student'}
            </button>
            <button type="button" onClick={() => setUseDev(false)} className="text-xs text-gray-400 font-bold hover:underline">Go back to Google Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.INTRO);
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState({ idx: 0, score: 0, answers: [] as number[], done: false, loading: false });

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('cosit_v5_notes');
    if (saved) setNotes(JSON.parse(saved));
    else {
      const initial: Note[] = [{ id: '1', title: 'COSIT Archives: Introduction', subject: 'SYSTEM', content: 'Welcome to the official department archive platform. As a student, you can access notes and take AI tests. As an admin, you can "Drop" new notes for everyone.', date: 'System', tag: 'Notice' }];
      setNotes(initial);
      localStorage.setItem('cosit_v5_notes', JSON.stringify(initial));
    }
    const savedUser = localStorage.getItem('cosit_v5_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('cosit_v5_user', JSON.stringify(u));
    setScreen(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cosit_v5_user');
    setScreen(Screen.LOGIN);
  };

  const startQuiz = async (note: Note) => {
    setQuizState({ idx: 0, score: 0, answers: [], done: false, loading: true });
    setScreen(Screen.QUIZ);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const resp = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a 5-question multiple choice test based on these notes: "${note.content}". Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.INTEGER }
                  },
                  required: ["question", "options", "correctAnswer"]
                }
              }
            },
            required: ["title", "questions"]
          }
        }
      });
      setQuiz(JSON.parse(resp.text || '{}'));
    } catch (e) {
      console.error(e);
      setScreen(Screen.DASHBOARD);
    } finally {
      setQuizState(prev => ({ ...prev, loading: false }));
    }
  };

  const submitNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const n: Note = {
      id: Date.now().toString(),
      title: fd.get('title') as string,
      subject: fd.get('subject') as string,
      tag: fd.get('tag') as string,
      content: fd.get('content') as string,
      date: new Date().toLocaleDateString('en-GB')
    };
    const updated = [n, ...notes];
    setNotes(updated);
    localStorage.setItem('cosit_v5_notes', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  return (
    <div className="yellow-gradient selection:bg-yellow-200 min-h-screen">
      {screen === Screen.INTRO && <Intro onFinish={() => setScreen(user ? Screen.DASHBOARD : Screen.LOGIN)} />}
      {screen === Screen.LOGIN && <Login onAuth={handleLogin} />}

      {user && screen !== Screen.INTRO && screen !== Screen.LOGIN && (
        <>
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-yellow-100 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div onClick={() => setScreen(Screen.DASHBOARD)} className="flex items-center gap-3 cursor-pointer group">
                <div className="bg-gray-900 p-3 rounded-2xl shadow-lg group-hover:bg-yellow-500 transition-colors">
                  <i className="fas fa-layer-group text-white"></i>
                </div>
                <h1 className="font-black text-2xl tracking-tighter text-gray-900 uppercase">
                  COSIT <span className="text-yellow-500">Archives</span>
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-black text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">{user.role}</p>
                </div>
                <img src={user.picture} className="w-12 h-12 rounded-2xl border-4 border-yellow-100 shadow-sm" alt="Profile" />
                <button onClick={handleLogout} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 hover:text-red-500 hover:border-red-100 transition-all">
                  <i className="fas fa-power-off"></i>
                </button>
              </div>
            </div>
          </nav>

          <main className="max-w-6xl mx-auto px-6 py-12 pb-32">
            {screen === Screen.DASHBOARD && (
              <div className="fade-slide-up">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">The Vault</h2>
                    <p className="text-gray-500 text-lg">Curated materials by the COSIT Academic Board.</p>
                  </div>
                  {user.role === 'ADMIN' && (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-yellow-400 text-yellow-950 px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-yellow-200/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <i className="fas fa-plus-circle text-xl"></i> Drop Archive
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {notes.map(n => (
                    <div key={n.id} className="bg-white rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all border border-yellow-50 flex flex-col group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 -mr-16 -mt-16 rounded-full"></div>
                      <div className="flex justify-between mb-8">
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{n.subject}</span>
                        <span className="text-gray-300 text-xs font-bold">{n.date}</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-yellow-600 transition-colors leading-tight">{n.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-10 italic leading-relaxed">"{n.content}"</p>
                      <div className="flex gap-3 mt-auto">
                        <button onClick={() => { setActiveNote(n); setScreen(Screen.VIEWER); }} className="flex-1 py-5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-all">Read</button>
                        <button onClick={() => { setActiveNote(n); startQuiz(n); }} className="flex-1 py-5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black rounded-2xl transition-all shadow-md">Test</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {screen === Screen.VIEWER && activeNote && (
              <div className="max-w-4xl mx-auto fade-slide-up">
                <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gray-900 text-white p-8 flex justify-between items-center">
                    <button onClick={() => setScreen(Screen.DASHBOARD)} className="hover:text-yellow-400 font-black flex items-center gap-3 transition-colors uppercase text-xs tracking-widest">
                      <i className="fas fa-chevron-left"></i> Vault
                    </button>
                    <span className="font-black text-[10px] uppercase tracking-[0.5em] text-gray-500">Resource</span>
                    <button onClick={() => startQuiz(activeNote)} className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-2xl font-black text-xs hover:bg-yellow-500 shadow-xl transition-all">Take AI Test</button>
                  </div>
                  <div className="p-10 md:p-20 bg-gray-50/50 min-h-[80vh]">
                     <div className="bg-white shadow-xl p-10 md:p-24 rounded-[3.5rem] border border-gray-100 max-w-2xl mx-auto relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-400/5 rounded-full"></div>
                        <h1 className="text-5xl font-black text-gray-900 mb-10 border-b-4 border-gray-50 pb-10 tracking-tighter leading-none">{activeNote.title}</h1>
                        <div className="prose text-gray-600 leading-[2.2] text-lg">
                           <div className="flex items-center gap-2 mb-10">
                              <span className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{activeNote.subject}</span>
                              <span className="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{activeNote.tag}</span>
                           </div>
                           <p className="whitespace-pre-wrap font-medium">{activeNote.content}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {screen === Screen.QUIZ && activeNote && (
              <div className="max-w-2xl mx-auto py-10 fade-slide-up">
                {quizState.loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-8">
                    <div className="w-20 h-20 border-[12px] border-yellow-100 border-t-yellow-500 rounded-full animate-spin"></div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Popcorn is thinking...</h3>
                    <p className="text-gray-400 italic">Generating an academic assessment for you.</p>
                  </div>
                ) : quizState.done ? (
                  <div className="bg-white p-16 rounded-[4rem] shadow-2xl text-center border-4 border-yellow-100">
                    <div className="text-8xl mb-8">🎖️</div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Assessment Over</h2>
                    <div className="bg-yellow-50 rounded-[3rem] p-12 mb-10">
                       <p className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2">Final Proficiency Score</p>
                       <h3 className="text-8xl font-black text-yellow-600">{quizState.score} <span className="text-2xl text-yellow-300">/ {quiz?.questions.length}</span></h3>
                    </div>
                    <button onClick={() => setScreen(Screen.DASHBOARD)} className="w-full bg-yellow-400 text-yellow-950 font-black py-6 rounded-[2rem] shadow-2xl hover:bg-yellow-500 transition-all text-xl">Return to Hub</button>
                  </div>
                ) : quiz && quiz.questions[quizState.idx] ? (
                  <div className="bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl border border-yellow-50">
                    <div className="flex justify-between items-center mb-10">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Step {quizState.idx + 1} of {quiz.questions.length}</p>
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 transition-all duration-700" style={{ width: `${((quizState.idx + 1) / quiz.questions.length) * 100}%` }}></div>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-12 leading-tight tracking-tight">{quiz.questions[quizState.idx].question}</h3>
                    <div className="space-y-4">
                      {quiz.questions[quizState.idx].options.map((opt, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            const ans = [...quizState.answers];
                            ans[quizState.idx] = i;
                            setQuizState(prev => ({ ...prev, answers: ans }));
                          }}
                          className={`w-full p-6 text-left rounded-[1.5rem] border-4 font-bold transition-all text-lg ${quizState.answers[quizState.idx] === i ? 'border-yellow-400 bg-yellow-50 text-yellow-900 shadow-xl' : 'border-gray-50 hover:border-yellow-100 text-gray-500'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black ${quizState.answers[quizState.idx] === i ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-400'}`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                          </div>
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={quizState.answers[quizState.idx] === undefined}
                      onClick={() => {
                        const isCorrect = quizState.answers[quizState.idx] === quiz.questions[quizState.idx].correctAnswer;
                        const nextIdx = quizState.idx + 1;
                        if (nextIdx < quiz.questions.length) {
                          setQuizState(prev => ({ ...prev, idx: nextIdx, score: isCorrect ? prev.score + 1 : prev.score }));
                        } else {
                          setQuizState(prev => ({ ...prev, done: true, score: isCorrect ? prev.score + 1 : prev.score }));
                        }
                      }}
                      className={`w-full mt-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl ${quizState.answers[quizState.idx] !== undefined ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-500' : 'bg-gray-100 text-gray-300'}`}
                    >
                      {quizState.idx === quiz.questions.length - 1 ? 'Calculate Score' : 'Next Challenge'}
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </main>

          {/* Admin Drop Archive Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-[4rem] p-12 md:p-16 w-full max-w-xl shadow-2xl relative fade-slide-up border-4 border-yellow-400">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-gray-300 hover:text-gray-900 transition-colors"><i className="fas fa-times text-2xl"></i></button>
                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter uppercase italic">Drop Archive</h2>
                <p className="text-gray-500 mb-10 font-medium">Add new academic materials to the department vault.</p>
                
                <form onSubmit={submitNote} className="space-y-4">
                   <input required name="title" placeholder="Resource Title (e.g. Intro to ML)" className="w-full p-5 rounded-2xl bg-gray-50 border-4 border-transparent focus:border-yellow-400 outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300" />
                   <div className="flex gap-4">
                     <input required name="subject" placeholder="Course ID" className="flex-1 p-5 rounded-2xl bg-gray-50 border-4 border-transparent focus:border-yellow-400 outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300" />
                     <input required name="tag" placeholder="Label (Module 1)" className="flex-1 p-5 rounded-2xl bg-gray-50 border-4 border-transparent focus:border-yellow-400 outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300" />
                   </div>
                   <textarea required name="content" rows={8} placeholder="Paste full course notes here. This data powers the AI Test." className="w-full p-5 rounded-2xl bg-gray-50 border-4 border-transparent focus:border-yellow-400 outline-none font-bold text-gray-800 resize-none transition-all placeholder:text-gray-300"></textarea>
                   <button type="submit" className="w-full py-6 bg-yellow-400 text-yellow-950 font-black rounded-[2rem] shadow-2xl shadow-yellow-400/30 text-xl hover:bg-yellow-500 transition-all active:scale-[0.98] uppercase tracking-widest">Push to Vault</button>
                </form>
              </div>
            </div>
          )}

          <footer className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-md py-6 text-center border-t border-yellow-50 z-30">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-900 opacity-30">Developed by Popcorn for COSIT Excellence</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
