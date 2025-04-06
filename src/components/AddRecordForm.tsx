
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PatientRecord, EyePrescription, usePatientRecords } from '@/contexts/PatientRecordsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Layout from './Layout';
import { Loader2 } from 'lucide-react';

const defaultEyeData: EyePrescription = {
  sphere: '',
  cylinder: '',
  axis: '',
  add: ''
};

const AddRecordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addRecord, getRecordByMobile, isLoading } = usePatientRecords();
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [rightEye, setRightEye] = useState<EyePrescription>({ ...defaultEyeData });
  const [leftEye, setLeftEye] = useState<EyePrescription>({ ...defaultEyeData });
  const [framePrice, setFramePrice] = useState<number>(0);
  const [glassPrice, setGlassPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate total price when frame or glass price changes
  useEffect(() => {
    setTotalPrice(framePrice + glassPrice);
  }, [framePrice, glassPrice]);

  // Check if we're editing an existing record
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mobileParam = searchParams.get('mobile');
    
    if (mobileParam) {
      const record = getRecordByMobile(mobileParam);
      if (record) {
        setDate(record.date);
        setName(record.name);
        setMobile(record.mobile);
        setRightEye(record.rightEye);
        setLeftEye(record.leftEye);
        setFramePrice(record.framePrice);
        setGlassPrice(record.glassPrice);
        setTotalPrice(record.totalPrice);
        setRemarks(record.remarks);
        setIsEditing(true);
      }
    }
  }, [location.search, getRecordByMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!mobile || !name || !date || !remarks) {
      toast.error('Name, mobile number, date, and remarks are required');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    // Save record
    const newRecord: Omit<PatientRecord, 'id'> = {
      date,
      name,
      mobile,
      rightEye,
      leftEye,
      framePrice,
      glassPrice,
      totalPrice,
      remarks
    };

    setIsSaving(true);
    try {
      await addRecord(newRecord);
      toast.success(isEditing ? 'Record updated successfully' : 'Record added successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving record:', error);
      // Error is already handled in addRecord
    } finally {
      setIsSaving(false);
    }
  };

  const updateRightEye = (field: keyof EyePrescription, value: string) => {
    setRightEye(prev => ({ ...prev, [field]: value }));
  };

  const updateLeftEye = (field: keyof EyePrescription, value: string) => {
    setLeftEye(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Layout title="Loading..." showBackButton currentPath='/add-record'>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
          <p className="ml-2">Loading records...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditing ? 'Edit Record' : 'Add New Record'} showBackButton currentPath='/add-record'>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="date" className="form-label">Date</Label>
            <Input 
              type="date" 
              id="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="name" className="form-label">Patient Name</Label>
            <Input 
              type="text" 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="mobile" className="form-label">Mobile Number</Label>
            <Input 
              type="tel" 
              id="mobile" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input-field"
              placeholder="10-digit mobile number"
              required
              disabled={isEditing}
            />
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
            )}
          </div>

          {/* Right Eye Details */}
          <Card className="border-medical-300">
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-3 text-medical-800">Right Eye</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <Label htmlFor="rightSphere" className="form-label">Sphere</Label>
                  <Input 
                    type="text" 
                    id="rightSphere" 
                    value={rightEye.sphere}
                    onChange={(e) => updateRightEye('sphere', e.target.value)}
                    className="input-field"
                    placeholder="e.g. +2.00 or -1.50"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="rightCylinder" className="form-label">Cylinder</Label>
                  <Input 
                    type="text" 
                    id="rightCylinder" 
                    value={rightEye.cylinder}
                    onChange={(e) => updateRightEye('cylinder', e.target.value)}
                    className="input-field"
                    placeholder="e.g. -0.75"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="rightAxis" className="form-label">Axis</Label>
                  <Input 
                    type="text" 
                    id="rightAxis" 
                    value={rightEye.axis}
                    onChange={(e) => updateRightEye('axis', e.target.value)}
                    className="input-field"
                    placeholder="e.g. 180"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="rightAdd" className="form-label">Add</Label>
                  <Input 
                    type="text" 
                    id="rightAdd" 
                    value={rightEye.add}
                    onChange={(e) => updateRightEye('add', e.target.value)}
                    className="input-field"
                    placeholder="e.g. +2.50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Left Eye Details */}
          <Card className="border-medical-300">
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-3 text-medical-800">Left Eye</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <Label htmlFor="leftSphere" className="form-label">Sphere</Label>
                  <Input 
                    type="text" 
                    id="leftSphere" 
                    value={leftEye.sphere}
                    onChange={(e) => updateLeftEye('sphere', e.target.value)}
                    className="input-field"
                    placeholder="e.g. +2.00 or -1.50"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="leftCylinder" className="form-label">Cylinder</Label>
                  <Input 
                    type="text" 
                    id="leftCylinder" 
                    value={leftEye.cylinder}
                    onChange={(e) => updateLeftEye('cylinder', e.target.value)}
                    className="input-field"
                    placeholder="e.g. -0.75"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="leftAxis" className="form-label">Axis</Label>
                  <Input 
                    type="text" 
                    id="leftAxis" 
                    value={leftEye.axis}
                    onChange={(e) => updateLeftEye('axis', e.target.value)}
                    className="input-field"
                    placeholder="e.g. 180"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="leftAdd" className="form-label">Add</Label>
                  <Input 
                    type="text" 
                    id="leftAdd" 
                    value={leftEye.add}
                    onChange={(e) => updateLeftEye('add', e.target.value)}
                    className="input-field"
                    placeholder="e.g. +2.50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className="border-medical-300">
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-3 text-medical-800">Pricing Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <Label htmlFor="framePrice" className="form-label">Frame Price</Label>
                  <Input 
                    type="number" 
                    id="framePrice" 
                    value={framePrice.toString()}
                    onChange={(e) => setFramePrice(Number(e.target.value) || 0)}
                    className="input-field"
                    placeholder="Enter frame price"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="glassPrice" className="form-label">Glass Price</Label>
                  <Input 
                    type="number" 
                    id="glassPrice" 
                    value={glassPrice.toString()}
                    onChange={(e) => setGlassPrice(Number(e.target.value) || 0)}
                    className="input-field"
                    placeholder="Enter glass price"
                    min="0"
                  />
                </div>
                <div className="form-group col-span-2">
                  <Label htmlFor="totalPrice" className="form-label">Total Price</Label>
                  <Input 
                    type="number" 
                    id="totalPrice" 
                    value={totalPrice.toString()}
                    readOnly
                    className="input-field bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically calculated: Frame Price + Glass Price</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          <div className="form-group">
            <Label htmlFor="remarks" className="form-label">Remarks</Label>
            <Textarea 
              id="remarks" 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Add any additional notes or remarks here"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-medical-600 hover:bg-medical-700"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            isEditing ? 'Update Record' : 'Save Record'
          )}
        </Button>
      </form>
    </Layout>
  );
};

export default AddRecordForm;
