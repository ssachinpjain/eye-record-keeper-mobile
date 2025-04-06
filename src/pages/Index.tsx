
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-medical-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-medical-800">Eye Record Keeper</h1>
        <p className="text-medical-600">Loading application...</p>
      </div>
    </div>
  );
};

export default Index;
