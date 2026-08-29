// Client-side cache (hydrated from the API, mutated via API calls) and shared UI state.
export const DB = { doctors: [], patient: null };

export const SLOT_TIMES = ['9:00 AM','9:30 AM','11:00 AM','1:15 PM','2:45 PM','4:00 PM'];
export const SLOT_DAYS = ['Today','Tomorrow','Thu, Aug 7'];

export const NAV_ITEMS = [
  {id:'dashboard', label:'Dashboard', icon:'home'},
  {id:'find', label:'Find a Doctor', icon:'doctor'},
  {id:'appointments', label:'Appointments', icon:'calendar'},
  {id:'messages', label:'Messages', icon:'chat'},
  {id:'record', label:'Health Record', icon:'record'},
  {id:'prescriptions', label:'Prescriptions', icon:'pill'},
  {id:'billing', label:'Billing', icon:'billing'},
  {id:'profile', label:'Profile', icon:'profile'},
];

export const state = {
  authTab:'login',
  activeTab:'dashboard',
  doctorFilter:'All',
  doctorSearch:'',
  profileDoctorId:null,
  pendingSlot:null,
  activeChat:'d1',
  callDoctorId:null,
  callSeconds:0,
  callTimerHandle:null,
  micOn:true,
  camOn:true,
};
