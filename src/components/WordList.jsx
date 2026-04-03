import { Volume2, Trash2 } from 'lucide-react';

export default function WordList({ words, onDelete }) {
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    // 1순위: 크롬 내장 고품질 미국 영어 (Google US English)
    // 2순위: 시스템 기본 미국 영어
    // 3순위: 기타 사용 가능한 영어
    const englishVoice = voices.find(v => v.name === 'Google US English')
                      || voices.find(v => v.lang === 'en-US')
                      || voices.find(v => v.lang.startsWith('en'));
                      
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  if (words.length === 0) {
    return (
      <div className="glass-panel fade-in" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        아직 등록된 단어가 없습니다. 위에서 단어를 추가해 보세요!
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {words.map((word) => (
        <div key={word.id} className="glass-panel word-item list-enter">
          <div className="word-info">
            <span className="word-en">
              {word.en}
              <button 
                className="icon-btn speak" 
                onClick={() => speak(word.en)}
                title="발음 듣기"
                aria-label="발음 듣기"
              >
                <Volume2 size={24} strokeWidth={2.5} />
              </button>
            </span>
            <span className="word-ko">{word.ko}</span>
          </div>
          <div className="word-actions">
            <button 
              className="icon-btn delete" 
              onClick={() => onDelete(word.id)}
              title="단어 삭제"
              aria-label="삭제"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
