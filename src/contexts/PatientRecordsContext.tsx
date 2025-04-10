
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
  framePrice: number;
  glassPrice: number;
  totalPrice: number;
  remarks: string;
}

interface PatientRecordsContextType {
  records: PatientRecord[];
  addRecord: (record: Omit<PatientRecord, 'id'>) => Promise<void>;
  searchRecords: (query: string) => PatientRecord[];
  getRecordByMobile: (mobile: string) => PatientRecord | undefined;
  clearRecords: () => Promise<void>;
  addDemoRecord: () => Promise<void>;
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
      console.log('Fetching records from Supabase...');
      const { data, error } = await supabase
        .from('patient_records')
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }

      if (data) {
        console.log('Records fetched successfully:', data.length);
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
          },
          framePrice: Number(item.frame_price) || 0,
          glassPrice: Number(item.glass_price) || 0,
          totalPrice: Number(item.total_price) || 0,
          remarks: item.remarks || ''
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
      console.log('Adding/updating record:', record);
      // Check if a record with the same mobile number already exists
      const existingRecord = await supabase
        .from('patient_records')
        .select('*')
        .eq('mobile', record.mobile)
        .maybeSingle();

      console.log('Existing record check result:', existingRecord);

      if (existingRecord.data) {
        // Update existing record
        console.log('Updating existing record for mobile:', record.mobile);
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
            frame_price: record.framePrice,
            glass_price: record.glassPrice,
            total_price: record.totalPrice,
            remarks: record.remarks,
            updated_at: new Date().toISOString()
          })
          .eq('mobile', record.mobile);

        if (error) {
          console.error('Error updating record:', error);
          throw error;
        }
        console.log('Record updated successfully');
        toast.success('Record updated successfully');
      } else {
        // Insert new record
        console.log('Inserting new record for mobile:', record.mobile);
        const { error, data } = await supabase
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
            left_eye_add: record.leftEye.add,
            frame_price: record.framePrice,
            glass_price: record.glassPrice,
            total_price: record.totalPrice,
            remarks: record.remarks
          })
          .select();

        if (error) {
          console.error('Error inserting record:', error);
          throw error;
        }
        console.log('Record inserted successfully', data);
        toast.success('Record added successfully');
      }

      // Refresh records after add/update
      await fetchRecords();
    } catch (error: any) {
      console.error('Error adding/updating record:', error);
      toast.error(`Failed to save patient record: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };

  const addDemoRecord = async () => {
    try {
      setIsLoading(true);
      const demoRecord: Omit<PatientRecord, 'id'> = {
        date: new Date().toISOString().split('T')[0],
        name: 'Demo Patient',
        mobile: '9876543210',
        rightEye: {
          sphere: '+1.25',
          cylinder: '-0.50',
          axis: '180',
          add: '+2.00'
        },
        leftEye: {
          sphere: '+1.00',
          cylinder: '-0.75',
          axis: '175',
          add: '+2.00'
        },
        framePrice: 1500,
        glassPrice: 2500,
        totalPrice: 4000,
        remarks: 'This is a demo record created for testing purposes.'
      };

      await addRecord(demoRecord);
      toast.success('Demo record added successfully!');
    } catch (error) {
      console.error('Failed to add demo record:', error);
      toast.error('Failed to add demo record');
    } finally {
      setIsLoading(false);
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
      value={{ records, addRecord, searchRecords, getRecordByMobile, clearRecords, addDemoRecord, isLoading }}
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
