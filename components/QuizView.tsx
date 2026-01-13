
import React, { useState, useEffect } from 'react';
import { Note, Quiz, Question } from '../types';
import { geminiService } from '../services/geminiService';

interface QuizViewProps {
  note: Note;
  onClose: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ note, onClose }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const generated = await geminiService.generateQuiz(note.content, note.title);
        setQuiz(generated);
      } catch (err) {
        console.error("Quiz generation failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [note]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!quiz) return;
    let finalScore = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setIsFinished(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 fade-in">
        <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">Popcorn is preparing your test...</h3>
          <p className="text-gray-500 mt-2">Analyzing {note.title} using Gemini AI</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] fade-in">
        <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
        <h3 className="text-xl font-bold">Failed to load quiz</h3>
        <button onClick={onClose} className="mt-6 px-6 py-2 bg-yellow-400 rounded-xl font-bold">Back to Archives</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 shadow-2xl text-center fade-in">
        <div className="mb-6">
          <div className="inline-block p-6 bg-yellow-100 rounded-full text-5xl text-yellow-600 mb-4">
             {score / quiz.questions.length >= 0.7 ? "🎓" : "📚"}
          </div>
          <h2 className="text-3xl font-black text-gray-800">Quiz Completed!</h2>
          <p className="text-gray-500 text-lg">Subject: {note.subject}</p>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Your Score</p>
          <p className="text-6xl font-black text-yellow-500">{score} <span className="text-2xl text-gray-300">/ {quiz.questions.length}</span></p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-2xl shadow-lg transition-all"
          >
            Back to Dashboard
          </button>
          <button 
             onClick={() => {
               setIsFinished(false);
               setCurrentQuestionIndex(0);
               setUserAnswers([]);
               setScore(0);
             }}
             className="w-full py-4 text-gray-400 hover:text-gray-600 font-medium rounded-2xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h3 className="font-bold text-gray-800 line-clamp-1">{note.title}</h3>
            <p className="text-xs text-gray-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          </div>
        </div>
        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
        <h4 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
          {currentQuestion.question}
        </h4>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              className={`w-full p-5 rounded-2xl text-left font-medium transition-all border-2 ${
                userAnswers[currentQuestionIndex] === idx 
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-900 shadow-md' 
                  : 'border-gray-100 hover:border-yellow-200 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black ${
                  userAnswers[currentQuestionIndex] === idx ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-100 text-gray-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={userAnswers[currentQuestionIndex] === undefined}
        className={`w-full py-5 rounded-2xl font-black text-xl shadow-lg transition-all ${
          userAnswers[currentQuestionIndex] !== undefined
            ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
};

export default QuizView;
