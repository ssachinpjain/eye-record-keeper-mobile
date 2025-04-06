
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PatientRecord, usePatientRecords } from '@/contexts/PatientRecordsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, AlertCircle } from 'lucide-react';
import Layout from './Layout';

const ViewRecord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getRecordByMobile } = usePatientRecords();
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mobileParam = searchParams.get('mobile');
    
    if (mobileParam) {
      const foundRecord = getRecordByMobile(mobileParam);
      if (foundRecord) {
        setRecord(foundRecord);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, [location.search, getRecordByMobile]);

  if (notFound) {
    return (
      <Layout title="Record Not Found" showBackButton currentPath="">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="text-medical-600 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-medical-800 mb-2">Record Not Found</h2>
          <p className="text-gray-500 mb-4">The requested patient record could not be found</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-medical-600 hover:bg-medical-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  if (!record) {
    return (
      <Layout title="Loading..." showBackButton currentPath="">
        <div className="flex justify-center items-center h-64">
          <p>Loading record...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Patient Record" showBackButton currentPath="">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-medical-800">{record.name}</h2>
            <p className="text-gray-500">{record.mobile}</p>
            <p className="text-sm text-gray-400">Exam Date: {record.date}</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate(`/add-record?mobile=${record.mobile}`)}
            className="text-medical-600 border-medical-300"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        {/* Right Eye Card */}
        <Card className="border-medical-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-medical-800">Right Eye</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Sphere</p>
                <p className="font-medium">{record.rightEye.sphere || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cylinder</p>
                <p className="font-medium">{record.rightEye.cylinder || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Axis</p>
                <p className="font-medium">{record.rightEye.axis || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Add</p>
                <p className="font-medium">{record.rightEye.add || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Left Eye Card */}
        <Card className="border-medical-300">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-medical-800">Left Eye</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Sphere</p>
                <p className="font-medium">{record.leftEye.sphere || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cylinder</p>
                <p className="font-medium">{record.leftEye.cylinder || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Axis</p>
                <p className="font-medium">{record.leftEye.axis || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Add</p>
                <p className="font-medium">{record.leftEye.add || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ViewRecord;
