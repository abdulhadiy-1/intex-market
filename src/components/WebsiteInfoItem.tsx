import React from 'react';

interface WebsiteInfoItemProps {
  label: string;
  value: string;
  link?: string;
  onEdit: () => void;
}

const WebsiteInfoItem: React.FC<WebsiteInfoItemProps> = ({ label, value, link, onEdit }) => {
  
  return (
    <div className="flex w-full py-6 px-12 bg-white rounded-[40px] text-lg items-center mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <span className="text-gray-500 w-72">{label}</span>
          <span className="text-gray-900">{link || value}</span>
        </div>
      </div>
      <div className="ml-4">
        <button 
          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
          onClick={onEdit}
          aria-label={`Редактировать ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WebsiteInfoItem;
