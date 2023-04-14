import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Miscbar } from '../components/Miscbar';
import { Loading } from '../components/Loading';
import { QuizOptions } from '../components/QuizOptions';
import type * as I from '../utils/interfaces';
import {
  fetchQuestion,
  getIndexFromLocalStorage,
  getQuestionsFromLocalStorage,
} from '../utils/helpers';
import he from 'he';

interface HomeProps {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  setQuizResult: React.Dispatch<React.SetStateAction<I.QuizResultProps>>;
}

export const Home = ({ user, setUser, setQuizResult }: HomeProps) => {
  const [datas, setDatas] = useState<I.QuizQuestion[]>(
    getQuestionsFromLocalStorage()
  );
  const [questionIndex, setQuestionIndex] = useState<number>(
    getIndexFromLocalStorage()
  );
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn();
    if (datas.length === 0) {
      void (async () => {
        const responseData = await fetchQuestion();
        setDatas(responseData);
        localStorage.setItem('questions', JSON.stringify(responseData));
      })();
    }
  }, []);

  const isLoggedIn = () => {
    if (user === '') {
      navigate('/');
    }
  };

  const isEnded = () => {
    if (questionIndex === 9) {
      navigate('/result');
    }
  };

  const isTimeOut = () => {
    localStorage.removeItem('countdown');
    setQuizResult((prev) => {
      const unAnswered = 10 - (prev.correct + prev.wrong);
      return { ...prev, unAnswered };
    });
    navigate('/result');
  };

  if (datas.length === 0) {
    console.log(datas);
    return <Loading></Loading>;
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser} setQuizResult={setQuizResult}/>
      <div className="flex flex-col gap-4 w-[80%] max-w-[800px] m-auto">
        <Miscbar questionIndex={questionIndex} isTimeOut={isTimeOut}></Miscbar>
        <div className="flex items-center text-center bg-[#2D3346] h-[25vh] rounded-lg px-4">
          <h3 className="w-full font-bold">
            {he.decode(datas[questionIndex].question)}
          </h3>
        </div>
      </div>
      <QuizOptions
        {...datas[questionIndex]}
        setQuestionIndex={setQuestionIndex}
        setQuizResult={setQuizResult}
        isEnded={isEnded}
      ></QuizOptions>
    </div>
  );
};
