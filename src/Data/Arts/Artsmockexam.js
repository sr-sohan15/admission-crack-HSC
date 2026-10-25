import { useEffect, useMemo, useState } from "react";
import artsData from "../../Data/Arts/artsData";
import englishBank from "../../Data/Arts/englishBank";
import banglaBank from "../../Data/Arts/banglaBank";
import gkBank from "../../Data/Arts/gkBank";

/* ---------- Settings (official circular dekhe milie nao) ---------- */
const EXAM_MINUTES = 60;
const NEGATIVE_MARK = 0; // jodi negative marking thake, jemon 0.25, ekhane boshao
const SECTIONS = [
  { id: "bangla", label: "বাংলা", count: 34 },
  { id: "english", label: "English", count: 35 },
  { id: "gk", label: "সাধারণ জ্ঞান", count: 31 },
]; // 34 + 35 + 31 = 100

/* ---------- Question pool ---------- */
const getBase = (id) => artsData.subjects.find((s) => s.id === id)?.questions ?? [];

const BANKS = {
  bangla: [...getBase("bangla"), ...banglaBank],
  english: [...getBase("english"), ...englishBank],
  gk: [...getBase("gk"), ...gkBank],
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const dedupe = (list) => {
  const seen = new Set();
  return list.filter((q) => {
    const key = q.question + "|" + q.answer;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildExam = () =>
  SECTIONS.flatMap((s) =>
    shuffle(dedupe(BANKS[s.id]))
      .slice(0, s.count)
      .map((q) => ({ ...q, section: s.id }))
  );

const fmt = (sec) => {
  const s = Math.max(sec, 0);
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
};

/* ---------- Component ---------- */
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

  const choose = (idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current]: idx }));
  };

  const restart = () => {
    setExam(buildExam());
    setAnswers({});
    setCurrent(0);
    setSecondsLeft(EXAM_MINUTES * 60);
    setSubmitted(false);
    setOnlyMissed(true);
  };

  const answeredCount = Object.keys(answers).length;

  /* ---------- Result view ---------- */
  if (submitted && result) {
    const review = exam
      .map((q, i) => ({ q, i, picked: answers[i] }))
      .filter(({ q, picked }) => !onlyMissed || picked !== q.answerIndex);

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-2">Mock Exam Result</h1>
        <p className="text-lg mb-4">
          Score: <span className="font-bold">{result.score}</span> / {exam.length} &nbsp;|&nbsp; Correct {result.correct} &nbsp;|&nbsp; Wrong {result.wrong} &nbsp;|&nbsp; Skipped {result.skipped}
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Skipped</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((s) => (
                <tr key={s.id}>
                  <td>{s.label}</td>
                  <td>{result.bySection[s.id].correct}</td>
                  <td>{result.bySection[s.id].wrong}</td>
                  <td>{result.bySection[s.id].skipped}</td>
                  <td>{result.bySection[s.id].total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button className="btn btn-primary" onClick={restart}>
            New Mock
          </button>
          <label className="label cursor-pointer gap-2">
            <span>Shudhu bhul/skip dekhao</span>
            <input type="checkbox" className="toggle" checked={onlyMissed} onChange={(e) => setOnlyMissed(e.target.checked)} />
          </label>
        </div>

        <div className="space-y-4">
          {review.map(({ q, i, picked }) => (
            <div key={q.id + "-" + i} className="card bg-base-200 p-4">
              <p className="text-sm opacity-70">Q{i + 1} · {SECTIONS.find((s) => s.id === q.section).label}</p>
              <p className="font-semibold mb-2">{q.question}</p>
              <ul className="space-y-1">
                {q.options.map((opt, idx) => {
                  let cls = "";
                  if (idx === q.answerIndex) cls = "text-success font-semibold";
                  else if (idx === picked) cls = "text-error line-through";
                  return (
                    <li key={idx} className={cls}>
                      {opt}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-sm">Hack: {q.hack}</p>
              {picked === undefined && <p className="text-sm text-warning">Skipped</p>}
            </div>
          ))}
          {review.length === 0 && <p>Shob thik! Bhul ba skip kora kono question nei.</p>}
        </div>
      </div>
    );
  }

  /* ---------- Exam view ---------- */
  const q = exam[current];
  const sectionLabel = SECTIONS.find((s) => s.id === q.section).label;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-70">
            Q {current + 1} / {exam.length} · {sectionLabel}
          </p>
          <p className="text-sm opacity-70">Answered: {answeredCount} / {exam.length}</p>
        </div>
        <div className={`text-2xl font-mono font-bold ${secondsLeft < 300 ? "text-error" : ""}`}>{fmt(secondsLeft)}</div>
      </div>

      <h2 className="text-xl font-bold mb-4">{q.question}</h2>

      <div className="space-y-2 mb-6">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            className={`btn w-full justify-start text-left h-auto py-3 ${answers[current] === idx ? "btn-primary" : "btn-outline"}`}
            onClick={() => choose(idx)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button className="btn" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Previous
        </button>
        <button className="btn" disabled={current === exam.length - 1} onClick={() => setCurrent((c) => c + 1)}>
          Next
        </button>
        <button
          className="btn btn-ghost"
          disabled={answers[current] === undefined}
          onClick={() =>
            setAnswers((prev) => {
              const copy = { ...prev };
              delete copy[current];
              return copy;
            })
          }
        >
          Clear
        </button>
        <button
          className="btn btn-success ml-auto"
          onClick={() => {
            if (window.confirm(`${answeredCount}/${exam.length} answer kora hoyeche. Submit korbe?`)) setSubmitted(true);
          }}
        >
          Submit
        </button>
      </div>

      <div className="grid grid-cols-10 gap-1">
        {exam.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`btn btn-xs ${i === current ? "btn-primary" : answers[i] !== undefined ? "btn-success" : "btn-outline"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArtsMockExam;
