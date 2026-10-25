import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiStar, FiEye, FiEyeOff } from 'react-icons/fi';
import { artsSubjects, topicLabel } from '../../Data/Arts/artsBanks';

const LETTERS = ['A', 'B', 'C', 'D'];

// appearances (jodi real past paper theke bhora hoy) tahole tag dekhabe
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

const ArtsTopic = () => {
  const { subjectId, topicId } = useParams();
  const subject = artsSubjects.find((s) => s.id === subjectId);
  const questions = subject ? subject.questions.filter((q) => q.topic === topicId) : [];

  const [hideAnswers, setHideAnswers] = useState(false);
  const [picked, setPicked] = useState({});

  if (!subject || questions.length === 0) {
    return (
      <div className="text-center py-16 px-4 text-slate-900 dark:text-white">
        <h2 className="text-lg font-bold">টপিক পাওয়া যায়নি!</h2>
        <Link to="/arts" className="inline-block mt-4 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold">
          আর্টস হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const optClass = (q, idx, show) => {
    const base = 'flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-sm text-left w-full transition-all ';
    const p = picked[q.id];
    if (show && idx === q.answerIndex) {
      return base + 'bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white font-semibold';
    }
    if (show && p === idx) {
      return base + 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400';
    }
    return base + 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200' +
      (hideAnswers && p === undefined ? ' hover:border-emerald-500/60 cursor-pointer' : '');
  };

  return (
    <div className="max-w-5xl w-full mx-auto py-2 space-y-6">
      <Link
        to={`/arts/subject/${subject.id}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-sm font-bold"
      >
        <FiArrowLeft /> টপিক তালিকায় ফিরে যান
      </Link>

      {/* হেডার কার্ড */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            টপিক ভিত্তিক প্যাটার্ন প্রশ্ন
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">মোট {questions.length}টি প্রশ্ন</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {subject.name} - {topicLabel(topicId)}
        </h2>
        <button
          type="button"
          onClick={() => {
            setHideAnswers((h) => !h);
            setPicked({});
          }}
          className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          {hideAnswers ? <FiEye /> : <FiEyeOff />}
          {hideAnswers ? 'উত্তর দেখিয়ে পড়ো' : 'উত্তর লুকিয়ে প্র্যাকটিস করো'}
        </button>
      </div>

      <p className="text-xs text-amber-600 dark:text-amber-400">
        ⚠ টপিক ভিত্তিক প্যাটার্ন প্রশ্ন ও শর্টকাট সমাধান। আসল প্রশ্নব্যাংকের সাথেও মিলিয়ে নাও।
      </p>

      {/* প্রশ্ন তালিকা */}
      <div className="space-y-5">
        {questions.map((q, n) => {
          const show = !hideAnswers || picked[q.id] !== undefined;
          const tag = appearanceTag(q.appearances);
          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex justify-between items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  MCQ
                </span>
                {tag && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                    <FiStar /> {tag}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                <span className="text-emerald-600 dark:text-emerald-400">{n + 1}. </span>
                {q.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={optClass(q, idx, show)}
                    onClick={() => {
                      if (hideAnswers && picked[q.id] === undefined) {
                        setPicked((prev) => ({ ...prev, [q.id]: idx }));
                      }
                    }}
                  >
                    <span>
                      <span className="font-bold text-slate-500 dark:text-slate-400 mr-2">{LETTERS[idx]}.</span>
                      {opt}
                    </span>
                    {show && idx === q.answerIndex && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 inline-flex items-center gap-1 shrink-0">
                        <FiCheckCircle /> সঠিক উত্তর
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {show && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 text-sm flex flex-wrap items-start gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                    শর্টকাট টেকনিক
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300">{q.hack}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* মক টেস্ট লিঙ্ক */}
      <Link
        to="/arts/mock"
        className="block text-center px-6 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold"
      >
        এই বিষয়গুলো থেকে মক টেস্ট দাও (র‍্যান্ডম ১০০ প্রশ্ন)
      </Link>
    </div>
  );
};

export default ArtsTopic;