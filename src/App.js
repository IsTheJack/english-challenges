import React from 'react';
import './App.css';

import getRandomSentence from './helpers/getRandomSentence'
import words from './assets/json/words.json'

import { difference } from 'lodash'

function App() {
  const [randomWord, setRandomSentence] = React.useState(undefined)
  const [studiedWords, setStudiedWords] = React.useState([])
  const availableWords = difference(words, studiedWords)

  const changeRandomSentence = () => {
    setRandomSentence(getRandomSentence(availableWords))
  }

  const checkWordAsStudied = (word) => {
    setStudiedWords([...studiedWords, word])
    setRandomSentence(undefined)
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

  return (
    <div className="app">
      <div className="main-column">
        {!!availableWords.length && (
          <>
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
          {studiedWords.map(word => (
            <p key={word}>{word}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
