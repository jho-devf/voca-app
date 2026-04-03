import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import AddWordForm from './components/AddWordForm';
import WordList from './components/WordList';
import TestSection from './components/TestSection';
import AIGenerator from './components/AIGenerator';
import ReviewList from './components/ReviewList';

function App() {
  const [words, setWords] = useState(() => {
    const saved = localStorage.getItem('voca_words');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wrongWordIds, setWrongWordIds] = useState(() => {
    const saved = localStorage.getItem('voca_wrong_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('list');
  const [testMode, setTestMode] = useState('all'); // 'all' | 'wrong'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('voca_apikey') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');

  useEffect(() => {
    localStorage.setItem('voca_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('voca_wrong_ids', JSON.stringify(wrongWordIds));
  }, [wrongWordIds]);

  useEffect(() => {
    if (apiKey) localStorage.setItem('voca_apikey', apiKey);
    else localStorage.removeItem('voca_apikey');
  }, [apiKey]);

  const handleAddWord = (en, ko) => {
    setWords([{ id: Date.now(), en, ko }, ...words]);
  };

  const handleAddMultiple = (newWords) => {
    setWords([...newWords, ...words]);
  };

  const handleDeleteWord = (id) => {
    setWords(words.filter(w => w.id !== id));
    setWrongWordIds(prev => prev.filter(wId => wId !== id)); // 오답 노트에서도 동시 삭제
  };

  const handleWrongAnswer = (id) => {
    setWrongWordIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };
  
  const handleCorrectAnswer = (id) => {
    setWrongWordIds(prev => prev.filter(wId => wId !== id));
  };
  
  const handleRemoveWrongWord = (id) => {
    setWrongWordIds(prev => prev.filter(wId => wId !== id));
  };

  const handleStartTest = (mode) => {
    setTestMode(mode);
    setActiveTab('test');
  };

  const saveSettings = () => {
    setApiKey(tempKey.trim());
    setShowSettings(false);
  };

  const openSettings = () => {
    setTempKey(apiKey);
    setShowSettings(true);
  };

  const wrongWords = words.filter(w => wrongWordIds.includes(w.id));
  const activeTestWords = testMode === 'wrong' ? wrongWords : words;

  return (
    <div className="fade-in">
      <header className="app-header" style={{ position: 'relative' }}>
        <button 
          onClick={openSettings}
          title="설정 (API 키)"
          className="icon-btn"
          style={{ position: 'absolute', right: '0', top: '0', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '12px' }}
        >
          <Settings size={22} />
        </button>
        
        <h1 className="app-title text-gradient">VocabMaster</h1>
        <p className="app-subtitle">나만의 영단어장과 함께 완벽하게 암기하세요 ✨</p>
      </header>
      
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          단어장 관리
        </button>
        <button 
          className={`nav-tab ${activeTab === 'test' && testMode === 'all' ? 'active' : ''}`}
          onClick={() => handleStartTest('all')}
        >
          전체 테스트
        </button>
        <button 
          className={`nav-tab ${activeTab === 'review' || (activeTab === 'test' && testMode === 'wrong') ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          오답 노트 {wrongWordIds.length > 0 && `🚨`}
        </button>
      </nav>

      <main>
        {activeTab === 'list' && (
          <div>
            <AddWordForm onAdd={handleAddWord} onAddMultiple={handleAddMultiple} />
            <AIGenerator apiKey={apiKey} onAddMultiple={handleAddMultiple} />
            <div style={{ marginTop: '2rem' }}>
              <WordList words={words} onDelete={handleDeleteWord} />
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <TestSection 
            words={activeTestWords} 
            onWrongAnswer={handleWrongAnswer} 
            onCorrectAnswer={handleCorrectAnswer}
            key={testMode} // mode가 바뀔 때 상태 초기화
          />
        )}

        {activeTab === 'review' && (
          <ReviewList 
            wrongWords={wrongWords} 
            onRemove={handleRemoveWrongWord} 
            onStartTest={() => handleStartTest('wrong')} 
          />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content glass-panel fade-in" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={20} /> 설정
              </h3>
              <button className="icon-btn" onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                Google Gemini API Key
              </label>
              <input 
                type="password" 
                placeholder="AI 기능을 위한 API 키 입력" 
                value={tempKey}
                onChange={e => setTempKey(e.target.value)}
              />
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>
                * 입력하신 API 키는 브라우저 내부 스토리지에만 보관되며, 그 어떤 외부 서버로도 전송되지 않습니다.<br/>
                * <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>여기서 무료 키를 발급</a>받으실 수 있습니다.
              </p>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={saveSettings}>
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
