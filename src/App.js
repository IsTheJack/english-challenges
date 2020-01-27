import React from 'react';
import Timeline from "react-time-line";
import moment from 'moment'

import { Button, AppBar, Typography, Toolbar, Fab } from "@material-ui/core";
import { Done as DoneIcon, ThumbDown, ThumbUp } from "@material-ui/icons";

import './App.css';

import getRandomSentence from './helpers/getRandomSentence'
import words from './assets/json/words.json'

import { difference, get, cloneDeep } from "lodash";
import AppTemplate from './components/AppTemplate';

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
    <AppTemplate>
      {(pageIndex) => {
        return (
          <div className="app__body">
            <AppBar position="fixed">
              <Toolbar variant="dense">
                <Typography variant="h6" color="inherit">
                  {pageIndex === 0 ? "Home" : "History"}
                </Typography>
              </Toolbar>
            </AppBar>
            <Toolbar />
            {pageIndex === 0 && (
              <div className="app__home-container">
                {!!availableWords.length && !isReviewMode && (
                  <>
                    <div className="app__main-actions-container">
                      <Button
                        onClick={changeRandomSentence}
                        color="primary"
                        variant="contained"
                        size="large"
                      >
                        Get Random Word
                      </Button>

                      {!!wordsToReview.length && (
                        <Button
                          onClick={() => {
                            setIsReviewMode(true);
                            changeRandomWordToReview();
                          }}
                          color="secondary"
                          variant="contained"
                          size="large"
                        >
                          Review ({wordsToReview.length})
                        </Button>
                      )}
                    </div>

                    <h1 className="app__current-word">{randomWord}</h1>

                    {randomWord && (
                      <div className="app__work-actions">
                        <div className="app__services-links">
                          <Button
                            className="link"
                            href={`https://translate.google.com/#view=home&op=translate&sl=en&tl=pt&text=${randomWord}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                          >
                            See google translate
                          </Button>

                          <Button
                            className="link"
                            href={`https://context.reverso.net/traducao/ingles-portugues/${randomWord}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                          >
                            See Reverso definitions
                          </Button>

                          <Button
                            className="link"
                            href={`https://www.wordreference.com/enpt/${randomWord}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                          >
                            See Word Reference definitions
                          </Button>
                        </div>

                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<DoneIcon />}
                          onClick={() => checkWordAsStudied(randomWord)}
                        >
                          Mark as studied
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {!!wordsToReview.length && isReviewMode && (
                  <div className="main-column">
                    <h1 className="app__current-word">
                      {get(randomWordToReview, "word")}
                    </h1>

                    {get(randomWordToReview, "word") && (
                      <>
                        <div className="app__services-links">
                          <div className="app__services-links">
                            <Button
                              className="link"
                              href={`https://translate.google.com/#view=home&op=translate&sl=en&tl=pt&text=${get(
                                randomWordToReview,
                                "word"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                            >
                              See google translate
                            </Button>

                            <Button
                              className="link"
                              href={`https://context.reverso.net/traducao/ingles-portugues/${get(
                                randomWordToReview,
                                "word"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                            >
                              See Reverso definitions
                            </Button>

                            <Button
                              className="link"
                              href={`https://www.wordreference.com/enpt/${get(
                                randomWordToReview,
                                "word"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="contained"
                            >
                              See Word Reference definitions
                            </Button>
                          </div>
                        </div>

                        <div className="app__review-buttons-container">
                          <Fab
                            onClick={() => reviewWord(randomWordToReview)}
                            color="primary"
                            aria-label="add"
                            className="app__review-buttons"
                          >
                            <ThumbUp />
                          </Fab>

                          <Fab
                            onClick={() => resetReviewWord(randomWordToReview)}
                            color="secondary"
                            aria-label="add"
                            className="app__review-buttons"
                          >
                            <ThumbDown />
                          </Fab>
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
            )}
            {pageIndex === 1 && (
              <div>
                <div>
                  <Timeline items={events} />
                </div>
              </div>
            )}
          </div>
        );
      }}
    </AppTemplate>
  );
}

export default App;
