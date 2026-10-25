import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="space-y-8 sm:space-y-10 max-w-5xl mx-auto py-4 px-4 sm:px-6">
      
      {/* হিরো সেকশন */}
      <div className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 sm:p-12 text-center space-y-4 shadow-xl relative transition-colors">
        
        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs px-3.5 py-1 rounded-full font-bold inline-flex items-center gap-1.5">
          <FiZap /> 80/20 Pareto Formula
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          কম পরিশ্রমে ভার্সিটি চান্স নিশ্চিত করার <br className="hidden sm:inline" />
          <span className="text-emerald-600 dark:text-emerald-400">শর্টকাট মিশন প্ল্যাটফর্ম</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          কোনো বই ছাড়া শুধু বিগত ১০ বছরের মোস্ট রিপিটেড টাইপ, ৫-সেকেন্ড হ্যাকস এবং অপশন এলিমিনেশন ট্রিকস দিয়ে পূর্ণাঙ্গ প্রস্তুতি।
        </p>
      </div>

      {/* ইউনিট সিলেকশন সেকশন */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center sm:text-left">
          তোমার ইউনিট নির্বাচন করো
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <Link
            to="/science"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 hover:border-emerald-500 p-6 sm:p-8 rounded-3xl transition-all space-y-4 group shadow-lg shadow-emerald-950/5 dark:shadow-emerald-950/20 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
                  DU A / GST KA
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">৪টি মূল বিষয়</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                বিজ্ঞান ইউনিট (Science)
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Physics, Chemistry, Math ও Biology-র ১০০% কমন টাইপ এবং ক্যালকুলেটর ছাড়া ৫-সেকেন্ড সমাধান হ্যাকস।
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <span>সায়েন্স মিশন শুরু করো</span>
              <FiArrowRight className="text-base group-hover:translate-x-1.5 transition-all" />
            </div>
          </Link>

          <Link
            to="/arts"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 hover:border-emerald-500 p-6 sm:p-8 rounded-3xl transition-all space-y-4 group shadow-lg shadow-emerald-950/5 dark:shadow-emerald-950/20 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
                  DU B / GST KHA
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">৩টি মূল বিষয়</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                মানবিক ইউনিট (Arts)
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                বাংলা, ইংরেজি ও সাধারণ জ্ঞানের মোস্ট কমন প্যাটার্ন, ৫-সেকেন্ড হ্যাকস এবং ১০০ প্রশ্নের ফুল মক টেস্ট।
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <span>আর্টস মিশন শুরু করো</span>
              <FiArrowRight className="text-base group-hover:translate-x-1.5 transition-all" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Home;