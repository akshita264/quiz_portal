import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAccess } from '../../services/api';

const StartPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let isMounted = true;
    checkAccess().then((res) => {
      if (!isMounted) return;
      setAllowed(res.allowed);
      setLoading(false);
      if (res.allowed) {
        navigate('/questions', { replace: true });
      }
    });
    return () => { isMounted = false; };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (allowed) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Please wait</h2>
        <p className="text-gray-600">You are not yet allowed to start. This page will auto-advance when access is granted.</p>
        <button onClick={() => navigate(0)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
      </div>
    </div>
  );
};

export default StartPage;


