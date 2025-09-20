import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  onSave: () => void;
  editing: FAQ | null;
}

export default function AdminFAQForm({ onSave, editing }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setQuestion(editing.question);
      setAnswer(editing.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/admin/faq', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, id: editing?.id }),
      });

      setQuestion('');
      setAnswer('');
      onSave();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {editing ? 'Edit FAQ' : 'Add New FAQ'}
        </h2>
        
        <div className="space-y-2">
          <label htmlFor="question" className="text-sm font-medium">
            Question
          </label>
          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="answer" className="text-sm font-medium">
            Answer
          </label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer"
            required
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : editing ? 'Update FAQ' : 'Add FAQ'}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setQuestion('');
                setAnswer('');
                onSave();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
} 