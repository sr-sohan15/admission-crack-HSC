import React from 'react';
import { Link } from 'react-router-dom';
import { scienceData } from '../../Data/Science/scienceData';
import { FiBookOpen, FiArrowRight, FiCheckCircle, FiZap } from 'react-icons/fi';
import MissionTrackerModal from '../../Components/MissionTrackerModal';

const ScienceHome = () => {
  const subjectsList = scienceData?.subjects || [];

  return (
    <div className="space-y-8 max-w-5xl w-full mx-auto py-2">
      
      {/* টপ ব্যানার */}
      <div className="bg-gradient-to-r from-emerald-50 via-slate-100 to-slate-100 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-9 space-y-4 shadow-xl relative transition-colors">
        
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
          <FiZap /> DU A Unit ক্র্যাশ কোর্স
        </span>
        
        <div className="space-y-1.5 pr-20 sm:pr-24">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {scienceData?.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {scienceData?.subtitle}
          </p>
        </div>
      </div>

      <div>
        <MissionTrackerModal />
      </div>

      {/* বিষয় নির্বাচন সেকশন */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">বিষয় নির্বাচন ও ১০০% কমন শর্টকাট</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectsList.map(sub => {
            const chapterCount = sub.chapters?.length || 0;

            return (
              <Link
                key={sub.id}
                to={`/science/subject/${sub.id}`}
                className="p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 group bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm dark:shadow-none"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      <FiCheckCircle />
                      {sub.statusText}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{chapterCount}টি অধ্যায়</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold transition-colors flex items-center gap-2 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    <FiBookOpen className="text-emerald-600 dark:text-emerald-400" /> {sub.name}
                  </h3>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{sub.tagline}</span>
                  <FiArrowRight className="text-base transition-all group-hover:translate-x-1 text-emerald-600 dark:text-emerald-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ScienceHome;