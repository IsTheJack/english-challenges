export default function getRandomSentence(sentences) {
    const collectionSize = sentences.length
    // NOTE temporary solution
    return sentences[Math.floor(Math.random() * collectionSize)]
}
