import { useState, useEffect } from 'react';
import { RefreshCw, Play } from 'lucide-react';

export default function TestSection({ words, onWrongAnswer, onCorrectAnswer }) {
  const [testWords, setTestWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startTest = () => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setTestWords(shuffled);
    setCurrentIndex(0);
    setInputVal('');
    setFeedback(null);
    setScore(0);
    setIsFinished(false);
    setIsStarted(true);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.name === 'Google US English')
                      || voices.find(v => v.lang === 'en-US')
                      || voices.find(v => v.lang.startsWith('en'));
                      
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || feedback) return;

    const currentWord = testWords[currentIndex];
    const isCorrect = inputVal.trim().toLowerCase() === currentWord.en.toLowerCase();
    
    if (isCorrect) {
      setFeedback('success');
      setScore(s => s + 1);
      speak(currentWord.en); // 정답일 경우 발음 읽어주기!
      if (onCorrectAnswer) onCorrectAnswer(currentWord.id);
    } else {
      setFeedback('error');
      if (onWrongAnswer) onWrongAnswer(currentWord.id);
    }

    setTimeout(() => {
      if (currentIndex + 1 < testWords.length) {
        setCurrentIndex(c => c + 1);
        setInputVal('');
        setFeedback(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  if (words.length < 3) {
    return (
      <div className="glass-panel fade-in" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        테스트를 진행하려면 최소 3개 이상의 해당 그룹 단어가 필요합니다.
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="glass-panel fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '2rem' }}>테스트 준비 완료!</h2>
        <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
           단어들이 무작위 순서로 출제됩니다. <br />
           한국어 뜻을 보고 올바른 <strong>영어 단어(스펠링)</strong>를 직접 입력하세요.
        </p>
        <button className="btn-primary" onClick={startTest} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', padding: '1rem 2rem', borderRadius: '50px' }}>
          <Play size={24} /> 시작하기
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="glass-panel fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="app-title text-gradient">테스트 종료! 🎉</h2>
        <p style={{ fontSize: '1.5rem', margin: '2rem 0', color: 'var(--text-main)' }}>
          총 {testWords.length}문제 중 <strong style={{ color: 'var(--primary)', fontSize: '2.5rem', margin: '0 0.5rem' }}>{score}</strong>문제를 맞혔습니다!
        </p>
        <button className="btn-primary" onClick={startTest} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <RefreshCw size={20} /> 다시 플레이하기
        </button>
      </div>
    );
  }

  const currentWord = testWords[currentIndex];

  return (
    <div className="glass-panel fade-in test-container">
      <div style={{ color: 'var(--primary)', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 700 }}>
        QUESTION {currentIndex + 1} OF {testWords.length}
      </div>
      
      <div className="test-word text-gradient">
        {currentWord.ko}
      </div>

      <form className="test-input-group" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="영어 단어를 직접 입력하세요"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={feedback !== null}
          autoFocus
          style={{ 
            borderColor: feedback === 'success' ? 'var(--success)' : feedback === 'error' ? 'var(--danger)' : 'var(--glass-border)',
            boxShadow: feedback ? 'none' : undefined,
            fontSize: '1.2rem'
          }}
        />
        <button type="submit" className="btn-primary" disabled={feedback !== null || !inputVal.trim()} style={{ minWidth: '100px' }}>
          확인
        </button>
      </form>

      <div className="feedback-text fade-in" style={{ visibility: feedback ? 'visible' : 'hidden' }}>
        {feedback === 'success' ? (
          <span className="feedback-success">정답입니다! 너무 잘 하셨어요 ✨</span>
        ) : (
          <span className="feedback-error">
            틀렸습니다! 오답 노트에 기록됩니다. 정답은 <strong>{currentWord.en}</strong> 입니다.
          </span>
        )}
      </div>
    </div>
  );
}
