import { useEffect, useRef } from 'react';
import { MessageType, useMessageHandler } from '../../lib/hooks/use-message';
import { joinStylesFromArray } from '../../lib/utils/styles-builder';

const toastConfig = 'fixed right-5 bottom-5 p-4 w-full max-w-xs rounded-lg shadow-lg font-medium whitespace-nowrap transition-opacity duration-300';
const toastTypeConfig: { [key in MessageType]: string } = {
  error: 'text-red-600 bg-red-200',
  info: 'text-blue-600 bg-blue-200',
  success: 'text-green-600 bg-green-200',
};

const joinToastStyles = (type: MessageType, visible: boolean) =>
  joinStylesFromArray(toastConfig, toastTypeConfig[type], visible ? 'opacity-100' : 'opacity-0');

export default function Toast() {
  const { message, dismiss } = useMessageHandler();
  const removeRef = useRef(dismiss);
  removeRef.current = dismiss;
  useEffect(() => {
    if (message?.mode === 'toast') {
      const duration = 3500;
      const id = setTimeout(() => removeRef.current(), duration);

      return () => clearTimeout(id);
    }
  }, [message]);

  return (
    <div>
      {message && message.mode === 'toast' && (
        <div className={joinToastStyles(message.type, !!message)} role='alert'>
          <p className='overflow-hidden pr-4'>{message.content}</p>
        </div>
      )}
    </div>
  );
}
