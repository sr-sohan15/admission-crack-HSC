import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiArrowRight, FiCheckCircle, FiZap, FiClock } from 'react-icons/fi';
import { artsSubjects, artsMeta } from '../../Data/Arts/artsBanks';

const ArtsHome = () => {
  const total = artsSubjects.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="space-y-8 max-w-5xl w-full mx-auto py-2">
      {/* টপ ব্যানার */}
      <div className="bg-gradient-to-r from-emerald-50 via-slate-100 to-slate-100 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-9 space-y-4 shadow-xl transition-colors">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
          <FiZap /> GST B Unit ক্র্যাশ কোর্স
        </span>
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {artsMeta.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {artsMeta.subtitle}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
            মোট {total}টি অনুশীলন প্রশ্ন
          </p>
        </div>
      </div>

      {/* ফুল মক টেস্ট */}
      <Link
        to="/arts/mock"
        className="p-5 sm:p-6 rounded-3xl border transition-all flex items-center justify-between gap-4 group bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500 shadow-sm"
      >
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <FiClock className="text-emerald-600 dark:text-emerald-400" /> ফুল মক টেস্ট (১০০ প্রশ্ন, ১ ঘণ্টা)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            বাংলা ৩৪ + ইংরেজি ৩৫ + সাধারণ জ্ঞান ৩১। শেষে সাবজেক্ট ভিত্তিক রেজাল্ট ও ভুলের হ্যাকস।
          </p>
        </div>
        <FiArrowRight className="text-xl transition-all group-hover:translate-x-1 text-emerald-600 dark:text-emerald-400 shrink-0" />
      </Link>

      {/* বিষয় নির্বাচন */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          বিষয় নির্বাচন ও টপিক ভিত্তিক প্র্যাকটিস
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artsSubjects.map((sub) => (
            <div
              key={sub.id}
              className="p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <FiCheckCircle /> বাধ্যতামূলক
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {sub.questions.length}টি প্রশ্ন · {sub.topics.length}টি টপিক
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold transition-colors flex items-center gap-2 text-slate-900 dark:text-white">
                  <FiBookOpen className="text-emerald-600 dark:text-emerald-400" /> {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{sub.tagline}</p>
              </div>

              {/* অ্যাকশন বাটনসমূহ (প্র্যাকটিস এবং সুপার সাজেশন) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <Link
                  to={`/arts/subject/${sub.id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  টপিক প্র্যাকটিস <FiArrowRight />
                </Link>
                <Link
                  to={`/arts/suggestion/${sub.id}`}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black text-center transition flex items-center justify-center gap-1 shadow-sm"
                >
                  🔥 Super Suggestion & Hacks
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtsHome;