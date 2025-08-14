
import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface VastuFormProps {
  onFormSubmit: (file: File, entranceDirection: string) => void;
  onReset?: () => void;
  initialState?: 'loading' | 'error' | 'form';
  errorMessage?: string;
}

const VastuForm: React.FC<VastuFormProps> = ({ onFormSubmit, onReset, initialState, errorMessage }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [entranceDirection, setEntranceDirection] = useState<string>('');
  const [localError, setLocalError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if(selectedFile.size > 4 * 1024 * 1024) {
        setLocalError(t('form_error_file_size'));
        return;
      }
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null); // No preview for non-image files like PDF
      }
      setLocalError('');
    }
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !entranceDirection) {
      setLocalError(t('form_error_missing_fields'));
      return;
    }
    setLocalError('');
    onFormSubmit(file, entranceDirection);
  }, [file, entranceDirection, onFormSubmit, t]);
  
  const renderLoadingState = () => (
    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="flex justify-center items-center mb-4">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <h3 className="text-xl font-serif text-gray-800">{t('form_loading_title')}</h3>
        <p className="text-gray-600 mt-2">{t('form_loading_desc')}</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center p-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
         <div className="flex justify-center items-center mb-4">
            <svg className="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
         </div>
         <h3 className="text-xl font-serif text-red-800">{t('form_error_title')}</h3>
         <p className="text-red-600 mt-2 max-w-md mx-auto">{errorMessage}</p>
         <button onClick={onReset} className="mt-4 bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors">
            {t('form_error_button')}
        </button>
    </div>
  );

  if(initialState === 'loading') return renderLoadingState();
  if(initialState === 'error') return renderErrorState();

  return (
    <section id="vastu-form" className="py-16">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">{t('form_title')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('form_subtitle')}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">{t('form_upload_label')}</label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-teal-500 transition-colors">
              <div className="space-y-1 text-center">
                 {filePreview ? (
                     <img src={filePreview} alt="Floor plan preview" className="mx-auto h-40 object-contain rounded-md" />
                 ) : file ? (
                     <div className="text-center p-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <p className="mt-2 font-medium text-gray-700">{file.name}</p>
                     </div>
                 ) : (
                    <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <span className="relative bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                                <span>{t('form_upload_action')}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp, application/pdf" onChange={handleFileChange} ref={fileInputRef}/>
                            </span>
                            <p className="pl-1">{t('form_upload_drag')}</p>
                        </div>
                         <p className="text-xs text-gray-500">{t('form_upload_info')}</p>
                    </>
                 )}
              </div>
            </div>
            {file && !filePreview && <p className="text-sm text-gray-500 mt-2">{t('form_upload_selected', { fileName: file.name })}</p>}
          </div>
          
          <div>
            <label htmlFor="direction-select" className="block text-lg font-semibold text-gray-700 mb-2">{t('form_direction_label_select')}</label>
            <select
              id="direction-select"
              name="direction-select"
              value={entranceDirection}
              onChange={(e) => setEntranceDirection(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 bg-white text-gray-700"
              required
            >
              <option value="" disabled>{t('form_direction_placeholder_select')}</option>
              <option value="North">{t('direction_north')}</option>
              <option value="Northeast">{t('direction_northeast')}</option>
              <option value="East">{t('direction_east')}</option>
              <option value="Southeast">{t('direction_southeast')}</option>
              <option value="South">{t('direction_south')}</option>
              <option value="Southwest">{t('direction_southwest')}</option>
              <option value="West">{t('direction_west')}</option>
              <option value="Northwest">{t('direction_northwest')}</option>
            </select>
          </div>

          {localError && <p className="text-red-600 text-sm text-center">{localError}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={!file || !entranceDirection}
            >
              {t('form_button_generate')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default VastuForm;