import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiZap } from 'react-icons/fi';
import banglaSuper100 from '../../Data/Arts/banglaSuper100';
import englishSuper100 from '../../Data/Arts/englishSuper100';
import gkSuper100 from '../../Data/Arts/gkSuper100';

const SuperSuggestion = () => {
  const { subjectId } = useParams();

  let data = [];
  let title = '';

  if (subjectId === 'bangla') {
    data = banglaSuper100;
    title = 'বাংলা - Super 100 Suggestion & Hacks';
  } else if (subjectId === 'english') {
    data = englishSuper100;
    title = 'English - Super 100 Suggestion & Hacks';
  } else if (subjectId === 'gk') {
    data = gkSuper100;
    title = 'সাধারণ জ্ঞান - Super 100 Suggestion & Hacks';
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-slate-900 dark:text-white">
      {/* Back Button */}
      <Link 
        to="/arts" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
      >
        <FiArrowLeft /> ফিরে যান
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-100 to-slate-100 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center space-y-2 shadow-sm">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
          <FiZap /> হান্ড্রেড পার্সেন্ট কমন উপযোগী
        </span>
        <h1 className="text-2xl sm:text-3xl font-black">{title}</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          বিগত ১০ বছরের বিশ্ববিদ্যালয় প্রশ্নব্যাংক অ্যানালিসিস করে তৈরি সেরা ১০০টি প্রশ্ন ও শর্টকাট হ্যাকস।
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {data.map((item, index) => {
          // ডেটা স্ট্রাকচার চেক: [question, correct, wrongs, hack] অথবা অবজেক্ট হলে হ্যান্ডেল করার জন্য
          const question = Array.isArray(item) ? item[0] : item.question;
          const correct = Array.isArray(item) ? item[1] : item.answer;
          const hack = Array.isArray(item) ? item[3] : item.hack;

          return (
            <div key={index} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-base sm:text-lg font-bold flex gap-2">
                <span className="text-amber-500 font-extrabold">{index + 1}.</span> 
                <span>{question}</span>
              </h3>

              <div className="inline-block px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs sm:text-sm font-semibold">
                ✅ সঠিক উত্তর: <span className="font-bold">{correct}</span>
              </div>

              {hack && (
                <div className="p-3 bg-blue-500/10 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 text-xs sm:text-sm rounded-r-xl">
                  💡 <strong>হ্যাক / শর্টকাট:</strong> {hack}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuperSuggestion;