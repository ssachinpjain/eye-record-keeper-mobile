
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the eye prescription data structure
export interface EyePrescription {
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
}

// Define the patient record structure
export interface PatientRecord {
  id: string;
  date: string;
  name: string;
  mobile: string;
  rightEye: EyePrescription;
  leftEye: EyePrescription;
}

interface PatientRecordsContextType {
  records: PatientRecord[];
  addRecord: (record: Omit<PatientRecord, 'id'>) => Promise<void>;
  searchRecords: (query: string) => PatientRecord[];
  getRecordByMobile: (mobile: string) => PatientRecord | undefined;
  clearRecords: () => Promise<void>;
  isLoading: boolean;
}

const PatientRecordsContext = createContext<PatientRecordsContextType | undefined>(undefined);

export const PatientRecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch records from Supabase on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data from Supabase format to our application format
        const transformedRecords: PatientRecord[] = data.map(item => ({
          id: item.id,
          date: item.date,
          name: item.name,
          mobile: item.mobile,
          rightEye: {
            sphere: item.right_eye_sphere || '',
            cylinder: item.right_eye_cylinder || '',
            axis: item.right_eye_axis || '',
            add: item.right_eye_add || ''
          },
          leftEye: {
            sphere: item.left_eye_sphere || '',
            cylinder: item.left_eye_cylinder || '',
            axis: item.left_eye_axis || '',
            add: item.left_eye_add || ''
          }
        }));
        setRecords(transformedRecords);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load patient records');
    } finally {
      setIsLoading(false);
    }
  };

  const addRecord = async (record: Omit<PatientRecord, 'id'>) => {
    try {
      // Check if a record with the same mobile number already exists
      const existingRecord = await supabase
        .from('patient_records')
        .select('*')
        .eq('mobile', record.mobile)
        .single();

      if (existingRecord.data) {
        // Update existing record
        const { error } = await supabase
          .from('patient_records')
          .update({
            date: record.date,
            name: record.name,
            right_eye_sphere: record.rightEye.sphere,
            right_eye_cylinder: record.rightEye.cylinder,
            right_eye_axis: record.rightEye.axis,
            right_eye_add: record.rightEye.add,
            left_eye_sphere: record.leftEye.sphere,
            left_eye_cylinder: record.leftEye.cylinder,
            left_eye_axis: record.leftEye.axis,
            left_eye_add: record.leftEye.add,
            updated_at: new Date().toISOString()
          })
          .eq('mobile', record.mobile);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('patient_records')
          .insert({
            date: record.date,
            name: record.name,
            mobile: record.mobile,
            right_eye_sphere: record.rightEye.sphere,
            right_eye_cylinder: record.rightEye.cylinder,
            right_eye_axis: record.rightEye.axis,
            right_eye_add: record.rightEye.add,
            left_eye_sphere: record.leftEye.sphere,
            left_eye_cylinder: record.leftEye.cylinder,
            left_eye_axis: record.leftEye.axis,
            left_eye_add: record.leftEye.add
          });

        if (error) throw error;
      }

      // Refresh records after add/update
      await fetchRecords();
    } catch (error) {
      console.error('Error adding/updating record:', error);
      toast.error('Failed to save patient record');
      throw error;
    }
  };

  const searchRecords = (query: string): PatientRecord[] => {
    if (!query) return records;
    
    const lowercaseQuery = query.toLowerCase();
    return records.filter(
      record => 
        record.name.toLowerCase().includes(lowercaseQuery) ||
        record.mobile.includes(query)
    );
  };

  const getRecordByMobile = (mobile: string): PatientRecord | undefined => {
    return records.find(record => record.mobile === mobile);
  };

  const clearRecords = async () => {
    try {
      const { error } = await supabase
        .from('patient_records')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) throw error;
      
      setRecords([]);
      toast.success('All records cleared successfully');
    } catch (error) {
      console.error('Error clearing records:', error);
      toast.error('Failed to clear records');
    }
  };

  return (
    <PatientRecordsContext.Provider 
      value={{ records, addRecord, searchRecords, getRecordByMobile, clearRecords, isLoading }}
    >
      {children}
    </PatientRecordsContext.Provider>
  );
};

export const usePatientRecords = (): PatientRecordsContextType => {
  const context = useContext(PatientRecordsContext);
  if (context === undefined) {
    throw new Error('usePatientRecords must be used within a PatientRecordsProvider');
  }
  return context;
};
