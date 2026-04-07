/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  Vote, 
  UserCircle,
  CheckCircle2,
  TrendingUp,
  Award,
  RotateCcw,
  Trash2,
  Edit2,
  X,
  Settings,
  Plus,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
  Lock,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
}

interface VoteData {
  employeeId: string;
  voterId: string;
  timestamp: number;
  emoji: string;
}

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'นางจิระภา พิษภาร', role: 'นักสาธารณสุขชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/jirapa/200' },
  { id: '2', name: 'นางรุ่งนภา จันผาย', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/rungnapa/200' },
  { id: '3', name: 'นางฟารีดา ไขแสงจันทร์', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/fareeda/200' },
  { id: '4', name: 'นางสาวภัทรศยา โพธิ์ดง', role: 'จพ.สธ.ชำนาญงาน', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/phattrasaya/200' },
  { id: '5', name: 'นางสาวกมลชนก สายรัตน์', role: 'นวก.สธ.ปฏิบัติการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/kamolchanok/200' },
  { id: '6', name: 'นางอุบล เทพโพธิ์', role: 'พนักงานบริการ', department: 'บริการ', avatar: 'https://picsum.photos/seed/ubon/200' },
  { id: '7', name: 'นางสุภลักษณ์ ไชยเสน', role: 'พว.ชำนาญการ(ผอ.รพ.สต.)', department: 'บริหาร', avatar: 'https://picsum.photos/seed/supalak/200' },
  { id: '8', name: 'นางกษมา ปานาง', role: 'นวก.สธ.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/kasama/200' },
  { id: '9', name: 'นางปานฤดี สุวงค์ภักดี', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/panrudee/200' },
  { id: '10', name: 'นางสาวหัทยา พิศภาร', role: 'พนักงานช่วยการพยาบาล', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/hattaya/200' },
  { id: '11', name: 'นางสาวศิริภรณ์ โคตรพิมพ์', role: 'จพ.ทันตฯปฏิบัติงาน', department: 'ทันตกรรม', avatar: 'https://picsum.photos/seed/siriporn/200' },
  { id: '12', name: 'นางกานดา จิตรจักร', role: 'แม่บ้าน', department: 'บริการ', avatar: 'https://picsum.photos/seed/kanda/200' },
  { id: '13', name: 'นางสาวฐิติรัตน์ ปานาง', role: 'พนักงานธุรการ', department: 'บริหาร', avatar: 'https://picsum.photos/seed/thitirat/200' },
  { id: '14', name: 'นางนรินทร์ทิพย์ กัญญาภัทรโภคิน', role: 'จพ.สธ.อาวุโส(ผอ.รพ.สต.)', department: 'บริหาร', avatar: 'https://picsum.photos/seed/narinthip/200' },
  { id: '15', name: 'นายศราวุฒิ กัญญาภัทรโภคิน', role: 'จพ.สธ.อาวุโส', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/sarawut/200' },
  { id: '16', name: 'นางสาวฟ้ารุ่ง ปุณณรัตน์กุล', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/farung/200' },
  { id: '17', name: 'นางสาวมานิตา พิทูลทอง', role: 'พว.ปฏิบัติการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/manita/200' },
  { id: '18', name: 'นางสาวอัจฉราภรณ์ วงค์จันทะ', role: 'นวก.สธ.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/atcharaporn/200' },
  { id: '19', name: 'นางสาวนัฐพร ศรีบุรมย์', role: 'นวก.สาธารณสุข', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/nattaporn/200' },
  { id: '20', name: 'นางสาวฐิติยา แก้วนาง', role: 'พนักงานธุรการ', department: 'บริหาร', avatar: 'https://picsum.photos/seed/thitiya/200' },
  { id: '21', name: 'นางสาวชญาภา พลสาร', role: 'พนักงานบริการ', department: 'บริการ', avatar: 'https://picsum.photos/seed/chayapa/200' },
  { id: '22', name: 'นายกีระติ วัฒทันติ', role: 'จพ.สธ.อาวุโส(ผอ.รพ.สต.)', department: 'บริหาร', avatar: 'https://picsum.photos/seed/keerati/200' },
  { id: '23', name: 'นางสาริกา สุวรรณรอด', role: 'นวก.สธ.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/sarika/200' },
  { id: '24', name: 'นางนฤดี พนมจันทร์', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/narudee/200' },
  { id: '25', name: 'นางสาวนาถระวี กุลอัก', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/nathrawee/200' },
  { id: '26', name: 'นางสาวสุนิภา โมธรรม', role: 'พว.ปฏิบัติการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/sunipa/200' },
  { id: '27', name: 'นางสาวพิมวลัย เพ็งบ้านซอด', role: 'นวก.สธ.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/pimwalai/200' },
  { id: '28', name: 'นางสุพรัตน์ ธนพึ่งพงษ์ทอง', role: 'จพ.สธ.ชำนาญงาน', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/suparat/200' },
  { id: '29', name: 'นางเกษร แสงคำ', role: 'นวก.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/kesorn/200' },
  { id: '30', name: 'นางสาวปาริฉัตร ปัญญาประชุม', role: 'จพ.ทันตฯชำนาญงาน', department: 'ทันตกรรม', avatar: 'https://picsum.photos/seed/parichat/200' },
  { id: '31', name: 'นายศิลปไทย ครองสิงห์', role: 'นวก.ปฏิบัติการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/silpathai/200' },
  { id: '32', name: 'นางสาวเพ็ญนภา บรรณารักษ์', role: 'นวก.สาธารณสุข', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/pennapa/200' },
  { id: '33', name: 'นางสาวจิรภิญญา สุวรรณรอด', role: 'นวก.สาธารณสุข', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/jirapinya/200' },
  { id: '34', name: 'นางสาวสมจิตย์ โพธิ์ดง', role: 'พนักงานบริการ', department: 'บริการ', avatar: 'https://picsum.photos/seed/somjit/200' },
  { id: '35', name: 'นางสาวศิริวิมล มานะศรี', role: 'พนักงานบริการ', department: 'บริการ', avatar: 'https://picsum.photos/seed/siriwimon/200' },
  { id: '36', name: 'นางเบญจมาศ พรมจันทร์', role: 'พว.ชำนาญการพิเศษ(ผอ.รพ.สต.)', department: 'บริหาร', avatar: 'https://picsum.photos/seed/benjamas/200' },
  { id: '37', name: 'นางวนิดา ศักขินาดี', role: 'นวก.สธ.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/wanida/200' },
  { id: '38', name: 'นางสาวอุไร ธนะคำดี', role: 'นวก.ชำนาญการ', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/urai/200' },
  { id: '39', name: 'นางสาวกอบแก้ว บุญคำภา', role: 'พว.ชำนาญการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/kobkaew/200' },
  { id: '40', name: 'นายณนทกร บัวถนอม', role: 'พว.ปฏิบัติการ', department: 'พยาบาล', avatar: 'https://picsum.photos/seed/nanthakorn/200' },
  { id: '41', name: 'นางสาวดวงฤทัย ตุ่ยสีมา', role: 'นวก.สาธารณสุข', department: 'สาธารณสุข', avatar: 'https://picsum.photos/seed/duangruthai/200' },
  { id: '42', name: 'นางสาวสไบแพร ดอนมืด', role: 'เจ้าพนักงานธุรการ', department: 'บริหาร', avatar: 'https://picsum.photos/seed/sabaiprae/200' },
  { id: '43', name: 'นางสาวชุติปภา พรหมอารักษ์', role: 'แม่บ้าน', department: 'บริการ', avatar: 'https://picsum.photos/seed/chutipapha/200' },
];

interface Voter {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'admin' | 'voter';
}

const CARTOON_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const emojiScores: Record<string, number> = { "❤️": 2, "👍": 1, "⭐": 1, "😡": -1 };

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [voters, setVoters] = useState<Voter[]>([
    { id: 'admin-init', name: 'ผู้ดูแลระบบ', username: 'admin', password: '00439', role: 'admin' },
    { id: 'voter-sanguan', name: 'นายสงวน ไชยเสน', username: 's', password: 's', role: 'voter' }
  ]);
  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'voter'; name: string } | null>(null);
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [votes, setVotes] = useState<Record<string, Record<string, Record<string, number>>>>({});
  const [activeTab, setActiveTab] = useState<'vote' | 'results' | 'yearly' | 'admin'>('vote');
  const [appLogo, setAppLogo] = useState<string>(() => localStorage.getItem('app-logo') || '');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    localStorage.setItem('app-logo', appLogo);
  }, [appLogo]);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { username, password } = loginForm;

    const user = voters.find(v => v.username === username && v.password === password);
    if (user) {
      setCurrentUser({ role: user.role, name: user.name });
      setLoginError('');
      return;
    }

    setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  };
  
  // Modal State
  const [modal, setModal] = useState<{
    type: 'edit' | 'reset-emp' | 'reset-month' | 'add-emp' | 'edit-emp' | 'add-voter' | 'edit-voter' | null;
    empId?: string;
    empName?: string;
    value?: string;
    employeeData?: Partial<Employee>;
    voterData?: Partial<Voter>;
  }>({ type: null });

  // Load data from local storage on mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('employee_votes_v3');
    const savedEmployees = localStorage.getItem('app_employees');
    const savedVoters = localStorage.getItem('app_voters');
    const savedUser = localStorage.getItem('app_current_user');

    if (savedVotes) setVotes(JSON.parse(savedVotes));
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedVoters) setVoters(JSON.parse(savedVoters));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem('employee_votes_v3', JSON.stringify(votes));
    localStorage.setItem('app_employees', JSON.stringify(employees));
    localStorage.setItem('app_voters', JSON.stringify(voters));
    localStorage.setItem('app_current_user', JSON.stringify(currentUser));
  }, [votes, employees, voters, currentUser]);

  const handleVote = (employeeId: string, emoji: string) => {
    setVotes(prev => {
      const monthVotes = prev[month] || {};
      const employeeVotes = monthVotes[employeeId] || {};
      const currentEmojiCount = employeeVotes[emoji] || 0;
      
      return {
        ...prev,
        [month]: {
          ...monthVotes,
          [employeeId]: {
            ...employeeVotes,
            [emoji]: currentEmojiCount + 1
          }
        }
      };
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const confirmResetEmployee = (employeeId: string) => {
    setVotes(prev => {
      const monthVotes = { ...prev[month] };
      delete monthVotes[employeeId];
      return { ...prev, [month]: monthVotes };
    });
    setModal({ type: null });
  };

  const confirmResetMonth = () => {
    setVotes(prev => {
      const newVotes = { ...prev };
      delete newVotes[month];
      return newVotes;
    });
    setModal({ type: null });
  };

  const confirmManualEdit = (employeeId: string, newValue: string) => {
    const score = parseInt(newValue);
    if (isNaN(score)) return;

    setVotes(prev => {
      const monthVotes = prev[month] || {};
      return {
        ...prev,
        [month]: {
          ...monthVotes,
          [employeeId]: { _manual: score }
        }
      };
    });
    setModal({ type: null });
  };

  const currentMonthVotes: Record<string, number> = useMemo(() => {
    const monthVotes = votes[month] || {};
    const result: Record<string, number> = {};
    
    Object.entries(monthVotes).forEach(([empId, emojiCounts]) => {
      if (typeof emojiCounts === 'number') {
        // Backward compatibility
        result[empId] = emojiCounts;
      } else {
        const counts = emojiCounts as Record<string, number>;
        let total = counts._manual || 0;
        Object.entries(counts).forEach(([emoji, count]) => {
          if (emoji !== '_manual') {
            total += (emojiScores[emoji] || 0) * count;
          }
        });
        result[empId] = total;
      }
    });
    
    return result;
  }, [votes, month]);

  const currentMonthEmojiCounts: Record<string, Record<string, number>> = useMemo(() => {
    const monthVotes = votes[month] || {};
    const result: Record<string, Record<string, number>> = {};
    
    Object.entries(monthVotes).forEach(([empId, emojiCounts]) => {
      if (typeof emojiCounts === 'object' && emojiCounts !== null) {
        result[empId] = emojiCounts as Record<string, number>;
      }
    });
    
    return result;
  }, [votes, month]);

  const yearlyVotes: Record<string, number> = useMemo(() => {
    const result: Record<string, number> = {};
    
    Object.values(votes).forEach(monthVotes => {
      Object.entries(monthVotes).forEach(([empId, emojiCounts]) => {
        let total = 0;
        if (typeof emojiCounts === 'number') {
          total = emojiCounts;
        } else {
          const counts = emojiCounts as Record<string, number>;
          total = counts._manual || 0;
          Object.entries(counts).forEach(([emoji, count]) => {
            if (emoji !== '_manual') {
              total += (emojiScores[emoji] || 0) * count;
            }
          });
        }
        result[empId] = (result[empId] || 0) + total;
      });
    });
    
    return result;
  }, [votes]);

  const yearlyEmojiCounts: Record<string, Record<string, number>> = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    
    Object.values(votes).forEach(monthVotes => {
      Object.entries(monthVotes).forEach(([empId, emojiCounts]) => {
        if (typeof emojiCounts === 'object' && emojiCounts !== null) {
          const counts = emojiCounts as Record<string, number>;
          if (!result[empId]) result[empId] = {};
          Object.entries(counts).forEach(([emoji, count]) => {
            if (emoji !== '_manual') {
              result[empId][emoji] = (result[empId][emoji] || 0) + count;
            }
          });
        }
      });
    });
    
    return result;
  }, [votes]);

  const chartData = useMemo(() => {
    return employees.map(emp => ({
      name: emp.name.split(' ')[0],
      fullName: emp.name,
      score: currentMonthVotes[emp.id] || 0,
      color: emp.id === '1' ? '#6366f1' : '#818cf8'
    })).sort((a, b) => b.score - a.score);
  }, [currentMonthVotes, employees]);

  const totalScore = Object.values(currentMonthVotes).reduce((acc: number, curr: number) => acc + curr, 0);
  
  const winner = useMemo(() => {
    const sorted = [...chartData].sort((a, b) => b.score - a.score);
    if (sorted.length === 0 || sorted[0].score <= 0) return null;
    return employees.find(e => e.name === sorted[0].fullName);
  }, [chartData, employees]);

  const exportMonthlyToExcel = () => {
    const data = chartData.map((d, index) => {
      const emp = employees.find(e => e.name === d.fullName);
      const counts = currentMonthEmojiCounts[emp?.id || ''] || {};
      return {
        'อันดับ': index + 1,
        'ชื่อ-นามสกุล': d.fullName,
        'ตำแหน่ง': emp?.role || '',
        'แผนก': emp?.department || '',
        ...Object.keys(emojiScores).reduce((acc, emoji) => ({
          ...acc,
          [emoji]: counts[emoji] || 0
        }), {}),
        'คะแนนรวม': d.score
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `รายงานเดือน ${month}`);
    XLSX.writeFile(wb, `รายงานโหวตพนักงาน_${month}.xlsx`);
  };

  const exportYearlyToExcel = () => {
    const data = yearlyChartData.map((d, index) => {
      const emp = employees.find(e => e.name === d.fullName);
      const counts = yearlyEmojiCounts[emp?.id || ''] || {};
      return {
        'อันดับ': index + 1,
        'ชื่อ-นามสกุล': d.fullName,
        'ตำแหน่ง': emp?.role || '',
        'แผนก': emp?.department || '',
        ...Object.keys(emojiScores).reduce((acc, emoji) => ({
          ...acc,
          [emoji]: counts[emoji] || 0
        }), {}),
        'คะแนนรวมทั้งปี': d.score
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานสรุปรายปี');
    XLSX.writeFile(wb, 'รายงานโหวตพนักงาน_สรุปรายปี.xlsx');
  };

  const yearlyChartData = useMemo(() => {
    return employees.map(emp => ({
      name: emp.name.split(' ')[0],
      fullName: emp.name,
      score: yearlyVotes[emp.id] || 0,
      color: '#4f46e5'
    })).sort((a, b) => b.score - a.score);
  }, [yearlyVotes, employees]);

  const yearlyWinner = useMemo(() => {
    const sorted = [...yearlyChartData].sort((a, b) => b.score - a.score);
    if (sorted.length === 0 || sorted[0].score <= 0) return null;
    return employees.find(e => e.name === sorted[0].fullName);
  }, [yearlyChartData, employees]);

  const handleAddEmployee = (data: Partial<Employee>) => {
    if (!data.name || !data.role) return;
    const newEmp: Employee = {
      id: Date.now().toString(),
      name: data.name,
      role: data.role,
      department: data.department || 'ทั่วไป',
      avatar: `https://picsum.photos/seed/${data.name}/200`
    };
    setEmployees(prev => [...prev, newEmp]);
    setModal({ type: null });
  };

  const handleEditEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...data } : emp));
    setModal({ type: null });
  };

  const handleDeleteEmployee = (id: string) => {
    if (!window.confirm('ยืนยันการลบรายชื่อพนักงาน?')) return;
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleAddVoter = (data: Partial<Voter>) => {
    if (!data.name || !data.username) return;
    const newVoter: Voter = { 
      id: Date.now().toString(), 
      name: data.name,
      username: data.username,
      password: data.password || '',
      role: data.role || 'voter'
    };
    setVoters(prev => [...prev, newVoter]);
    setModal({ type: null });
  };

  const handleEditVoter = (id: string, data: Partial<Voter>) => {
    setVoters(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    setModal({ type: null });
  };

  const handleDeleteVoter = (id: string) => {
    if (id === 'admin-init') {
      alert('ไม่สามารถลบผู้ดูแลระบบเริ่มต้นได้');
      return;
    }
    if (!window.confirm('ยืนยันการลบผู้ใช้งาน?')) return;
    setVoters(prev => prev.filter(v => v.id !== id));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('vote');
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md overflow-hidden rounded-[40px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="relative mb-6">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-purple-100 shadow-xl flex items-center justify-center bg-white">
                {appLogo ? (
                  <img 
                    src={appLogo} 
                    alt="App Logo" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=200&h=200" 
                    alt="Teamwork" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1 text-xs font-bold text-indigo-600 shadow-md">
                SSO BUENG KHONG LONG
              </div>
            </div>

            <h1 className="mb-2 text-4xl font-bold tracking-tight text-indigo-700" style={{ fontFamily: 'serif' }}>
              ขวัญใจสสอ.บึงโขงหลง
            </h1>
            <h2 className="mb-4 text-2xl font-bold text-slate-800">เข้าสู่ระบบ</h2>

            {/* Status Badge */}
            <div className="mb-8 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-600">
              <CheckCircle2 size={18} className="fill-emerald-500 text-white" />
              <span className="text-sm font-bold">พร้อมใช้งาน!</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-slate-700 ml-1">ชื่อผู้ใช้</label>
                <input 
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-purple-100 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-slate-700 ml-1">รหัสผ่าน</label>
                <input 
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-2xl border-2 border-purple-100 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>

              {loginError && (
                <p className="text-sm font-bold text-red-500">{loginError}</p>
              )}

              <button 
                type="submit"
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <Lock size={24} className="transition-transform group-hover:translate-x-1" />
                <span>เข้าสู่ระบบ</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 overflow-hidden">
              {appLogo ? (
                <img src={appLogo} alt="Logo" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <Trophy size={20} className="sm:size-24" />
              )}
            </div>
            <h1 className="hidden sm:block text-base font-bold tracking-tight text-slate-900">ระบบโหวตพนักงาน (หัวหน้างาน)</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <nav className="flex items-center gap-0.5 sm:gap-1 rounded-lg bg-slate-100 p-0.5 sm:p-1">
              <button
                onClick={() => setActiveTab('vote')}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 rounded-md px-2 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-all",
                  activeTab === 'vote' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Vote size={16} className="sm:size-18" />
                <span className="hidden sm:inline">โหวต</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 rounded-md px-2 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-all",
                  activeTab === 'results' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <BarChart3 size={16} className="sm:size-18" />
                <span className="hidden sm:inline">สรุปผล</span>
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 rounded-md px-2 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-all",
                  activeTab === 'yearly' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Trophy size={16} className="sm:size-18" />
                <span className="hidden sm:inline">สรุปรายปี</span>
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 rounded-md px-2 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-all",
                    activeTab === 'admin' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Settings size={16} className="sm:size-18" />
                  <span className="hidden sm:inline">ตั้งค่า</span>
                </button>
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">ออก</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'yearly' && (
            <motion.div
              key="yearly-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Yearly Winner Banner */}
              {yearlyWinner && (
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-2xl shadow-indigo-200">
                  <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                      <div className="relative">
                        <div className="absolute -inset-2 animate-pulse rounded-full bg-white/20 blur-xl" />
                        <img 
                          src={yearlyWinner.avatar} 
                          alt="" 
                          className="relative h-32 w-32 rounded-3xl border-4 border-white/30 object-cover shadow-2xl" 
                        />
                        <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-lg">
                          <Trophy size={20} />
                        </div>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                          🏆 พนักงานดีเด่นประจำปี 2026
                        </p>
                        <h2 className="mt-2 text-4xl font-black tracking-tight">{yearlyWinner.name}</h2>
                        <p className="text-indigo-100">{yearlyWinner.role} • {yearlyWinner.department}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                      <p className="text-sm font-bold text-indigo-100">คะแนนรวมทั้งปี</p>
                      <p className="text-5xl font-black">{yearlyVotes[yearlyWinner.id] || 0}</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                </div>
              )}

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Yearly Leaderboard */}
                <div className="lg:col-span-1">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Award className="text-indigo-600" />
                      อันดับคะแนนรวมทั้งปี
                    </h3>
                    <div className="space-y-3">
                      {yearlyChartData.slice(0, 10).map((data, idx) => {
                        const emp = employees.find(e => e.name === data.fullName);
                        return (
                          <div 
                            key={data.fullName}
                            className={cn(
                              "flex items-center justify-between rounded-2xl p-3 transition-all",
                              idx === 0 ? "bg-indigo-50 border border-indigo-100" : "bg-slate-50 border border-slate-100"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black",
                                idx === 0 ? "bg-amber-400 text-white" : "bg-white text-slate-400"
                              )}>
                                {idx + 1}
                              </span>
                              <img src={emp?.avatar} alt="" className="h-10 w-10 rounded-lg object-cover" />
                              <div>
                                <p className="text-sm font-bold text-slate-900 leading-tight">{data.fullName}</p>
                                <p className="text-[10px] text-slate-500">{emp?.department}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-indigo-600">{data.score}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Points</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Yearly Chart */}
                <div className="lg:col-span-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <BarChart3 className="text-indigo-600" />
                        กราฟสรุปคะแนนรายบุคคล (ทั้งปี)
                      </h3>
                      <button
                        onClick={exportYearlyToExcel}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        <Download size={18} />
                        <span>ส่งออกรายงานรายปี (Excel)</span>
                      </button>
                    </div>
                    <div className="h-[500px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={yearlyChartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                            width={80}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                const empId = employees.find(e => e.name === data.fullName)?.id;
                                const counts = empId ? yearlyEmojiCounts[empId] : null;
                                return (
                                  <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
                                    <p className="mb-2 font-bold text-slate-900">{data.fullName}</p>
                                    <p className="mb-3 text-2xl font-black text-indigo-600">{data.score} แต้ม</p>
                                    {counts && (
                                      <div className="flex gap-3 border-t border-slate-50 pt-3">
                                        {Object.entries(emojiScores).map(([emoji]) => (
                                          <div key={emoji} className="flex flex-col items-center">
                                            <span className="text-lg">{emoji}</span>
                                            <span className="text-xs font-bold text-slate-500">{counts[emoji] || 0}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={24}>
                            {yearlyChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#6366f1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'vote' ? (
            <motion.div
              key="vote-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">ให้คะแนนพนักงานประจำเดือน {month}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-2">
                {employees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 sm:p-6 shadow-sm transition-all hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl object-cover ring-2 sm:ring-4 ring-slate-50 transition-all group-hover:ring-indigo-50"
                        />
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white shadow-md">
                          <UserCircle size={12} className="text-slate-400 sm:size-20" />
                        </div>
                      </div>
                      <div className="rounded-full bg-slate-100 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {employee.department}
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-6">
                      <h3 className="text-sm sm:text-xl font-bold text-slate-900 leading-tight truncate sm:whitespace-normal">{employee.name}</h3>
                      <p className="text-[10px] sm:text-sm font-medium text-slate-500 truncate sm:whitespace-normal">{employee.role}</p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
                      {/* Total Score Badge at Top */}
                      <div className="flex justify-center">
                        <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-amber-500 px-3 py-0.5 sm:px-4 sm:py-1 text-[9px] sm:text-xs font-black text-white shadow-sm relative group/score">
                          <span>คะแนน: {currentMonthVotes[employee.id] || 0}</span>
                          
                          <div className="absolute -right-8 flex gap-0.5 opacity-0 group-hover/score:opacity-100 transition-opacity">
                            {currentUser.role === 'admin' && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModal({ 
                                      type: 'edit', 
                                      empId: employee.id, 
                                      empName: employee.name,
                                      value: (currentMonthVotes[employee.id] || 0).toString() 
                                    });
                                  }}
                                  className="p-0.5 text-indigo-400 hover:text-indigo-600"
                                  title="แก้ไขคะแนน"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModal({ 
                                      type: 'reset-emp', 
                                      empId: employee.id, 
                                      empName: employee.name 
                                    });
                                  }}
                                  className="p-0.5 text-rose-400 hover:text-rose-600"
                                  title="รีเซ็ตคะแนน"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Emoji Buttons with Counts */}
                      <div className="flex justify-between gap-1 sm:gap-2">
                        {Object.entries(emojiScores).map(([emoji]) => (
                          <button
                            key={emoji}
                            onClick={() => handleVote(employee.id, emoji)}
                            className="flex-1 flex flex-col items-center justify-center rounded-xl bg-white py-2 transition-all hover:bg-indigo-50 hover:scale-105 active:scale-95 border border-indigo-100 shadow-sm"
                          >
                            <span className="text-lg sm:text-2xl drop-shadow-sm">{emoji}</span>
                            <span className="text-[11px] sm:text-base font-black text-indigo-700 leading-none mt-1">
                              {currentMonthEmojiCounts[employee.id]?.[emoji] || 0}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'results' ? (
            <motion.div
              key="results-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Winner Card */}
                <div className="lg:col-span-1">
                  <div className="h-full rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-200">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="absolute -inset-4 animate-pulse rounded-full bg-white/20 blur-xl"></div>
                        <Award size={64} className="relative" />
                      </div>
                      <h3 className="text-lg font-medium text-indigo-100">พนักงานดีเด่นเดือน {month}</h3>
                      {winner ? (
                        <>
                          <div className="mt-4 space-y-2">
                            <img 
                              src={winner.avatar} 
                              alt={winner.name} 
                              referrerPolicy="no-referrer"
                              className="mx-auto h-32 w-32 rounded-3xl border-4 border-white/30 object-cover shadow-xl"
                            />
                            <h4 className="text-2xl font-bold">{winner.name}</h4>
                            <p className="text-indigo-100">{winner.role}</p>
                          </div>
                          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                            <div className="text-left">
                              <p className="text-xs font-medium uppercase tracking-wider text-indigo-200">คะแนนรวม</p>
                              <p className="text-3xl font-black">{currentMonthVotes[winner.id] || 0}</p>
                            </div>
                            <div className="h-10 w-px bg-white/20"></div>
                            <div className="text-left">
                              <p className="text-xs font-medium uppercase tracking-wider text-indigo-200">สัดส่วน</p>
                              <p className="text-3xl font-black">
                                {totalScore > 0 ? Math.round(((currentMonthVotes[winner.id] || 0) / totalScore) * 100) : 0}%
                              </p>
                            </div>
                          </div>

                          {currentMonthEmojiCounts[winner.id] && (
                            <div className="mt-6 flex justify-center gap-4 rounded-2xl bg-white/5 p-4">
                              {Object.entries(emojiScores).map(([emoji]) => (
                                <div key={emoji} className="flex flex-col items-center">
                                  <span className="text-xl">{emoji}</span>
                                  <span className="text-sm font-bold text-indigo-100">
                                    {currentMonthEmojiCounts[winner.id][emoji] || 0}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="mt-4 text-indigo-100">ยังไม่มีข้อมูลคะแนนในเดือนนี้</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chart & Stats */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Top 10 Leaderboard */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <span className="text-2xl">📊</span>
                        Top 10 อันดับ
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {chartData.slice(0, 10).map((data, index) => {
                        const rank = index + 1;
                        const maxScore = chartData[0]?.score || 1;
                        const percentage = (data.score / maxScore) * 100;
                        
                        // Colors based on rank
                        const barColor = rank === 1 ? 'bg-amber-500' : 
                                        rank === 2 ? 'bg-slate-400' : 
                                        rank === 3 ? 'bg-amber-700' : 'bg-indigo-500';
                        
                        const rankColor = rank === 1 ? 'text-amber-500' : 
                                         rank === 2 ? 'text-slate-400' : 
                                         rank === 3 ? 'text-amber-700' : 'text-indigo-400';

                        return (
                          <div key={data.fullName} className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                              <div className="flex items-center gap-3">
                                <span className={cn("w-6 text-lg font-black italic", rankColor)}>
                                  {rank}
                                </span>
                                <span className="font-bold text-slate-900 text-sm sm:text-base">
                                  {data.fullName}
                                </span>
                              </div>
                              <span className={cn("font-black text-lg", rankColor)}>
                                {data.score}
                              </span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={cn("h-full rounded-full transition-all", barColor)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <BarChart3 className="text-indigo-600" />
                        กราฟสรุปคะแนนประจำเดือน {month}
                      </h3>
                      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
                        <TrendingUp size={16} />
                        <span>คะแนนรวมทั้งหมด: {totalScore}</span>
                      </div>
                      <button
                        onClick={exportMonthlyToExcel}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        <Download size={18} />
                        <span>ส่งออก Excel</span>
                      </button>
                    </div>

                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 14, fontWeight: 500 }}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`${value} คะแนน`, 'คะแนนสะสม']}
                          />
                          <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={32}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#e2e8f0'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Users className="text-indigo-600" />
                      รายละเอียดคะแนนรายบุคคล
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100 pb-4">
                            <th className="pb-4 font-bold text-slate-500 uppercase text-xs tracking-wider">พนักงาน</th>
                            {Object.keys(emojiScores).map(emoji => (
                              <th key={emoji} className="pb-4 text-center font-bold text-slate-500 uppercase text-xs tracking-wider">{emoji}</th>
                            ))}
                            <th className="pb-4 text-right font-bold text-slate-500 uppercase text-xs tracking-wider">รวมคะแนน</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {chartData.map(data => {
                            const emp = employees.find(e => e.name === data.fullName);
                            if (!emp) return null;
                            const counts = currentMonthEmojiCounts[emp.id] || {};
                            return (
                              <tr key={emp.id} className="group hover:bg-slate-50 transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <img src={emp.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
                                    <div>
                                      <p className="font-bold text-slate-900 leading-tight">{emp.name}</p>
                                      <p className="text-[10px] text-slate-500">{emp.role}</p>
                                    </div>
                                  </div>
                                </td>
                                {Object.keys(emojiScores).map(emoji => (
                                  <td key={emoji} className="py-4 text-center font-medium text-slate-600">
                                    {counts[emoji] || 0}
                                  </td>
                                ))}
                                <td className="py-4 text-right font-black text-indigo-600">
                                  {data.score}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-sm font-medium text-slate-500">พนักงานที่ได้คะแนนสูงสุด</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{winner?.name || '-'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <p className="text-sm font-medium text-slate-500">เดือนที่กำลังแสดงผล</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{month}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Employee Management */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Users className="text-indigo-600" />
                      จัดการรายชื่อพนักงาน
                    </h3>
                    <button 
                      onClick={() => setModal({ type: 'add-emp', employeeData: { avatar: CARTOON_AVATARS[0] } })}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                    >
                      <Plus size={18} />
                      เพิ่มพนักงาน
                    </button>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                    {employees.map(emp => (
                      <div key={emp.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt="" className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{emp.name}</p>
                            <p className="text-xs text-slate-500">{emp.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setModal({ type: 'edit-emp', empId: emp.id, employeeData: emp })}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voter Management */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                      <ShieldCheck className="text-indigo-600" />
                      จัดการผู้ใช้งานและสิทธิ์
                    </h3>
                    <button 
                      onClick={() => setModal({ type: 'add-voter', voterData: { role: 'voter' } })}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                    >
                      <UserPlus size={18} />
                      เพิ่มผู้ใช้งาน
                    </button>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                    {voters.map(v => (
                      <div key={v.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            v.role === 'admin' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                          )}>
                            {v.role === 'admin' ? <ShieldCheck size={20} /> : <UserCircle size={24} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{v.name}</p>
                            <p className="text-xs text-slate-500">ชื่อผู้ใช้: {v.username}</p>
                            <p className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block",
                              v.role === 'admin' ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                            )}>
                              {v.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้โหวต'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setModal({ type: 'edit-voter', empId: v.id, voterData: v })}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteVoter(v.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* App Settings */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Settings className="text-indigo-600" />
                  ตั้งค่าแอปพลิเคชัน
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">โลโก้แอปพลิเคชัน (URL รูปภาพ)</label>
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md overflow-hidden">
                        {appLogo ? (
                          <img src={appLogo} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Trophy size={24} />
                        )}
                      </div>
                      <input 
                        type="text"
                        value={appLogo}
                        onChange={(e) => setAppLogo(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-slate-500">ใส่ URL ของรูปภาพเพื่อเปลี่ยนโลโก้ที่มุมซ้ายบน (เว้นว่างไว้เพื่อใช้โลโก้เริ่มต้น)</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-rose-50 p-8">
                <h3 className="flex items-center gap-2 text-xl font-bold text-rose-900">
                  <RotateCcw className="text-rose-600" />
                  พื้นที่อันตราย
                </h3>
                <p className="mt-2 text-rose-700">การกระทำเหล่านี้ไม่สามารถย้อนกลับได้ กรุณาตรวจสอบให้แน่ใจ</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button 
                    onClick={() => setModal({ type: 'reset-month' })}
                    className="rounded-xl bg-rose-600 px-6 py-3 font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700"
                  >
                    ล้างคะแนนเดือน {month}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Custom Modal */}
      <AnimatePresence>
        {modal.type && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal({ type: null })}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
            >
              <button 
                onClick={() => setModal({ type: null })}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              {modal.type === 'edit' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">แก้ไขคะแนน</h3>
                    <p className="text-sm text-slate-500">พนักงาน: {modal.empName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">ระบุคะแนนใหม่</label>
                    <input 
                      type="number"
                      autoFocus
                      value={modal.value}
                      onChange={(e) => setModal({ ...modal, value: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setModal({ type: null })}
                      className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      onClick={() => confirmManualEdit(modal.empId!, modal.value!)}
                      className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              )}

              {(modal.type === 'add-emp' || modal.type === 'edit-emp') && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {modal.type === 'add-emp' ? 'เพิ่มรายชื่อพนักงาน' : 'แก้ไขรายชื่อพนักงาน'}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล</label>
                      <input 
                        type="text"
                        value={modal.employeeData?.name || ''}
                        onChange={(e) => setModal({ ...modal, employeeData: { ...modal.employeeData, name: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">ตำแหน่ง</label>
                      <input 
                        type="text"
                        value={modal.employeeData?.role || ''}
                        onChange={(e) => setModal({ ...modal, employeeData: { ...modal.employeeData, role: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">แผนก</label>
                      <input 
                        type="text"
                        value={modal.employeeData?.department || ''}
                        onChange={(e) => setModal({ ...modal, employeeData: { ...modal.employeeData, department: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">รูปภาพ (URL หรือเลือกการ์ตูน)</label>
                      <input 
                        type="text"
                        value={modal.employeeData?.avatar || ''}
                        onChange={(e) => setModal({ ...modal, employeeData: { ...modal.employeeData, avatar: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        placeholder="https://..."
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {CARTOON_AVATARS.map((avatar, idx) => (
                          <button
                            key={idx}
                            onClick={() => setModal({ ...modal, employeeData: { ...modal.employeeData, avatar } })}
                            className={cn(
                              "h-10 w-10 overflow-hidden rounded-lg border-2 transition-all",
                              modal.employeeData?.avatar === avatar ? "border-indigo-600 scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                          >
                            <img src={avatar} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setModal({ type: null })}
                      className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      onClick={() => modal.type === 'add-emp' ? handleAddEmployee(modal.employeeData!) : handleEditEmployee(modal.empId!, modal.employeeData!)}
                      className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              )}

              {(modal.type === 'add-voter' || modal.type === 'edit-voter') && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {modal.type === 'add-voter' ? 'เพิ่มผู้ใช้งาน' : 'แก้ไขผู้ใช้งาน'}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">ชื่อ-นามสกุล</label>
                      <input 
                        type="text"
                        value={modal.voterData?.name || ''}
                        onChange={(e) => setModal({ ...modal, voterData: { ...modal.voterData, name: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        placeholder="เช่น นายสงวน ไชยเสน"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">ชื่อผู้ใช้ (Username)</label>
                      <input 
                        type="text"
                        value={modal.voterData?.username || ''}
                        onChange={(e) => setModal({ ...modal, voterData: { ...modal.voterData, username: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        placeholder="ใช้สำหรับเข้าสู่ระบบ"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">รหัสผ่าน</label>
                      <input 
                        type="text"
                        value={modal.voterData?.password || ''}
                        onChange={(e) => setModal({ ...modal, voterData: { ...modal.voterData, password: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        placeholder="รหัสผ่านเข้าสู่ระบบ"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">สิทธิ์การใช้งาน</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ ...modal, voterData: { ...modal.voterData, role: 'voter' } })}
                          className={cn(
                            "flex-1 rounded-xl py-2 font-bold transition-all",
                            modal.voterData?.role === 'voter' ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          ผู้โหวต
                        </button>
                        <button
                          onClick={() => setModal({ ...modal, voterData: { ...modal.voterData, role: 'admin' } })}
                          className={cn(
                            "flex-1 rounded-xl py-2 font-bold transition-all",
                            modal.voterData?.role === 'admin' ? "bg-amber-500 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          ผู้ดูแลระบบ
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setModal({ type: null })}
                      className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      onClick={() => modal.type === 'add-voter' ? handleAddVoter(modal.voterData!) : handleEditVoter(modal.empId!, modal.voterData!)}
                      className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                    >
                      {modal.type === 'add-voter' ? 'เพิ่มผู้ใช้งาน' : 'บันทึกการแก้ไข'}
                    </button>
                  </div>
                </div>
              )}

              {(modal.type === 'reset-emp' || modal.type === 'reset-month') && (
                <div className="space-y-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <RotateCcw size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">ยืนยันการรีเซ็ต</h3>
                    <p className="mt-2 text-slate-600">
                      {modal.type === 'reset-emp' 
                        ? `คุณต้องการลบคะแนนทั้งหมดของ ${modal.empName} ในเดือนนี้ใช่หรือไม่?`
                        : `คุณต้องการลบคะแนนทั้งหมดของพนักงานทุกคนในเดือน ${month} ใช่หรือไม่?`}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setModal({ type: null })}
                      className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      onClick={() => modal.type === 'reset-emp' ? confirmResetEmployee(modal.empId!) : confirmResetMonth()}
                      className="flex-1 rounded-xl bg-rose-600 py-3 font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700"
                    >
                      ยืนยันรีเซ็ต
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-white shadow-2xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-bold">บันทึกคะแนนแล้ว!</p>
                <p className="text-sm text-slate-400">คะแนนถูกสะสมในเดือน {month}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">
            &copy; 2026 Supervisor Voting Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
