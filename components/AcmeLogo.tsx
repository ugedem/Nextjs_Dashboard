
import React from 'react';
import { DocumentDuplicateIcon } from './Icons';

const AcmeLogo: React.FC = () => {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <DocumentDuplicateIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px] ml-2">Acme</p>
    </div>
  );
};

export default AcmeLogo;
