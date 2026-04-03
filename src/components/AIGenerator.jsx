import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AIGenerator({ apiKey, onAddMultiple }) {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateWords = async () => {
    if (!apiKey) {
      setError('상단의 설정(⚙️) 아이콘을 눌러 API 키를 먼저 등록해주세요.');
      return;
    }
    if (!topic.trim()) {
      setError('주제나 상황을 입력해주세요. (예: 카페 주문, 토익 등)');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Generate a JSON array of exactly ${count} English words and their Korean meanings related to the topic: "${topic}". Also, for each word, provide one very practical, well-structured, and natural English example sentence (formal or conversational depending on the context of the word) and its Korean translation. Format EXACTLY and ONLY like this: [{"en": "apple", "ko": "사과", "example": "I ate a delicious apple.", "exampleKo": "나는 맛있는 사과를 먹었다."}]. Do not output any markdown code blocks or additional texts, just pure JSON data. Ensure the output is safely parseable valid JSON.`;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || 'API Error');
      
      let text = data.candidates[0].content.parts[0].text;
      
      if (text.startsWith('```json')) text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      else if (text.startsWith('```')) text = text.replace(/```/g, '').trim();
      
      const words = JSON.parse(text);
      if (!Array.isArray(words)) throw new Error('Invalid format returned by AI');
      
      const newWords = words.filter(w => w.en && w.ko).map(w => ({
        id: Date.now() + Math.random(),
        en: String(w.en).trim(),
        ko: String(w.ko).trim(),
        example: w.example ? String(w.example).trim() : '',
        exampleKo: w.exampleKo ? String(w.exampleKo).trim() : ''
      }));

      onAddMultiple(newWords);
      setTopic('');
    } catch (err) {
      console.error(err);
      setError('단어 생성에 실패했습니다. (응답 구조 오류 또는 API 키 만료)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel fade-in" style={{ marginTop: '1.5rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#a5b4fc', fontSize: '1.1rem' }}>
        <Sparkles size={20} /> AI로 단어 및 예문 자동 추가 (추천!)
      </h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <input 
          type="text" 
          placeholder="주제 입력 (예: IT 개발자가 자주 쓰는 표현)" 
          value={topic}
          onChange={e => setTopic(e.target.value)}
          style={{ flex: '1 1 200px' }}
          disabled={loading}
        />
        <select 
          value={count} 
          onChange={e => setCount(Number(e.target.value))}
          style={{ 
            background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)',
            padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none', cursor: 'pointer'
          }}
          disabled={loading}
        >
          <option value={5}>5개</option>
          <option value={10}>10개</option>
          <option value={20}>20개</option>
        </select>
        <button 
          type="button" 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={generateWords}
          disabled={loading}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />} 
          {loading ? '생성 중...' : '만들기'}
        </button>
      </div>
      {error && <div style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.95rem' }}>{error}</div>}
    </div>
  );
}
