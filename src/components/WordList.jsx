import { Volume2, Trash2 } from 'lucide-react';

export default function WordList({ words, onDelete }) {
  const speak = (text) => {
    if (!text) return;
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
        <div 
          key={word.id} 
          className="glass-panel word-item list-enter" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="word-info">
              <span className="word-en">
                {word.en}
                <button className="icon-btn speak" onClick={() => speak(word.en)} title="발음 듣기">
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
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {word.example && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ fontStyle: 'italic', color: '#e2e8f0', flex: 1, lineHeight: '1.4' }}>
                  "{word.example}"
                </span>
                <button 
                  className="icon-btn speak" 
                  onClick={() => speak(word.example)} 
                  title="예문 듣기" 
                  style={{ padding: '0.2rem', color: '#a5b4fc' }}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              {word.exampleKo && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                  {word.exampleKo}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
