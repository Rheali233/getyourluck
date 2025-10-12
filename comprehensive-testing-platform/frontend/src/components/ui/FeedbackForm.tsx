/**
 * 通用反馈表单（内部使用）
 */
import React, { useCallback, useState } from 'react';
import { UI_TEXT } from '../../../../shared/constants';
import type { FeedbackCategory, FeedbackPayload } from '../../../../shared/types';
import { Button } from './Button';
import { Input } from './Input';

export interface FeedbackFormProps {
  initialCategory?: FeedbackCategory;
  onSubmit: (data: Omit<FeedbackPayload, 'client' | 'createdAt'>) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  initialCategory,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [rating, setRating] = useState<number>(0);
  const category: FeedbackCategory = initialCategory || 'other';
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [uploadedKeys] = useState<string[]>([]);

  const validate = useCallback((): string | null => {
    if (!rating || rating < 1 || rating > 5) return UI_TEXT.feedback.validation.ratingRequired;
    if (!category) return UI_TEXT.feedback.validation.categoryRequired;
    if (!message || message.trim().length < 10) return UI_TEXT.feedback.validation.messageRequired;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return UI_TEXT.feedback.validation.emailInvalid;
    return null;
  }, [rating, category, message, email]);

  const handleSubmit = useCallback(async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    await onSubmit({
      rating,
      category,
      message: message.trim(),
      email: email,
      canContact: false,
      images: uploadedKeys,
    } as Omit<FeedbackPayload, 'client' | 'createdAt'>);
  }, [validate, onSubmit, rating, category, message, email]);

  return (
    <div aria-label={UI_TEXT.feedback.a11y.dialogLabel} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{UI_TEXT.feedback.ratingLabel}</label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label={UI_TEXT.feedback.ratingLabel}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={rating >= n}
              onClick={() => setRating(n)}
              className="h-8 w-8 flex items-center justify-center focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={rating >= n ? '#f59e0b' : 'none'}
                stroke="#f59e0b"
                className="h-7 w-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.01 4.073a.563.563 0 0 0 .424.308l4.496.654a.562.562 0 0 1 .311.959l-3.252 3.168a.563.563 0 0 0-.162.498l.768 4.48a.562.562 0 0 1-.815.592L12.53 16.98a.563.563 0 0 0-.522 0l-4.037 2.123a.562.562 0 0 1-.815-.592l.768-4.48a.563.563 0 0 0-.162-.498L4.51 9.493a.562.562 0 0 1 .311-.959l4.496-.654a.563.563 0 0 0 .424-.308l2.01-4.073Z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Category field removed by request */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{UI_TEXT.feedback.messageLabel}</label>
        <textarea
          className="w-full min-h-[112px] rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={UI_TEXT.feedback.messagePlaceholder}
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          aria-invalid={!!error && message.trim().length < 10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{UI_TEXT.feedback.emailLabel}</label>
        <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
      </div>

      {/* contact consent removed */}

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            {UI_TEXT.feedback.cancel}
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? UI_TEXT.feedback.submitting : 'Submit'}
        </Button>
      </div>
    </div>
  );
};


