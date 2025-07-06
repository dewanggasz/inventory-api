import React from 'react';

function Alert({ message }) {
  if (!message) return null;

  return (
    <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
}

export default Alert;