import artsData from "./artsData";
import englishBank from "./englishBank";
import banglaBank from "./banglaBank";
import gkBank from "./gkBank";

const base = (id) => artsData.subjects.find((s) => s.id === id)?.questions ?? [];

const dedupe = (list) => {
  const seen = new Set();
  return list.filter((q) => {
    const key = q.question + "|" + q.answer;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const makeSubject = (id, name, tagline, extra) => {
  const questions = dedupe([...base(id), ...extra]);
  const topics = [...new Set(questions.map((q) => q.topic))];
  return { id, name, tagline, questions, topics };
};

export const artsMeta = {
  title: "GST B Unit (Arts)",
  subtitle:
    "বাংলা, ইংরেজি ও সাধারণ জ্ঞানের মোস্ট কমন প্যাটার্ন, ৫-সেকেন্ড হ্যাকস এবং ১০০ প্রশ্নের ফুল মক টেস্ট।",
};

export const artsSubjects = [
  makeSubject("bangla", "বাংলা", "ব্যাকরণ, বানান, বাগধারা ও সাহিত্য", banglaBank),
  makeSubject("english", "English", "Grammar, Vocabulary, Idiom ও Preposition", englishBank),
  makeSubject("gk", "সাধারণ জ্ঞান", "বাংলাদেশ, আন্তর্জাতিক বিষয়াবলি ও বিজ্ঞান", gkBank),
];

export default artsSubjects;