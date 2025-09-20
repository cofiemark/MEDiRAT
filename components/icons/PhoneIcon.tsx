import React from 'react';

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.211-.99-.554-1.348l-5.482-5.482a1.5 1.5 0 0 0-2.122 0l-3.353 3.353a11.245 11.245 0 0 1-5.023-5.023l3.353-3.353a1.5 1.5 0 0 0 0-2.122L6.34 2.804A1.5 1.5 0 0 0 4.992 2.25H3.622a2.25 2.25 0 0 0-2.25 2.25v1.372Z" />
    </svg>
);
