import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scienceData } from '../Data/Science/scienceData';
import { FiClock, FiCheckCircle, FiXCircle, FiRotateCcw, FiAward, FiArrowLeft, FiBookmark } from 'react-icons/fi';
import { toast } from 'react-toastify';

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const MockExam = () => {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('biology');
  const [examQuestions, setExamQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [examStarted, setExamStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(25);
  
  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('chancehack-bookmarks');
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  const subjectsConfig = {
    biology: { name: 'জীববিজ্ঞান (Biology)', icon: '🧬' },
    physics: { name: 'পদার্থবিজ্ঞান (Physics)', icon: '⚛️' },
    chemistry: { name: 'রসায়ন (Chemistry)', icon: '🧪' },
    higherMath: { name: 'উচ্চতর গণিত (Higher Math)', icon: '📐' }
  };

  // ডেটা স্ট্রাকচার ফিক্স: subjects অ্যারে থেকে সঠিক সাবজেক্ট খুঁজে বের করা
  const getQuestionsForSubject = (subjKey) => {
    // scienceData এর subjects অ্যারে থেকে আইডির মাধ্যমে সাবজেক্ট খোঁজা
    const subjData = scienceData?.subjects?.find(sub => sub.id === subjKey);
    
    if (!subjData) return [];

    let rawQuestions = [];

    const extractQuestions = (chaptersArray) => {
      if (Array.isArray(chaptersArray)) {
        chaptersArray.forEach(ch => {
          if (ch.questions && Array.isArray(ch.questions)) {
            rawQuestions.push(...ch.questions);
          }
        });
      }
    };

    extractQuestions(subjData.botany);
    extractQuestions(subjData.zoology);
    extractQuestions(subjData.firstPaper);
    extractQuestions(subjData.secondPaper);
    extractQuestions(subjData.chapters); 

    return rawQuestions;
  };

  const startNewExam = (subjKey, count = 25) => {
    setSelectedSubjectKey(subjKey);
    setQuestionCount(count);
    
    const allRawQuestions = getQuestionsForSubject(subjKey);
    
    // যদি ডাটাবেসে কোনো প্রশ্ন না থাকে, তবে এলার্ট দেখাবে
    if (allRawQuestions.length === 0) {
      toast.error('এই সাবজেক্টে এখনো কোনো প্রশ্ন যোগ করা হয়নি!');
      return;
    }

    const actualCount = Math.min(count, allRawQuestions.length);
    const selected = shuffleArray(allRawQuestions).slice(0, actualCount);

    const preparedQuestions = selected.map((q, idx) => {
      const originalCorrectText = q.options[q.correctAnswer];
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

      return {
        ...q,
        uniqueExamId: `${q.id || idx}_${Date.now()}_${idx}`,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex,
        originalCorrectText
      };
    });

    setExamQuestions(preparedQuestions);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeft(actualCount * 60);
    setExamStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let timer;
    if (examStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && examStarted && !isSubmitted) {
      setIsSubmitted(true);
    }
    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, timeLeft]);

  const handleSelect = (qIdx, optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optionIdx
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    examQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === undefined) {
        unattempted++;
      } else if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const finalScore = (correct * 1) - (wrong * 0.25);
    return { correct, wrong, unattempted, finalScore: finalScore.toFixed(2) };
  };

  const scoreData = isSubmitted ? calculateScore() : null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const toggleBookmark = (qId) => {
    if (!qId) return;
    let updated;
    if (bookmarkedIds.includes(qId)) {
      updated = bookmarkedIds.filter(id => id !== qId);
      toast.info('রিভিশন তালিকা থেকে সরানো হয়েছে');
    } else {
      updated = [...bookmarkedIds, qId];
      toast.success('রিভিশন তালিকায় সেভ করা হয়েছে');
    }
    setBookmarkedIds(updated);
    localStorage.setItem('chancehack-bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 max-w-4xl w-full mx-auto py-2 text-slate-900 dark:text-slate-100">
      {!examStarted ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-sm transition-colors">
          <div className="w-16 h-16 bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto text-2xl">
            <FiAward />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">ভার্সিটি এডমিশন সাবজেক্ট ওয়াইজ মক টেস্ট</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              তোমার পছন্দের সাবজেক্ট সিলেক্ট করো। প্রতিবার সম্পূর্ণ নতুন ও এলোমেলো (Shuffled) প্রশ্ন ও অপশনে পরীক্ষা দাও।
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block text-left">
              পরীক্ষার সাবজেক্ট বেছে নাও:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(subjectsConfig).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSubjectKey(key)}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                    selectedSubjectKey === key 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md shadow-emerald-500/10' 
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">{val.icon}</span>
                  <div>
                    <div className="text-slate-900 dark:text-white text-sm">{val.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">মক টেস্ট ও প্র্যাকটিস</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">⏱️ সময়সীমা</span>
              প্রতি প্রশ্নে ১ মিনিট (DU স্ট্যান্ডার্ড)
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">🎯 নেগেটিভ মার্কিং</span>
              ভুল উত্তরে -০.২৫ কাটা যাবে
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">🔀 রিয়েল র‍্যান্ডম</span>
              প্রশ্ন ও ৪টি অপশন প্রতিবার পরিবর্তনশীল
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => startNewExam(selectedSubjectKey, 25)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              ২৫ নম্বরের মক টেস্ট শুরু করো
            </button>
            <button
              onClick={() => startNewExam(selectedSubjectKey, 50)}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-2xl text-sm transition-all cursor-pointer"
            >
              ৫০ নম্বরের মেগা টেস্ট
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="sticky top-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex justify-between items-center transition-colors">
            <div className="flex items-center gap-3">
              <Link to="/science" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-1">
                <FiArrowLeft /> এক্সিট
              </Link>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800 pl-3 hidden sm:inline">
                সাবজেক্ট: <strong className="text-emerald-600 dark:text-emerald-400">{subjectsConfig[selectedSubjectKey]?.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                উত্তর: <strong className="text-emerald-600 dark:text-emerald-400">{Object.keys(userAnswers).length}</strong>/{examQuestions.length}
              </span>

              {!isSubmitted && (
                <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-bold border ${
                  timeLeft < 300 
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-500/40 text-red-600 dark:text-red-400 animate-pulse' 
                    : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <FiClock /> {formatTime(timeLeft)}
                </div>
              )}

              {!isSubmitted ? (
                <button
                  onClick={() => setIsSubmitted(true)}
                  className="px-3 sm:px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] sm:text-xs font-black rounded-xl cursor-pointer"
                >
                  সাবমিট করো
                </button>
              ) : (
                <button
                  onClick={() => setExamStarted(false)}
                  className="px-3 sm:px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] sm:text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <FiRotateCcw /> ফিরে যাও
                </button>
              )}
            </div>
          </div>

          {isSubmitted && scoreData && (
            <div className="bg-gradient-to-r from-emerald-50 via-slate-100 to-slate-100 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">টেস্ট সম্পন্ন হয়েছে</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">মক টেস্ট রেজাল্ট শিট</h3>
                </div>
                <div className="bg-emerald-500 text-slate-950 px-5 py-2.5 rounded-2xl text-center shadow-lg shadow-emerald-500/20 w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold block">প্রাপ্ত নম্বর</span>
                  <span className="text-2xl font-black">{scoreData.finalScore}</span>
                  <span className="text-[10px] font-bold block">/{examQuestions.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3.5 bg-white dark:bg-slate-950/60 border border-emerald-500/20 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">সঠিক (+১.০০)</span>
                  <strong className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">{scoreData.correct}টি</strong>
                </div>
                <div className="p-2 sm:p-3.5 bg-white dark:bg-slate-950/60 border border-red-500/20 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-semibold block">ভুল (-০.২৫)</span>
                  <strong className="text-lg sm:text-xl font-black text-red-600 dark:text-red-400">{scoreData.wrong}টি</strong>
                </div>
                <div className="p-2 sm:p-3.5 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">উত্তর দাওনি</span>
                  <strong className="text-lg sm:text-xl font-black text-slate-700 dark:text-slate-300">{scoreData.unattempted}টি</strong>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {examQuestions.map((q, qIdx) => {
              const userChoice = userAnswers[qIdx];
              const isAnswered = userChoice !== undefined;
              const isBookmarked = bookmarkedIds.includes(q.id);

              return (
                <div key={q.uniqueExamId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-sm transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-bold">
                      প্রশ্ন {qIdx + 1}/{examQuestions.length}
                    </span>

                    <div className="flex items-center gap-2">
                      {isSubmitted && (
                        <div>
                          {!isAnswered ? (
                            <span className="text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md text-[11px] font-bold">
                              উত্তর দাওনি
                            </span>
                          ) : userChoice === q.correctAnswer ? (
                            <span className="text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
                              <FiCheckCircle /> সঠিক (+১.০০)
                            </span>
                          ) : (
                            <span className="text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950 border border-red-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1">
                              <FiXCircle /> ভুল উত্তর (-০.২৫)
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Bookmark Button */}
                      <button 
                        onClick={() => toggleBookmark(q.id)}
                        className={`p-1.5 rounded-lg text-lg transition-colors cursor-pointer ${isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}
                        title="রিভিশন লিস্টে সেভ করুন"
                      >
                        <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      let btnStyle = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300";

                      if (!isSubmitted) {
                        if (userChoice === oIdx) {
                          btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/40";
                        }
                      } else {
                        if (oIdx === q.correctAnswer) {
                          btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/50";
                        } else if (userChoice === oIdx) {
                          btnStyle = "border-red-500 bg-red-50 dark:bg-red-950/80 text-red-900 dark:text-red-200 font-bold";
                        } else {
                          btnStyle = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-400 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => handleSelect(qIdx, oIdx)}
                          className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>
                            <strong className="mr-2 text-slate-500">{String.fromCharCode(65 + oIdx)}.</strong>
                            {opt}
                          </span>
                          {isSubmitted && oIdx === q.correctAnswer && <FiCheckCircle className="text-emerald-600 dark:text-emerald-400 text-base" />}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {q.hack && (
                        <div className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                          <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] shrink-0">
                            টেকনিক
                          </span>
                          <span>{q.hack}</span>
                        </div>
                      )}
                      {q.explanation && (
                        <p className="text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-850 leading-relaxed">
                          <strong className="text-slate-800 dark:text-slate-300">ব্যাখ্যা:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockExam;