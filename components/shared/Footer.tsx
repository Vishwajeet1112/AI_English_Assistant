
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI English Learning Assistant. Built to empower learners worldwide.</p>
      </div>
    </footer>
  );
};

export default Footer;
