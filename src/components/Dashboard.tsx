
import { usePatientRecords } from '@/contexts/PatientRecordsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Edit, Eye, Loader2, PlusCircle } from 'lucide-react';
import Layout from './Layout';

const Dashboard = () => {
  const { records, isLoading, addDemoRecord } = usePatientRecords();
  const navigate = useNavigate();

  const handleEdit = (mobile: string) => {
    navigate(`/add-record?mobile=${mobile}`);
  };

  const handleView = (mobile: string) => {
    navigate(`/view-record?mobile=${mobile}`);
  };

  const handleAddDemo = async () => {
    await addDemoRecord();
  };

  if (isLoading) {
    return (
      <Layout title="Loading Records..." currentPath="/dashboard">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical-600 mb-4" />
          <p className="text-gray-500">Loading patient records...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="DEEPAK P JAIN" currentPath="/dashboard">
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No patient records found</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/add-record')}
                className="bg-medical-600 hover:bg-medical-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Record
              </Button>
              <Button 
                onClick={handleAddDemo}
                variant="outline"
                className="border-medical-500 text-medical-600 hover:bg-medical-50"
              >
                Add Demo Record
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-medical-800">
                All Records ({records.length})
              </h2>
              <Button 
                onClick={() => navigate('/add-record')}
                className="bg-medical-600 hover:bg-medical-700"
                size="sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Record
              </Button>
            </div>
            
            {records.map((record) => (
              <Card key={record.id} className="border-medical-200 hover:border-medical-400 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-medical-800">{record.name}</h3>
                      <p className="text-sm text-gray-500">{record.mobile}</p>
                      <p className="text-xs text-gray-400">Last updated: {record.date}</p>
                      <p className="text-sm text-medical-600 mt-1">₹{record.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleView(record.mobile)}
                        className="h-8 w-8 text-medical-600"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEdit(record.mobile)}
                        className="h-8 w-8 text-medical-600"
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
