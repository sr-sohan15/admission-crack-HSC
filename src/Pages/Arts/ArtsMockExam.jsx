import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import { artsSubjects } from '../../Data/Arts/artsBanks';

/* ---------- Settings (official circular dekhe milie nao) ---------- */
const EXAM_MINUTES = 60;
const NEGATIVE_MARK = 0; // negative marking thakle ekhane boshao, jemon 0.25
const SECTIONS = [
  { id: 'bangla', label: 'বাংলা', count: 34 },
  { id: 'english', label: 'English', count: 35 },
  { id: 'gk', label: 'সাধারণ জ্ঞান', count: 31 },
]; // 34 + 35 + 31 = 100

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildExam = () =>
  SECTIONS.flatMap((s) => {
    const sub = artsSubjects.find((x) => x.id === s.id);
    return shuffle(sub ? sub.questions : [])
      .slice(0, s.count)
      .map((q) => ({ ...q, section: s.id }));
  });

const fmt = (sec) => {
  const s = Math.max(sec, 0);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const card = 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl';

const ArtsMockExam = () => {
  const [exam, setExam] = useState(buildExam);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60);
  const [submitted, setSubmitted] = useState(false);
  const [onlyMissed, setOnlyMissed] = useState(true);

  useEffect(() => {
    if (submitted) return undefined;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  useEffect(() => {
    if (secondsLeft <= 0 && !submitted) setSubmitted(true);
  }, [secondsLeft, submitted]);

  const result = useMemo(() => {
    if (!submitted) return null;
    const bySection = {};
    SECTIONS.forEach((s) => (bySection[s.id] = { correct: 0, wrong: 0, skipped: 0, total: 0 }));
    exam.forEach((q, i) => {
      const r = bySection[q.section];
      r.total += 1;
      if (answers[i] === undefined) r.skipped += 1;
      else if (answers[i] === q.answerIndex) r.correct += 1;
      else r.wrong += 1;
    });
    const all = Object.values(bySection);
    const correct = all.reduce((a, r) => a + r.correct, 0);
    const wrong = all.reduce((a, r) => a + r.wrong, 0);
    const skipped = all.reduce((a, r) => a + r.skipped, 0);
    return { bySection, correct, wrong, skipped, score: correct - wrong * NEGATIVE_MARK };
  }, [submitted, exam, answers]);

  const restart = () => {
    setExam(buildExam());
    setAnswers({});
    setCurrent(0);
    setSecondsLeft(EXAM_MINUTES * 60);
    setSubmitted(false);
    setOnlyMissed(true);
  };

  const answeredCount = Object.keys(answers).length;
  const btn = 'px-4 py-2 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  /* ---------- Result view ---------- */
  if (submitted && result) {
    const review = exam
      .map((q, i) => ({ q, i, picked: answers[i] }))
      .filter(({ q, picked }) => !onlyMissed || picked !== q.answerIndex);

    return (
      <div className="max-w-3xl w-full mx-auto py-2 space-y-5">
        <div className={`${card} p-6 space-y-2`}>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">মক টেস্ট রেজাল্ট</h2>
          <p className="text-lg text-slate-800 dark:text-slate-200">
            স্কোর: <span className="font-black text-emerald-600 dark:text-emerald-400">{result.score}</span> / {exam.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            সঠিক {result.correct} · ভুল {result.wrong} · স্কিপ {result.skipped}
          </p>
        </div>

        <div className={`${card} p-4 overflow-x-auto`}>
          <table className="w-full text-sm text-slate-800 dark:text-slate-200">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="py-2">বিষয়</th>
                <th>সঠিক</th>
                <th>ভুল</th>
                <th>স্কিপ</th>
                <th>মোট</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((s) => (
                <tr key={s.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-2 font-semibold">{s.label}</td>
                  <td>{result.bySection[s.id].correct}</td>
                  <td>{result.bySection[s.id].wrong}</td>
                  <td>{result.bySection[s.id].skipped}</td>
                  <td>{result.bySection[s.id].total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" className={`${btn} bg-emerald-500 text-slate-950`} onClick={restart}>
            নতুন মক টেস্ট
          </button>
          <Link to="/arts" className={`${btn} bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200`}>
            আর্টস হোম
          </Link>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" checked={onlyMissed} onChange={(e) => setOnlyMissed(e.target.checked)} />
            শুধু ভুল/স্কিপ দেখাও
          </label>
        </div>

        <div className="space-y-3">
          {review.map(({ q, i, picked }) => (
            <div key={q.id + '-' + i} className={`${card} p-4 space-y-2`}>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Q{i + 1} · {SECTIONS.find((s) => s.id === q.section).label}
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">{q.question}</p>
              <ul className="space-y-1 text-sm">
                {q.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={
                      idx === q.answerIndex
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : idx === picked
                        ? 'text-red-500 line-through'
                        : 'text-slate-600 dark:text-slate-400'
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-700 dark:text-slate-300">হ্যাক: {q.hack}</p>
              {picked === undefined && <p className="text-xs text-amber-600 dark:text-amber-400">স্কিপ করা হয়েছে</p>}
            </div>
          ))}
          {review.length === 0 && <p className="text-slate-600 dark:text-slate-400">সব ঠিক! কোনো ভুল বা স্কিপ নেই।</p>}
        </div>
      </div>
    );
  }

  /* ---------- Exam view ---------- */
  const q = exam[current];
  const sectionLabel = SECTIONS.find((s) => s.id === q.section).label;
  const optClass = (selected) =>
    'w-full text-left px-4 py-3 rounded-2xl border text-sm transition-all cursor-pointer ' +
    (selected
      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/60');

  return (
    <div className="max-w-3xl w-full mx-auto py-2 space-y-5">
      <div className={`${card} p-4 flex items-center justify-between`}>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            প্রশ্ন {current + 1} / {exam.length} · {sectionLabel}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            উত্তর দেওয়া: {answeredCount} / {exam.length}
          </p>
        </div>
        <div
          className={`text-2xl font-mono font-black inline-flex items-center gap-2 ${
            secondsLeft < 300 ? 'text-red-500' : 'text-slate-900 dark:text-white'
          }`}
        >
          <FiClock /> {fmt(secondsLeft)}
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">{q.question}</h3>

      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            className={optClass(answers[current] === idx)}
            onClick={() => setAnswers((prev) => ({ ...prev, [current]: idx }))}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button type="button" className={`${btn} bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200`} disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          আগের
        </button>
        <button type="button" className={`${btn} bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200`} disabled={current === exam.length - 1} onClick={() => setCurrent((c) => c + 1)}>
          পরের
        </button>
        <button
          type="button"
          className={`${btn} text-slate-600 dark:text-slate-400`}
          disabled={answers[current] === undefined}
          onClick={() =>
            setAnswers((prev) => {
              const copy = { ...prev };
              delete copy[current];
              return copy;
            })
          }
        >
          মুছুন
        </button>
        <button
          type="button"
          className={`${btn} bg-emerald-500 text-slate-950 ml-auto`}
          onClick={() => {
            if (window.confirm(`${answeredCount}/${exam.length} উত্তর দেওয়া হয়েছে। সাবমিট করবে?`)) setSubmitted(true);
          }}
        >
          সাবমিট
        </button>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {exam.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-8 rounded-lg text-[11px] font-bold cursor-pointer ${
              i === current
                ? 'bg-emerald-500 text-slate-950'
                : answers[i] !== undefined
                ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArtsMockExam;