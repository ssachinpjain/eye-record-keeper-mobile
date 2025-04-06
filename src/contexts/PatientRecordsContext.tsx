
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  addRecord: (record: Omit<PatientRecord, 'id'>) => void;
  searchRecords: (query: string) => PatientRecord[];
  getRecordByMobile: (mobile: string) => PatientRecord | undefined;
  clearRecords: () => void;
}

const PatientRecordsContext = createContext<PatientRecordsContextType | undefined>(undefined);

export const PatientRecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<PatientRecord[]>([]);

  useEffect(() => {
    // Load records from localStorage
    const storedRecords = localStorage.getItem('patientRecords');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('patientRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<PatientRecord, 'id'>) => {
    // Check if a record with the same mobile number already exists
    const existingRecordIndex = records.findIndex(r => r.mobile === record.mobile);
    
    if (existingRecordIndex !== -1) {
      // Update the existing record
      const updatedRecords = [...records];
      updatedRecords[existingRecordIndex] = {
        ...record,
        id: records[existingRecordIndex].id,
      };
      setRecords(updatedRecords);
    } else {
      // Add a new record
      const newRecord = {
        ...record,
        id: Date.now().toString(),
      };
      setRecords(prev => [...prev, newRecord]);
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

  const clearRecords = () => {
    setRecords([]);
    localStorage.removeItem('patientRecords');
  };

  return (
    <PatientRecordsContext.Provider 
      value={{ records, addRecord, searchRecords, getRecordByMobile, clearRecords }}
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
