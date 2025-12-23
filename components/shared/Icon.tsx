
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const icons: Record<string, React.ReactNode> = {
  language: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l-5.25-5.25L15.75 0l5.25 5.25L10.5 21zM10.5 21L.75 11.25M15.75 0L25.5 9.75M2.25 12.75l7.5-7.5" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955V21a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V12z" />,
  profile: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
  send: <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
  microphone: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 18.75a6 6 0 00-6-6H4.5a6 6 0 00-6 6v1.5a6 6 0 006 6h1.5a6 6 0 006-6v-1.5a6 6 0 00-6-6h-1.5z" />,
  stop: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />,
  speaker: <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M12 12.75a.75.75 0 010-1.5h.008a.75.75 0 010 1.5H12zm-3.75 0a.75.75 0 010-1.5h.008a.75.75 0 010 1.5H8.25z" />,
  book: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
  translate: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l-5.25-5.25L15.75 0l5.25 5.25L10.5 21zM10.5 21L.75 11.25m19.5 0l-9.75 9.75" />,
  image: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.761 9.761 0 01-2.544-.467l-1.033-1.033M21 12c0-4.556-4.03-8.25-9-8.25S3 7.444 3 12m18 0l-4.5-4.25m4.5 4.25l-4.5 4.25" />,
  microphoneOn: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />,
  writing: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />,
  briefcase: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V14.15M18.75 18.75v-6.098a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v6.098M15 12.75h-1.5a2.25 2.25 0 00-2.25 2.25v6.098M7.5 12.75H6a2.25 2.25 0 00-2.25 2.25v6.098M12 1.5a5.25 5.25 0 00-5.25 5.25v3.364a3 3 0 00.93 2.121l.707.707-1.586 1.586a.75.75 0 101.06 1.061l1.586-1.586.707.707a3 3 0 002.121.93h3.364A5.25 5.25 0 0017.25 6.75V1.5h-5.25z" />
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

export default Icon;
