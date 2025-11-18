import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DEPLOYMENT_GUIDES_DATA } from '../data/deploymentGuides';
import { DeploymentGuide, DeploymentGuideStep } from '../types';
import Tooltip from './Tooltip';
import { 
    ClipboardIcon, 
    CheckCircleIcon,
    ServerStackIcon,
    ServerIcon,
    MagnifyingGlassIcon,
    CloudArrowUpIcon,
    TerminalIcon,
    FileCodeIcon,
    ShieldExclamationIcon,
} from '../icons';

const CopyButton: React.FC<{ code: string; onCopy?: () => void; children?: React.ReactNode }> = ({ code, onCopy, children }) => {
    const { t } = useLanguage();
    const [isCopied, setIsCopied] = useState(false);
  
    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setIsCopied(false), 2000);
    };
  
    return (
      <Tooltip text={isCopied ? t('tooltipCopied') : t('tooltipCopy')}>
        <button
          onClick={handleCopy}
          className="bg-gray-300/30 hover:bg-gray-400/50 text-gray-600 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:text-gray-300 p-1.5 rounded-md transition-all flex items-center"
        >
          {children ?? (isCopied ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          ))}
        </button>
      </Tooltip>
    );
};

const CommandStep: React.FC<{ step: DeploymentGuideStep }> = ({ step }) => {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step.description}</p>
      {step.isCode !== false && (
        <div className="relative bg-gray-100 dark:bg-slate-900/70 rounded-lg border border-gray-200 dark:border-white/10 group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton code={step.command} />
          </div>
          <pre className="p-4 text-sm text-gray-900 dark:text-gray-200 overflow-x-auto font-mono">
            <div className="flex">
              <span className="text-gray-500 dark:text-gray-600 mr-4 select-none">$</span>
              <code className="text-purple-600 dark:text-purple-400">{step.command}</code>
            </div>
          </pre>
        </div>
      )}
    </div>
  );
};


const GuideDetail: React.FC<{ guide: DeploymentGuide | null }> = ({ guide }) => {
    const { t } = useLanguage();
    const [isAllCopied, setIsAllCopied] = useState(false);

    const handleCopyAll = () => {
        const fullScript = guide?.steps
          .filter(step => step.isCode !== false)
          .map(step => step.command)
          .join(' && \\\n');
        
        if (fullScript) {
            navigator.clipboard.writeText(fullScript);
            setIsAllCopied(true);
            setTimeout(() => setIsAllCopied(false), 2000);
        }
    };

    if (!guide) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Selecione um guia para começar.</div>;
    }

    const buttonText = isAllCopied ? t('buttonCopied') : 'Copiar Todos os Comandos';

    return (
        <div className="p-6 h-full overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100">{guide.title}</h3>
                <button
                  onClick={handleCopyAll}
                  className="bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 dark:bg-slate-700/80 dark:hover:bg-slate-600/80 dark:text-gray-200 text-sm font-medium py-2 px-3 rounded-lg transition-all flex items-center gap-2"
                >
                  {isAllCopied ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <ClipboardIcon className="h-5 w-5" />}
                  <span>{buttonText}</span>
                </button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-100/50 dark:bg-slate-800/40 rounded-lg border border-gray-200 dark:border-white/10">
                <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('guideDescription')}</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{guide.description}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-100/50 dark:bg-slate-800/40 rounded-lg border border-gray-200 dark:border-white/10">
                <h5 className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">{t('guideUseCase')}</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{guide.useCase}</p>
            </div>
            
            <div>
                <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-4">{t('guideCommands')}</h5>
                {guide.steps.map((step, index) => (
                    <CommandStep key={index} step={step} />
                ))}
            </div>
        </div>
    );
};

