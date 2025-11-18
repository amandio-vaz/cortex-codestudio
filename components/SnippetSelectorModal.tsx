import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BASH_SNIPPETS } from '../data/snippets';
import { CodeBracketSquareIcon } from '../icons';
import { useEditorTheme } from '../context/EditorThemeContext';

interface SnippetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (snippet: string) => void;
}

const SnippetSelectorModal: React.FC<SnippetSelectorModalProps> = ({ isOpen, onClose, onInsertSnippet }) => {
  const { t } = useLanguage();
  const { theme } = useEditorTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl shadow-black/40"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-300 dark:border-white/10 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <CodeBracketSquareIcon className="h-6 w-6 mr-2" />
            {t('snippetModalTitle')}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BASH_SNIPPETS.map(snippet => (
              <div key={snippet.id} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t(snippet.nameKey)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">{t(snippet.descriptionKey)}</p>
                  <pre
                    className="p-2 rounded-md text-xs font-mono overflow-x-auto max-h-32"
                    style={{ backgroundColor: theme.colors.editorBg, color: theme.colors.editorText }}
                  >
                    <code>{snippet.content}</code>
                  </pre>
                </div>
                <button
                  onClick={() => onInsertSnippet(snippet.content)}
                  className="mt-4 w-full px-3 py-1.5 text-xs font-semibold rounded-md bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:text-white dark:bg-gradient-to-br dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-500 dark:hover:to-blue-600 transition-colors"
                >
                  {t('buttonInsertSnippet')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetSelectorModal;
