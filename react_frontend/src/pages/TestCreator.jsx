import React, { useEffect, useMemo, useState } from 'react';
import { listTests, createTest, submitResponses, evaluateTest } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * TestCreator lets users create tests with simple question types and see list of existing tests.
 */
export default function TestCreator() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  const canAdd = useMemo(() => title.trim().length > 0 && questions.length > 0, [title, questions]);

  const loadTests = async () => {
    setErr('');
    try {
      const data = await listTests();
      setTests(Array.isArray(data) ? data : (data?.items || []));
    } catch (e) {
      setErr(e.message || 'Failed to fetch tests');
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const addQuestion = (type) => {
    if (type === 'mcq') {
      setQuestions(qs => [...qs, { id: Date.now(), type: 'multiple-choice', text: '', choices: ['', ''], answer: 0 }]);
    } else {
      setQuestions(qs => [...qs, { id: Date.now(), type: 'short-answer', text: '', answer: '' }]);
    }
  };

  const updateQuestionText = (id, text) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, text } : q));
  };

  const updateChoice = (id, idx, text) => {
    setQuestions(qs => qs.map(q => {
      if (q.id !== id) return q;
      const choices = [...(q.choices || [])];
      choices[idx] = text;
      return { ...q, choices };
    }));
  };

  const addChoice = (id) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, choices: [...(q.choices || []), ''] } : q));
  };

  const setCorrectIndex = (id, idx) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, answer: idx } : q));
  };

  const setShortAnswer = (id, answer) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, answer } : q));
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setQuestions([]);
  };

  const onCreate = async () => {
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      const payload = {
        title: title.trim(),
        description: desc.trim(),
        questions: questions.map(q => {
          if (q.type === 'multiple-choice') {
            return { type: q.type, text: q.text, choices: q.choices, answer: q.answer };
          }
          return { type: q.type, text: q.text, answer: q.answer };
        })
      };
      const res = await createTest(payload);
      setSuccess(`Created test: ${res?.title || payload.title}`);
      resetForm();
      await loadTests();
    } catch (e) {
      setErr(e.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitStub = async (testId) => {
    setErr('');
    try {
      await submitResponses(testId, { responses: [] });
      setSuccess('Submitted responses placeholder');
    } catch (e) {
      setErr(e.message || 'Submit failed');
    }
  };

  const onEvaluate = async (testId) => {
    setErr('');
    try {
      await evaluateTest(testId);
      setSuccess('Evaluation triggered');
    } catch (e) {
      setErr(e.message || 'Evaluate failed');
    }
  };

  return (
    <div className="test-creator">
      <h1 className="section-title">Test Creator</h1>
      {err && <div className="card" style={{ borderColor: 'rgba(220,38,38,0.3)' }}>{err}</div>}
      {success && <div className="card" style={{ borderColor: 'rgba(5,150,105,0.3)' }}>{success}</div>}

      <div className="grid two">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>New Test</h2>
          <div className="col">
            <label>Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter test title" />
          </div>
          <div className="col" style={{ marginTop: 8 }}>
            <label>Description</label>
            <textarea className="textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Enter description" />
          </div>

          <div className="row" style={{ marginTop: 12, gap: 8 }}>
            <button className="btn" onClick={() => addQuestion('mcq')}>Add Multiple Choice</button>
            <button className="btn secondary" onClick={() => addQuestion('short')}>Add Short Answer</button>
          </div>

          <div className="col" style={{ marginTop: 16, gap: 16 }}>
            {questions.map((q, i) => (
              <div key={q.id} className="card">
                <div className="badge">Question {i + 1} • {q.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer'}</div>
                <div className="col" style={{ marginTop: 8 }}>
                  <label>Question Text</label>
                  <input className="input" value={q.text} onChange={e => updateQuestionText(q.id, e.target.value)} placeholder="Enter question text" />
                </div>
                {q.type === 'multiple-choice' ? (
                  <div className="col" style={{ marginTop: 8 }}>
                    <label>Choices</label>
                    {q.choices.map((c, idx) => (
                      <div key={idx} className="row" style={{ alignItems: 'center' }}>
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.answer === idx}
                          onChange={() => setCorrectIndex(q.id, idx)}
                          aria-label={`Mark choice ${idx + 1} as correct`}
                        />
                        <input className="input" value={c} onChange={e => updateChoice(q.id, idx, e.target.value)} placeholder={`Choice ${idx + 1}`} />
                      </div>
                    ))}
                    <button className="btn ghost" onClick={() => addChoice(q.id)} style={{ marginTop: 8 }}>Add Choice</button>
                  </div>
                ) : (
                  <div className="col" style={{ marginTop: 8 }}>
                    <label>Expected Answer</label>
                    <input className="input" value={q.answer} onChange={e => setShortAnswer(q.id, e.target.value)} placeholder="Enter expected answer" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" onClick={onCreate} disabled={!canAdd || loading}>
              {loading ? 'Creating...' : 'Create Test'}
            </button>
            <button className="btn ghost" onClick={resetForm}>Reset</button>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Existing Tests</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr><td colSpan="4" style={{ color: '#6B7280' }}>No tests found</td></tr>
                ) : tests.map(t => (
                  <tr key={t.id || t._id || t.title}>
                    <td>{t.title}</td>
                    <td>{t.description}</td>
                    <td><code>{t.id || t._id || '—'}</code></td>
                    <td className="row">
                      <button className="btn ghost" onClick={() => onSubmitStub(t.id || t._id)}>Submit</button>
                      <button className="btn secondary" onClick={() => onEvaluate(t.id || t._id)}>Evaluate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn ghost" onClick={loadTests}>Refresh</button>
          </div>
        </div>
      </div>
    </div>
  );
}
