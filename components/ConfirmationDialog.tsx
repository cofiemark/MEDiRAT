import React, { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default as it's the less destructive action
      setTimeout(() => cancelButtonRef.current?.focus(), 100);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onCancel();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex justify-center items-center" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={onCancel} // Close on backdrop click
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all text-left"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    {title}
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            ref={cancelButtonRef}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
