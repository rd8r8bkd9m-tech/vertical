import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestionType?: 'estimate' | 'measurement' | 'document' | 'calculation';
    data?: any;
  };
}

export interface ChatInterfaceProps {
  messages?: ChatMessage[];
  onSendMessage: (content: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
  title?: string;
}

export function ChatInterface({
  messages = [],
  onSendMessage,
  isProcessing = false,
  placeholder = 'Спросите о смете, замере или расчётах...',
  title = 'AI Ассистент'
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const quickActions = [
    { label: '📊 Рассчитать смету', value: 'Помоги рассчитать смету на штукатурные работы' },
    { label: '📏 Новый замер', value: 'Как правильно сделать замер помещения?' },
    { label: '📄 Создать КП', value: 'Создай коммерческое предложение' },
    { label: '💡 Советы', value: 'Дай советы по оптимизации расходов' }
  ];

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-avatar">
            <span>В</span>
          </div>
          <div className="chat-title-info">
            <h3>{title}</h3>
            <span className="chat-status">{isProcessing ? 'Печатает...' : 'Онлайн'}</span>
          </div>
        </div>
        <button className="chat-settings-btn" title="Настройки">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4>Чем могу помочь?</h4>
            <p>Задайте вопрос о смете, расчётах или замерах</p>
            
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => onSendMessage(action.value)}
                  disabled={isProcessing}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.role}`}
          >
            {message.role === 'assistant' && (
              <div className="message-avatar assistant-avatar">
                <span>В</span>
              </div>
            )}
            
            <div className="message-content-wrapper">
              <div className="message-header">
                <span className="message-role">
                  {message.role === 'user' ? 'Вы' : 'Ассистент'}
                </span>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              <div className="message-body">
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>

              {message.metadata?.suggestionType && (
                <div className="message-suggestions">
                  <span className="suggestion-label">Предложение:</span>
                  <button className="suggestion-chip">
                    {message.metadata.suggestionType === 'estimate' && '📊 Создать смету'}
                    {message.metadata.suggestionType === 'measurement' && '📏 Добавить замер'}
                    {message.metadata.suggestionType === 'document' && '📄 Экспорт документа'}
                    {message.metadata.suggestionType === 'calculation' && '🧮 Детальный расчёт'}
                  </button>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="message-avatar user-avatar">
                <span>Я</span>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="chat-message assistant processing">
            <div className="message-avatar assistant-avatar">
              <span>В</span>
            </div>
            <div className="message-content-wrapper">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isProcessing}
            className="chat-textarea"
          />
          
          <div className="chat-input-actions">
            <button
              type="button"
              className="attach-btn"
              title="Прикрепить файл"
              disabled={isProcessing}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            
            <button
              type="submit"
              className="send-btn"
              disabled={!inputValue.trim() || isProcessing}
              title="Отправить (Enter)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>
        
        <div className="chat-footer-hint">
          <span>Нажмите Enter для отправки, Shift+Enter для новой строки</span>
        </div>
      </div>
    </div>
  );
}