const DeploymentGuidesView: React.FC = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const subCategoryIcons: Record<string, React.FC<{className?: string}>> = {
        core: ServerStackIcon,
        databases: ServerIcon,
        observability: MagnifyingGlassIcon,
        apps: FileCodeIcon,
        backup_s3: CloudArrowUpIcon,
        os: TerminalIcon,
        security: ShieldExclamationIcon,
    };

    const [activeCategoryKey, setActiveCategoryKey] = useState(() => Object.keys(DEPLOYMENT_GUIDES_DATA)[0]);
    
    const [activeSubCategoryKey, setActiveSubCategoryKey] = useState(() => {
        const initialCategoryData = DEPLOYMENT_GUIDES_DATA[Object.keys(DEPLOYMENT_GUIDES_DATA)[0]];
        return initialCategoryData?.subCategories ? Object.keys(initialCategoryData.subCategories)[0] : null;
    });

    const getInitialGuide = (): DeploymentGuide | null => {
        const initialCategoryKey = Object.keys(DEPLOYMENT_GUIDES_DATA)[0];
        const initialCategoryData = DEPLOYMENT_GUIDES_DATA[initialCategoryKey];
        if (initialCategoryData?.subCategories) {
            const initialSubKey = Object.keys(initialCategoryData.subCategories)[0];
            return initialCategoryData.subCategories[initialSubKey]?.guides?.[0] ?? null;
        }
        return initialCategoryData?.guides?.[0] ?? null;
    };

    const [selectedGuide, setSelectedGuide] = useState<DeploymentGuide | null>(getInitialGuide);

    const handleCategoryClick = (catKey: string) => {
        setActiveCategoryKey(catKey);
        const newCategoryData = DEPLOYMENT_GUIDES_DATA[catKey];

        if (newCategoryData.subCategories) {
            const firstSubKey = Object.keys(newCategoryData.subCategories)[0];
            setActiveSubCategoryKey(firstSubKey);
            setSelectedGuide(newCategoryData.subCategories[firstSubKey]?.guides?.[0] ?? null);
        } else {
            setActiveSubCategoryKey(null);
            setSelectedGuide(newCategoryData.guides?.[0] ?? null);
        }
    };
    
    const handleSubCategoryClick = (subKey: string) => {
        setActiveSubCategoryKey(subKey);
        const categoryData = DEPLOYMENT_GUIDES_DATA[activeCategoryKey];
        setSelectedGuide(categoryData?.subCategories?.[subKey]?.guides?.[0] ?? null);
    };

    const currentCategoryData = DEPLOYMENT_GUIDES_DATA[activeCategoryKey];
    const currentSubCategories = currentCategoryData.subCategories;
    
    const currentGuides = useMemo(() => {
        if (currentSubCategories && activeSubCategoryKey) {
            return currentSubCategories[activeSubCategoryKey]?.guides ?? [];
        }
        return currentCategoryData.guides ?? [];
    }, [currentCategoryData, currentSubCategories, activeSubCategoryKey]);

    const globalFilteredGuides = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase().trim();
        if (!lowercasedFilter) {
          return [];
        }
        const results: DeploymentGuide[] = [];
        const seenTitles = new Set<string>();
    
        for (const categoryKey in DEPLOYMENT_GUIDES_DATA) {
          const categoryData = DEPLOYMENT_GUIDES_DATA[categoryKey];
          
          let allGuides: DeploymentGuide[] = [...(categoryData.guides ?? [])];
          
          if (categoryData.subCategories) {
              for (const subKey in categoryData.subCategories) {
                  allGuides.push(...(categoryData.subCategories[subKey].guides ?? []));
              }
          }
    
          for (const guide of allGuides) {
              if (
                !seenTitles.has(guide.title) && (
                guide.title.toLowerCase().includes(lowercasedFilter) ||
                guide.description.toLowerCase().includes(lowercasedFilter) ||
                guide.useCase.toLowerCase().includes(lowercasedFilter))
              ) {
                results.push(guide);
                seenTitles.add(guide.title);
              }
          }
        }
        return results;
      }, [searchTerm]);

    return (
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl flex flex-col h-full shadow-lg dark:shadow-2xl dark:shadow-black/20 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-white/10 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{t('deploymentGuidesTitle')}</h2>
                <div className="relative w-full sm:w-1/3">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('deploymentGuidesSearchPlaceholder')}
                        className="w-full bg-gray-100/50 dark:bg-slate-800/60 text-gray-900 dark:text-gray-200 p-2 pl-10 rounded-full border border-gray-300/50 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-colors"
                    />
                </div>
            </div>
            
            <div className="flex flex-grow min-h-0">
                {/* Navigation Pane */}
                <div className="w-1/3 lg:w-1/4 flex flex-col border-r border-gray-300 dark:border-white/10 bg-gray-50/30 dark:bg-slate-900/20">
                    {searchTerm.trim() ? (
                        <div className="flex-grow overflow-y-auto p-2 space-y-1">
                            {globalFilteredGuides.map(guide => (
                                <button 
                                    key={guide.title}
                                    onClick={() => setSelectedGuide(guide)}
                                    className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${selectedGuide?.title === guide.title ? 'bg-cyan-100 dark:bg-cyan-500/20' : 'hover:bg-gray-200/50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <h4 className={`font-medium text-sm ${selectedGuide?.title === guide.title ? 'text-cyan-800 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-200'}`}>{guide.title}</h4>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                         {/* Main Category Tabs */}
                        <div className="flex border-b border-gray-300 dark:border-white/10 overflow-x-auto hide-scrollbar flex-shrink-0">
                            {Object.keys(DEPLOYMENT_GUIDES_DATA).map(catKey => (
                                <button
                                    key={catKey}
                                    onClick={() => handleCategoryClick(catKey)}
                                    className={`px-3 py-2 -mb-px text-xs font-medium border-b-2 transition-colors duration-200 flex-shrink-0 ${
                                        activeCategoryKey === catKey
                                            ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                                >
                                    {t(DEPLOYMENT_GUIDES_DATA[catKey].displayName)}
                                </button>
                            ))}
                        </div>

                        {/* Sub Category Tabs */}
                        {currentSubCategories && (
                            <div className="flex justify-around border-b border-gray-200 dark:border-slate-800 overflow-x-auto hide-scrollbar flex-shrink-0 bg-gray-100/50 dark:bg-slate-800/30">
                                {Object.keys(currentSubCategories).map(subKey => {
                                    const Icon = subCategoryIcons[subKey] || FileCodeIcon;
                                    const isActive = activeSubCategoryKey === subKey;
                                    return (
                                        <Tooltip key={subKey} text={t(currentSubCategories[subKey].displayName)}>
                                            <button
                                                onClick={() => handleSubCategoryClick(subKey)}
                                                className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 flex-shrink-0 border-b-2 ${
                                                    isActive
                                                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                                }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        )}

                        {/* Guides List */}
                        <div className="flex-grow overflow-y-auto p-2 space-y-1">
                            {currentGuides.map(guide => (
                                <button 
                                    key={guide.title}
                                    onClick={() => setSelectedGuide(guide)}
                                    className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${selectedGuide?.title === guide.title ? 'bg-cyan-100 dark:bg-cyan-500/20' : 'hover:bg-gray-200/50 dark:hover:bg-slate-800/50'}`}
                                >
                                    <h4 className={`font-medium text-sm ${selectedGuide?.title === guide.title ? 'text-cyan-800 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-200'}`}>{guide.title}</h4>
                                </button>
                            ))}
                        </div>
                        </>
                    )}
                </div>

                {/* Content Pane */}
                <div className="w-2/3 lg:w-3/4 flex-grow bg-white/30 dark:bg-black/10">
                    <GuideDetail guide={selectedGuide} />
                </div>
            </div>
        </div>
    );
};

export default DeploymentGuidesView;