import { useState } from 'react';
import { Plus, ListPlus, Type, ChevronDown, ChevronUp } from 'lucide-react';

export default function AddWordForm({ onAdd, onAddMultiple }) {
  const [mode, setMode] = useState('single'); 
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [en, setEn] = useState('');
  const [ko, setKo] = useState('');
  const [example, setExample] = useState('');
  const [exampleKo, setExampleKo] = useState('');
  
  const [bulkText, setBulkText] = useState('');

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!en.trim() || !ko.trim()) return;
    onAdd(en.trim(), ko.trim(), example.trim(), exampleKo.trim());
    setEn('');
    setKo('');
    setExample('');
    setExampleKo('');
    setShowAdvanced(false);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!bulkText.trim() || !onAddMultiple) return;
    
    const lines = bulkText.split('\n');
    const newWords = [];
    
    lines.forEach(line => {
      const parts = line.split(/[,:\-\t]/).map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        newWords.push({
          id: Date.now() + Math.random(),
          en: parts[0],
          ko: parts.slice(1).join(', '),
          example: '', exampleKo: ''
        });
      } else {
        const spaceParts = line.trim().split(' ').map(s => s.trim()).filter(Boolean);
        if (spaceParts.length >= 2) {
          newWords.push({
            id: Date.now() + Math.random(),
            en: spaceParts[0],
            ko: spaceParts.slice(1).join(' '),
            example: '', exampleKo: ''
          });
        }
      }
    });

    if (newWords.length > 0) {
      onAddMultiple(newWords);
      setBulkText('');
    } else {
      alert("단어와 뜻이 올바르게 구분된 텍스트를 입력해주세요.");
    }
  };

  return (
    <div className="glass-panel fade-in" style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> 단어 직접 입력
        </h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => setMode('single')}
            style={{ 
              padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem',
              background: mode === 'single' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: mode === 'single' ? '#fff' : 'var(--text-muted)'
            }}
          >
            단건 및 예문 추가
          </button>
          <button 
            type="button" 
            onClick={() => setMode('bulk')}
            style={{ 
              padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem',
              background: mode === 'bulk' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: mode === 'bulk' ? '#fff' : 'var(--text-muted)'
            }}
          >
            대량 추가 (텍스트)
          </button>
        </div>
      </div>

      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="fade-in">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ flex: '1 1 200px' }}>
              <input 
                type="text" 
                placeholder="영어 단어 (예: Apple)" 
                value={en} 
                onChange={(e) => setEn(e.target.value)} 
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <input 
                type="text" 
                placeholder="한국어 뜻 (예: 사과)" 
                value={ko} 
                onChange={(e) => setKo(e.target.value)} 
              />
            </div>
          </div>
          
          {showAdvanced && (
            <div className="fade-in" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--glass-border)' }}>
              <div style={{ flex: '1 1 200px' }}>
                <input 
                  type="text" 
                  placeholder="예문 (선택)" 
                  value={example} 
                  onChange={(e) => setExample(e.target.value)} 
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <input 
                  type="text" 
                  placeholder="예문 해석 (선택)" 
                  value={exampleKo} 
                  onChange={(e) => setExampleKo(e.target.value)} 
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showAdvanced ? '예문 입력창 닫기' : '예문 추가하기 (선택)'}
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={20} /> 추가
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleBulkSubmit} className="fade-in">
          <textarea 
            placeholder="단어와 뜻을 입력해주세요.&#13;&#10;예시:&#13;&#10;Apple - 사과&#13;&#10;Banana, 바나나&#13;&#10;(다중 추가에서는 예문을 자동 등록할 수 없습니다. AI 추가 기능을 이용해보세요!)"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            style={{ 
              width: '100%', minHeight: '120px', background: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', color: 'var(--text-main)', 
              padding: '1rem', borderRadius: '8px', outline: 'none', 
              fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.5',
              marginBottom: '1rem'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ListPlus size={20} /> 텍스트로 일괄 추가
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
