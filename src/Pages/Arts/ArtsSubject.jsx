import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiStar, FiEye, FiEyeOff, FiZap, FiBookmark } from 'react-icons/fi';
import { artsSubjects } from '../../Data/Arts/artsBanks';
import { toast } from 'react-toastify';

const LETTERS = ['A', 'B', 'C', 'D'];

const appearanceTag = (appearances) => {
  if (!appearances || appearances.length === 0) return null;
  const byExam = {};
  appearances.forEach((a) => {
    byExam[a.exam] = byExam[a.exam] ? [...byExam[a.exam], a.year] : [a.year];
  });
  return Object.entries(byExam)
    .map(([exam, years]) => `${exam}: ${years.join(', ')}`)
    .join(' | ');
};

const ArtsSubject = () => {
  const { subjectId } = useParams();
  const subject = artsSubjects.find((s) => s.id === subjectId);

  const [topic, setTopic] = useState('all');
  const [hideAnswers, setHideAnswers] = useState(false);
  const [picked, setPicked] = useState({});
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const saved = localStorage.getItem('chancehack-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  if (!subject) {
    return (
      <div className="text-center py-16 px-4 text-slate-900 dark:text-white">
        <h2 className="text-lg font-bold">বিষয় পাওয়া যায়নি!</h2>
        <Link to="/arts" className="inline-block mt-4 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold">
          আর্টস হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const questions = topic === 'all' 
    ? subject.questions 
    : subject.questions.filter((q) => q.topic === topic);

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

  const optClass = (q, idx, show) => {
    const base = 'flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-sm text-left w-full transition-all ';
    const p = picked[q.id];
    
    if (show && idx === q.answerIndex) {
      return base + 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/30';
    }
    if (show && p === idx) {
      return base + 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-semibold';
    }
    return base + 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300' +
      (hideAnswers && p === undefined ? ' hover:border-emerald-500/60 cursor-pointer' : '');
  };

  return (
    <div className="max-w-5xl w-full mx-auto py-2 space-y-6">
      <Link
        to="/arts"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-500/10 transition-colors"
      >
        <FiArrowLeft /> আর্টস হোমে ফিরে যান
      </Link>

      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex justify-between items-center gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            {topic === 'all' ? 'সকল টপিকের প্রশ্ন' : 'টপিক ভিত্তিক প্রশ্ন'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            মোট {questions.length}টি প্রশ্ন
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {subject.name}
          </h2>
          
          <button
            type="button"
            onClick={() => {
              setHideAnswers((h) => !h);
              setPicked({});
            }}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
          >
            {hideAnswers ? <FiEye /> : <FiEyeOff />}
            {hideAnswers ? 'উত্তর দেখিয়ে পড়ো' : 'উত্তর লুকিয়ে প্র্যাকটিস করো'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => { setTopic('all'); setPicked({}); }}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              topic === 'all' 
                ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            সব টপিক
          </button>
          {subject.topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTopic(t); setPicked({}); }}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                topic === t 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {questions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            এই টপিকে এখনো কোনো প্রশ্ন যোগ করা হয়নি।
          </div>
        ) : (
          questions.map((q, n) => {
            const show = !hideAnswers || picked[q.id] !== undefined;
            const tag = appearanceTag(q.appearances);
            const isBookmarked = bookmarkedIds.includes(q.id);

            return (
              <div
                key={q.id || n}
                className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      MCQ
                    </span>
                    {tag && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                        <FiStar className="text-emerald-500" /> {tag}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg text-lg transition-colors cursor-pointer shrink-0 ${
                      isBookmarked 
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' 
                        : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                    }`}
                    title="রিভিশন লিস্টে সেভ করুন"
                  >
                    <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-2">{n + 1}.</span>
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!hideAnswers || picked[q.id] !== undefined}
                      className={optClass(q, idx, show)}
                      onClick={() => {
                        if (hideAnswers && picked[q.id] === undefined) {
                          setPicked((prev) => ({ ...prev, [q.id]: idx }));
                        }
                      }}
                    >
                      <span className="flex items-start">
                        <span className="font-bold text-slate-400 dark:text-slate-500 mr-2 shrink-0">{LETTERS[idx]}.</span>
                        <span className="pt-0.5">{opt}</span>
                      </span>
                      {show && idx === q.answerIndex && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 inline-flex items-center gap-1 shrink-0 shadow-sm">
                          <FiCheckCircle /> সঠিক উত্তর
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {show && (q.hack || q.eliminationTip || q.explanation) && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 p-4 mt-2 space-y-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
                    {q.hack && (
                      <div className="flex items-start gap-2">
                        <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <FiZap /> টেকনিক
                        </span>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300 pt-0.5 leading-relaxed">{q.hack}</span>
                      </div>
                    )}
                    {q.eliminationTip && (
                      <div className="text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                        {q.eliminationTip}
                      </div>
                    )}
                    {q.explanation && (
                      <div className="pt-2 mt-2 border-t border-emerald-500/20 leading-relaxed">
                        <strong className="text-slate-800 dark:text-slate-200">ব্যাখ্যা: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ArtsSubject;