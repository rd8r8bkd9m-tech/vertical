import React, { useState } from 'react';
import { ChatInterface, ChatMessage } from './ChatInterface';
import './ChatDemo.css';

export function ChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const simulateResponse = (userMessage: string) => {
    setIsProcessing(true);
    
    // Имитация задержки ответа AI
    setTimeout(() => {
      const responses: Record<string, string> = {
        'смету': `Отлично, помогу рассчитать смету! 

Для точного расчёта мне нужно знать:
1. Площадь стен (м²)
2. Среднюю толщину слоя (мм)
3. Этажность
4. Наличие лифта

Можем начать с быстрого расчёта или заполнить подробную форму?`,
        
        'замер': `Замер — критически важный этап! 

📋 Чек-лист для замера:
• Измерьте длину всех стен
• Зафиксируйте высоту потолков
• Отметьте оконные и дверные проёмы
• Проверьте перепады высот
• Сфотографируйте все углы

Хотите создать новый замер в системе?`,

        'КП': `Создам коммерческое предложение!

Что включить в КП:
✓ Детализированный расчёт материалов
✓ Стоимость работ
✓ Сроки выполнения
✓ Гарантийные условия

На какой объект готовим предложение?`,

        'совет': `Вот несколько советов по оптимизации:

💡 Материалы:
• Заказывайте смеси с запасом 10%
• Используйте маяки для контроля слоя
• Грунтовка обязательна перед штукатуркой

💡 Работы:
• Планируйте работы по сезонам
• Закладывайте 15-25% маржу
• Всегда считайте логистику

Хотите детальный расчёт для конкретного объекта?`
      };

      let response = 'Спасибо за вопрос! Я анализирую ваш запрос и скоро дам развёрнутый ответ.';
      
      for (const [key, value] of Object.entries(responses)) {
        if (userMessage.toLowerCase().includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          suggestionType: userMessage.toLowerCase().includes('смет') ? 'estimate' : 
                         userMessage.toLowerCase().includes('замер') ? 'measurement' :
                         userMessage.toLowerCase().includes('КП') ? 'document' : 'calculation'
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    simulateResponse(content);
  };

  return (
    <div className="chat-demo-container">
      <div className="chat-demo-wrapper">
        <div className="chat-demo-header">
          <h1>Vertical AI Chat</h1>
          <p>Интерфейс чата в стиле GPT/Grok для взаимодействия с системой</p>
        </div>
        
        <div className="chat-demo-content">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            title="AI Ассистент Вертикали"
            placeholder="Спросите о смете, замере или расчётах..."
          />
        </div>

        <div className="chat-demo-info">
          <h3>Функции:</h3>
          <ul>
            <li>✨ Интерактивные сообщения с анимацией</li>
            <li>⚡ Быстрые действия для частых задач</li>
            <li>💬 Поддержка многострочного ввода (Shift+Enter)</li>
            <li>🎯 Контекстные предложения действий</li>
            <li>⌨️ Отправка по Enter</li>
            <li>📱 Адаптивный дизайн</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
