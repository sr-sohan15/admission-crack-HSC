import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import Home from "../Pages/Home";
import ScienceHome from "../Pages/Science/ScienceHome";
import SubjectHacks from "../Pages/SubjectHacks";
import MockExam from "../Pages/MockExam";
import Bookmarks from "../Pages/Bookmarks";
import ErrorPage from "../Pages/ErrorPage";
import ArtsHome from "../Pages/Arts/ArtsHome";
import ArtsSubject from "../Pages/Arts/ArtsSubject";
import ArtsMockExam from "../Pages/Arts/ArtsMockExam";
import SuperSuggestion from "../Pages/Arts/SuperSuggestion"; // 👈 নতুন সুপার সাজেশন পেজ ইমপোর্ট করা হলো

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,

      children: [
        {
          index: true,
          element: <Home />,
        },

        {
          path: "science",
          element: <ScienceHome />,
        },

        {
          path: "science/subject/:subjectId",
          element: <SubjectHacks />,
        },

        {
          path: "science/mock",
          element: <MockExam />,
        },

        {
          path: "arts",
          element: <ArtsHome />,
        },

        {
          path: "arts/subject/:subjectId",
          element: <ArtsSubject />,
        },

        {
          path: "arts/suggestion/:subjectId", // 👈 নতুন সুপার সাজেশন রুট যোগ করা হলো
          element: <SuperSuggestion />,
        },

        {
          path: "arts/mock",
          element: <ArtsMockExam />,
        },

        {
          path: "mock-exam",
          element: <MockExam />,
        },

        {
          path: "bookmarks",
          element: <Bookmarks />,
        },
      ],
    },
  ],
  {
    basename: "/admission-crack",
  }
);