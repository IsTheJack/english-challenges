import React from 'react';
import Timeline from "react-time-line";
import moment from 'moment'

import './App.css';

import getRandomSentence from './helpers/getRandomSentence'
import words from './assets/json/words.json'

import { difference, get, cloneDeep } from "lodash";

const reviewLogic = [0, 1, 3, 7, 15, 30, 45, 60, 90, 120, 365, 546, 720]

function App() {
  const [randomWord, setRandomWord] = React.useState(undefined)
  const [randomWordToReview, setRandomWordToReview] = React.useState(undefined)
  const [studiedWords, setStudiedWords] = React.useState([])
  const [isReviewMode, setIsReviewMode] = React.useState(false)
  const studiedWordsNames = studiedWords.map(studiedWord => studiedWord.word)
  const availableWords = difference(words, studiedWordsNames)

  const getWordsToReview = () => {
    // Filtrar as palavras estudadas
    // Comparar a data de primeiro estudo usando a lógica de revisão com a data atual
    // - Data de primeiro estudo + lógica de revisão (em dias) tem que ser menor que a data atual

    // Retornar todas as palavras que respeitem essa regra

    return studiedWords
      .map((studiedWord, index) => ({ ...studiedWord, studiedWordsIndexItem: index }))
      .filter(studiedWord => {
        const { firstStudyDate, logicIndex } = studiedWord;
        const daysToAdd = reviewLogic[logicIndex];

        const dateToReview = moment(firstStudyDate).add(daysToAdd, "days");

        const shouldReview = dateToReview.isSameOrBefore(moment(), "days");

        return shouldReview;
      });
  }

  const wordsToReview = getWordsToReview()

  // ts and text
  const events = studiedWords.map(studiedWord => ({
    ts: moment(studiedWord.firstStudyDate).toISOString(),
    text: studiedWord.word
  }));

  const changeRandomSentence = () => {
    setRandomWord(getRandomSentence(availableWords))
  }
  
  const changeRandomWordToReview = () => {
    setRandomWordToReview(getRandomSentence(wordsToReview));
  }

  const checkWordAsStudied = (word) => {
    setStudiedWords([...studiedWords, {
      word,
      logicIndex: 0,
      firstStudyDate: Date.now(),
    }])
    setRandomWord(undefined)
  }

  React.useEffect(() => {
    const studiedWordsKey = 'english-challenges::studiedWords'

    if (studiedWords.length > 0) {
      return localStorage.setItem(studiedWordsKey, JSON.stringify(studiedWords))
    }

    const hasStudiedInLocalStorage = !!localStorage.getItem(studiedWordsKey)

    if (hasStudiedInLocalStorage) {
      return setStudiedWords(JSON.parse(localStorage.getItem(studiedWordsKey)))
    }
  }, [studiedWords])
  
  React.useEffect(() => {
    if (!wordsToReview.length) {
      setIsReviewMode(false)
    } else {
      changeRandomWordToReview()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsToReview.length]);

  const reviewWord = (wordObj) => {
    const wordIndex = wordObj.studiedWordsIndexItem;
    const newStudiedWordsObj = cloneDeep(studiedWords);
    newStudiedWordsObj[wordIndex].logicIndex += 1;

    setStudiedWords(newStudiedWordsObj);
  }
  
  const resetReviewWord = wordObj => {
    const wordIndex = wordObj.studiedWordsIndexItem;
    const newStudiedWordsObj = cloneDeep(studiedWords);
    newStudiedWordsObj[wordIndex].logicIndex = 0;

    setStudiedWords(newStudiedWordsObj);
    changeRandomWordToReview();
  };

  return (
    <div className="app">
      <div className="main-column">
        {!!availableWords.length && !isReviewMode && (
          <>
            {!!wordsToReview.length && (
              <button
                onClick={() => {
                  setIsReviewMode(true);
                  changeRandomWordToReview();
                }}
                className="btn-default"
              >
                Review ({wordsToReview.length})
              </button>
            )}

            <button onClick={changeRandomSentence} className="btn-default">
              Get Random Word
            </button>

            <h1>{randomWord}</h1>

            {randomWord && (
              <>
                <a
                  className="link"
                  href={`https://translate.google.com/#view=home&op=translate&sl=en&tl=pt&text=${randomWord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See google translate
                </a>

                <a
                  className="link"
                  href={`https://context.reverso.net/traducao/ingles-portugues/${randomWord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See Reverso definitions
                </a>

                <a
                  className="link"
                  href={`https://www.wordreference.com/enpt/${randomWord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See Word Reference definitions
                </a>

                <button onClick={() => checkWordAsStudied(randomWord)}>
                  Mark as studied
                </button>
              </>
            )}
          </>
        )}

        {!!wordsToReview.length && isReviewMode && (
          <div className="main-column">
            <h1>{get(randomWordToReview, "word")}</h1>

            {get(randomWordToReview, "word") && (
              <>
                <a
                  className="link"
                  href={`https://translate.google.com/#view=home&op=translate&sl=en&tl=pt&text=${get(
                    randomWordToReview,
                    "word"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See google translate
                </a>

                <a
                  className="link"
                  href={`https://context.reverso.net/traducao/ingles-portugues/${get(
                    randomWordToReview,
                    "word"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See Reverso definitions
                </a>

                <a
                  className="link"
                  href={`https://www.wordreference.com/enpt/${get(
                    randomWordToReview,
                    "word"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See Word Reference definitions
                </a>

                <div>
                  <button onClick={() => reviewWord(randomWordToReview)}>
                    I know this word
                  </button>

                  <button onClick={() => resetReviewWord(randomWordToReview)}>
                    I don't know this word
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {!availableWords.length && (
          <>
            <h1>Congratulations!</h1>
            <h2>You finished the challenge</h2>
          </>
        )}
      </div>

      <div className="history-column">
        <h1 className="history-title">
          History <small>({studiedWords.length})</small>
        </h1>

        <div>
          <Timeline items={events} />
        </div>
      </div>
    </div>
  );
}

export default App;
