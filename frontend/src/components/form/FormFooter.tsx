import React from 'react';
import { Link } from 'react-router-dom';

interface FormFooterProps {
  question: string;
  linkText: string;
  to: string;
}

export const FormFooter: React.FC<FormFooterProps> = ({ question, linkText, to }) => {
  return (
    <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
      {question}{' '}
      <Link to={to} className="font-semibold text-blue-600 hover:underline">
        {linkText}
      </Link>
    </div>
  );
};