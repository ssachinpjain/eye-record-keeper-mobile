
import { useState } from 'react';
import { usePatientRecords } from '@/contexts/PatientRecordsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Eye } from 'lucide-react';
import Layout from './Layout';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { searchRecords } = usePatientRecords();
  const navigate = useNavigate();
  
  const searchResults = searchRecords(query);

  const handleEdit = (mobile: string) => {
    navigate(`/add-record?mobile=${mobile}`);
  };

  const handleView = (mobile: string) => {
    navigate(`/view-record?mobile=${mobile}`);
  };

  return (
    <Layout title="Search Records" currentPath="/search">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name or mobile number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 input-field"
          />
        </div>

        <div className="mt-6">
          {query && (
            <p className="text-sm text-gray-500 mb-2">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
            </p>
          )}

          {query && searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No matching records found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((record) => (
                <Card key={record.id} className="border-medical-200 hover:border-medical-400 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-medical-800">{record.name}</h3>
                        <p className="text-sm text-gray-500">{record.mobile}</p>
                        <p className="text-xs text-gray-400">Last updated: {record.date}</p>
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchScreen;
