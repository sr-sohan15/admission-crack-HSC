import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scienceData } from '../Data/Science/scienceData';
import { FiBookmark, FiTrash2, FiArrowLeft, FiZap } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Bookmarks = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('chancehack-bookmarks');
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  const getAllQuestions = () => {
    let allQ = [];

    Object.values(scienceData).forEach((subject) => {
      ['firstPaper', 'secondPaper'].forEach((paperKey) => {
        if (subject[paperKey] && Array.isArray(subject[paperKey])) {
          subject[paperKey].forEach((chapter) => {
            if (chapter.questions && Array.isArray(chapter.questions)) {
              allQ.push(...chapter.questions);
            }
          });
        }
      });

      if (subject.botany && Array.isArray(subject.botany)) {
        subject.botany.forEach((ch) => {
          if (ch.questions && Array.isArray(ch.questions)) {
            allQ.push(...ch.questions);
          }
        });
      }

      if (subject.zoology && Array.isArray(subject.zoology)) {
        subject.zoology.forEach((ch) => {
          if (ch.questions && Array.isArray(ch.questions)) {
            allQ.push(...ch.questions);
          }
        });
      }

      if (subject.chapters && Array.isArray(subject.chapters)) {
        subject.chapters.forEach((ch) => {
          if (ch.questions && Array.isArray(ch.questions)) {
            allQ.push(...ch.questions);
          }
        });
      }
    });

    return allQ;
  };

  const allQuestions = getAllQuestions();

  const bookmarkedQuestions = allQuestions.filter((q) =>
    bookmarkedIds.includes(q.id)
  );

  const removeBookmark = (qId) => {
    const updated = bookmarkedIds.filter((id) => id !== qId);
    setBookmarkedIds(updated);
    localStorage.setItem('chancehack-bookmarks', JSON.stringify(updated));
    toast.info('রিভিশন তালিকা থেকে সরানো হয়েছে');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 space-y-5 sm:space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1">
        <FiArrowLeft className="shrink-0" />
        হোমে ফিরে যান
      </Link>

      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-5 shadow-sm dark:shadow-md transition-colors">
        <div className="min-w-0 w-full">
          <span className="text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <FiZap className="shrink-0" />
            One-Night Revision Hub
          </span>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-tight break-words">
            আমার সেভ করা শর্টকাট ও ট্রিকস
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs lg:text-sm mt-1.5 leading-relaxed max-w-2xl">
            পরীক্ষার আগের রাতে শুধু এই পয়েন্টগুলো রিভিশন দিয়ে যাও
          </p>
        </div>

        <span className="w-full sm:w-auto bg-amber-500/15 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs lg:text-sm font-bold text-center sm:whitespace-nowrap shrink-0">
          মোট সেভড: {bookmarkedQuestions.length} টি
        </span>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-center space-y-3 shadow-sm">
          <FiBookmark className="text-3xl sm:text-4xl text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white">
            কোনো প্রশ্ন বুকমার্ক করা নেই!
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 max-w-sm sm:max-w-md mx-auto leading-relaxed">
            যেকোনো বিষয়ের প্রশ্ন পড়ার সময় বা মক টেস্ট দেওয়ার সময় বুকমার্ক আইকনে ক্লিক করে এখানে সেভ করে রাখতে পারো।
          </p>
        </div>
      ) : (
        <div className="w-full space-y-3 sm:space-y-4">
          {bookmarkedQuestions.map((q, idx) => (
            <div key={q.id || idx} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 space-y-3 sm:space-y-4 shadow-sm overflow-hidden transition-colors">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 sm:px-2.5 py-1 rounded-lg font-bold text-[10px] sm:text-xs leading-tight max-w-[80%] break-words">
                  {q.type || 'শর্টকাট ও ট্রিকস'}
                </span>
                <button
                  onClick={() => removeBookmark(q.id)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                  title="Remove Bookmark"
                >
                  <FiTrash2 className="text-sm sm:text-base" />
                </button>
              </div>

              <h4 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white leading-relaxed break-words">
                <span className="text-emerald-600 dark:text-emerald-400 mr-1.5">{idx + 1}.</span>
                {q.question}
              </h4>

              <div className="w-full p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-xl sm:rounded-2xl space-y-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 overflow-hidden">
                {q.hack && (
                  <p className="font-bold text-emerald-800 dark:text-emerald-400 text-[11px] sm:text-xs lg:text-sm leading-relaxed break-words">
                    {q.hack}
                  </p>
                )}
                {q.eliminationTip && (
                  <p className="text-amber-800 dark:text-amber-300 font-semibold leading-relaxed break-words">
                    {q.eliminationTip}
                  </p>
                )}
                {q.explanation && (
                  <p className="text-slate-600 dark:text-slate-400 pt-2 border-t border-emerald-500/20 dark:border-slate-800 leading-relaxed break-words">
                    <strong className="text-slate-800 dark:text-slate-300">ব্যাখ্যা: </strong> 
                    {q.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;