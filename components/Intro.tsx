
import React, { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000); // Show "COSIT DEPARTMENT ARCHIVES"
    const timer2 = setTimeout(() => setStep(2), 2500); // Show "by popcorn"
    const timer3 = setTimeout(() => onComplete(), 4500); // Transition to Dashboard

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 yellow-gradient flex flex-col items-center justify-center z-50 p-6 text-center">
      <div className="space-y-6">
        {step >= 1 && (
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight popcorn-anim">
            COSIT <span className="text-yellow-600">DEPARTMENT</span> ARCHIVES
          </h1>
        )}
        {step >= 2 && (
          <div className="flex items-center justify-center space-x-2 popcorn-anim delay-300">
            <span className="text-xl text-gray-500 font-medium">by</span>
            <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-bold text-2xl shadow-lg">
              Popcorn
            </span>
          </div>
        )}
      </div>
      
      {/* Decorative popcorn elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-yellow-200 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Intro;
