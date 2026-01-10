import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Heart, Calendar, Clock, Wallet, CheckCircle2, Moon, Sun, Plus, Trash2, 
  ChevronLeft, ChevronRight, Sparkles, Zap, ListTodo, BellRing, Send, 
  BarChart2, TrendingUp, PenTool, Smile, Meh, Frown, HeartPulse, 
  MessageSquareQuote, Star, Play, Pause, RotateCcw, Coffee, 
  Timer, Wind, Bird, Waves, Palette, Coffee as BearIcon, Compass, Rocket, Laptop, Leaf,
  Settings, X, Check, Edit3, AlertCircle, Volume2
} from 'lucide-react';

// --- FUNGSI PEMBANTU (Statis) ---
const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const getFormattedDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Persist state to localStorage so data survives refresh
function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const App = () => {
  // --- KONFIGURASI TEMA ---
  const themes = {
    pink: {
      mainBg: 'bg-[#FFF5F8]', cardBg: 'bg-white', sidebarBg: 'bg-white',
      accent: 'bg-pink-400', accentText: 'text-pink-600', primaryText: 'text-gray-700',
      secondaryText: 'text-gray-500', dateText: 'text-pink-600', accentBorder: 'border-pink-100',
      button: 'bg-pink-500', buttonHover: 'hover:bg-pink-600', chartFrom: 'from-pink-500', chartTo: 'to-pink-300',
      tabActive: 'bg-pink-500 text-white shadow-pink-200', tabInactive: 'text-pink-300 hover:bg-pink-50',
      Icon: Sparkles, emoji: "🌸", floral: "🌹", todayRing: "ring-pink-400", displayName: 'Blossom Journaling'
    },
    brown: {
      mainBg: 'bg-[#FDF5E6]', cardBg: 'bg-[#FAF0E6]', sidebarBg: 'bg-[#FFFBF0]',
      accent: 'bg-[#A1887F]', accentText: 'text-[#5D4037]', primaryText: 'text-[#5D4037]',
      secondaryText: 'text-[#8D6E63]', dateText: 'text-[#5D4037]', accentBorder: 'border-[#D7CCC8]',
      button: 'bg-[#8D6E63]', buttonHover: 'hover:bg-[#795548]', chartFrom: 'from-[#8D6E63]', chartTo: 'to-[#D7CCC8]',
      tabActive: 'bg-[#8D6E63] text-white shadow-[#D7CCC8]', tabInactive: 'text-[#A1887F] hover:bg-[#EFEBE9]',
      Icon: BearIcon, emoji: "🧸", floral: "🌻", todayRing: "ring-[#8D6E63]", displayName: 'Panda Journaling'
    },
    midnight: {
      mainBg: 'bg-[#0F172A]', cardBg: 'bg-[#1E293B]', sidebarBg: 'bg-[#0F172A]',
      accent: 'bg-[#38BDF8]', accentText: 'text-[#38BDF8]', primaryText: 'text-slate-100',
      secondaryText: 'text-slate-400', dateText: 'text-white', accentBorder: 'border-[#334155]',
      button: 'bg-[#0EA5E9]', buttonHover: 'hover:bg-[#0284C7]', chartFrom: 'from-[#0EA5E9]', chartTo: 'to-[#38BDF8]',
      tabActive: 'bg-[#38BDF8] text-[#0F172A] shadow-[#0EA5E9]/50', tabInactive: 'text-slate-400 hover:bg-slate-800',
      Icon: Compass, emoji: "🌌", floral: "🌲", todayRing: "ring-sky-400", displayName: 'Cosmic Journaling'
    },
    kids: {
      mainBg: 'bg-[#E0F2FE]', cardBg: 'bg-white', sidebarBg: 'bg-[#F0F9FF]',
      accent: 'bg-[#FACC15]', accentText: 'text-[#0369A1]', primaryText: 'text-[#0369A1]',
      secondaryText: 'text-sky-600', dateText: 'text-[#0369A1]', accentBorder: 'border-[#BAE6FD]',
      button: 'bg-[#38BDF8]', buttonHover: 'hover:bg-[#0EA5E9]', chartFrom: 'from-[#FACC15]', chartTo: 'to-[#FEF08A]',
      tabActive: 'bg-[#38BDF8] text-white shadow-[#BAE6FD]', tabInactive: 'text-[#0369A1] hover:bg-sky-100',
      Icon: Rocket, emoji: "🚀", floral: "🌈", todayRing: "ring-yellow-400", displayName: 'Rocket Journaling'
    },
    sage: {
      mainBg: 'bg-[#F1F8E9]', cardBg: 'bg-white', sidebarBg: 'bg-[#DCEDC8]',
      accent: 'bg-[#8BC34A]', accentText: 'text-[#33691E]', primaryText: 'text-[#33691E]',
      secondaryText: 'text-[#689F38]', dateText: 'text-[#33691E]', accentBorder: 'border-[#C5E1A5]',
      button: 'bg-[#689F38]', buttonHover: 'hover:bg-[#558B2F]', chartFrom: 'from-[#689F38]', chartTo: 'to-[#AED581]',
      tabActive: 'bg-[#689F38] text-white shadow-[#DCEDC8]', tabInactive: 'text-[#558B2F] hover:bg-white/50',
      Icon: Leaf, emoji: "🌿", floral: "🍃", todayRing: "ring-[#8BC34A]", displayName: 'Forest Journaling'
    },
    minimalist: {
      mainBg: 'bg-[#F9FAFB]', cardBg: 'bg-white', sidebarBg: 'bg-[#F3F4F6]',
      accent: 'bg-[#374151]', accentText: 'text-[#111827]', primaryText: 'text-[#111827]',
      secondaryText: 'text-gray-500', dateText: 'text-white', accentBorder: 'border-[#E5E7EB]',
      button: 'bg-[#111827]', buttonHover: 'hover:bg-[#1F2937]', chartFrom: 'from-[#111827]', chartTo: 'to-[#6B7280]',
      tabActive: 'bg-[#111827] text-white shadow-gray-200', tabInactive: 'text-gray-500 hover:bg-gray-100',
      Icon: Laptop, emoji: "⚪", floral: "⚖️", todayRing: "ring-gray-800", displayName: 'Mono Journaling'
    }
  };

  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventInput, setEventInput] = useState('');
  const [theme, setTheme] = usePersistedState('theme', 'midnight'); 
  
  const t = themes[theme] || themes.midnight;
  const ThemeIcon = t.Icon;

  // --- STATE DATA ---
  const [events, setEvents] = usePersistedState('events', {}); 
  const [timeBlocks, setTimeBlocks] = usePersistedState('timeBlocks', []); 
  const [habitsData, setHabitsData] = usePersistedState('habitsData', {}); 
  const [financeData, setFinanceData] = usePersistedState('financeData', {}); 
  const [financeRange, setFinanceRange] = useState('day');
  const [riyadhohData, setRiyadhohData] = usePersistedState('riyadhohData', {}); 
  const [journalData, setJournalData] = usePersistedState('journalData', {});
  const [newBlock, setNewBlock] = useState({ start: "07:00", end: "08:00", activity: "" });

  // --- CRUD STATE TARGET ---
  const [userHabits, setUserHabits] = usePersistedState('userHabits', ["Jogging 🏃‍♀️", "Catat 5 Kosakata 📚", "Screen Time < 4 Jam 📱", "Journaling ✍️", "No Phone Before / After Sleep 📵"]);
  const [userSunnah, setUserSunnah] = usePersistedState('userSunnah', ['Tahajud', 'Taubat', 'Witir', 'Dhuha', 'Sholawat', 'Ngaji']);
  
  const [isEditHabit, setIsEditHabit] = useState(false);
  const [isEditSunnah, setIsEditSunnah] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newSunnahName, setNewSunnahName] = useState('');
  
  const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'info' });
  const [showThemeModal, setShowThemeModal] = useState(false);

  // --- STATE TIMER & POMODORO ---
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(1500);
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const [currentFocusActivity, setCurrentFocusActivity] = useState('');
  const [skipBreakAfterSession, setSkipBreakAfterSession] = useState(false);
  
  // --- ASMR & NOTIFICATION ENGINE ---
  const [isMorningActive, setIsMorningActive] = useState(false);
  const audioContextRef = useRef(null);
  const waterNodeRef = useRef(null);
  const birdTimerRef = useRef(null);

  const dateKey = getFormattedDate(selectedDate);

  // --- HANDLERS ---
  const triggerModal = (title, message, onConfirm = null, type = 'info') => {
    setModal({ show: true, title, message, onConfirm, type });
  };

  const playNotificationSound = () => {
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.8);
  };

  const handleAddEvent = () => {
    if (!eventInput.trim()) {
      triggerModal('Ups!', 'Tuliskan isi agenda kamu dulu ya!', null, 'warning');
      return;
    }
    setEvents(prev => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), eventInput.trim()] }));
    setEventInput('');
    triggerModal('Agenda Disimpan!', 'Agenda harian kamu sudah tercatat dengan rapi ✨');
  };

  const addTimeBlock = () => {
    if (!newBlock.start || !newBlock.end || !newBlock.activity) {
      triggerModal('Data Kurang', 'Lengkapi jam dan nama kegiatan misi kamu ya!', null, 'warning');
      return;
    }
    setTimeBlocks(prev => [...prev, { ...newBlock, date: dateKey, id: Date.now() }]);
    setNewBlock({ start: "07:00", end: "08:00", activity: "" });
    triggerModal('Tersimpan!', 'Jadwal baru sudah masuk ke lini masa produktif kamu 🚀');
  };

  const startSessionFromBlock = (block) => {
    const [h1, m1] = block.start.split(':').map(Number);
    const [h2, m2] = block.end.split(':').map(Number);
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff < 0) diff += 1440;
    const secs = diff * 60;
    const minutes = diff;
    
    setCurrentFocusActivity(block.activity);
    setTimerSeconds(secs);
    setInitialSeconds(secs);
    setPomodoroMode('work');
    
    // Jika kurang dari 25 menit, skip break otomatis setelahnya
    setSkipBreakAfterSession(minutes < 25);
    
    setIsTimerActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddItemToList = (type) => {
    if (type === 'habit') {
      if (!newHabitName.trim()) return;
      setUserHabits([...userHabits, newHabitName.trim()]);
      setNewHabitName('');
    } else {
      if (!newSunnahName.trim()) return;
      setUserSunnah([...userSunnah, newSunnahName.trim()]);
      setNewSunnahName('');
    }
  };

  const handleRemoveItemFromList = (type, index) => {
    triggerModal(
      'Hapus Target?', 
      'Data ini akan dihapus dari daftar target kamu. Kamu yakin?', 
      () => {
        if (type === 'habit') setUserHabits(userHabits.filter((_, i) => i !== index));
        else setUserSunnah(userSunnah.filter((_, i) => i !== index));
        setModal(p => ({ ...p, show: false }));
      },
      'danger'
    );
  };

  const updateJournal = (field, value) => {
    setJournalData(prev => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] || { mood: '', note: '', gratitudes: ['', '', ''] }), [field]: value }
    }));
  };

  // --- ASMR ENGINE ---
  const stopMorningVibe = () => {
    if (waterNodeRef.current) { try { waterNodeRef.current.stop(); } catch (e) {} waterNodeRef.current = null; }
    if (birdTimerRef.current) { clearInterval(birdTimerRef.current); birdTimerRef.current = null; }
    setIsMorningActive(false);
  };

  const playMorningVibe = () => {
    stopMorningVibe();
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioContextRef.current;
    const bufferSize = 4 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 1.2; 
    }
    const water = ctx.createBufferSource();
    water.buffer = buffer; water.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 400;
    const gain = ctx.createGain(); gain.gain.value = 0.08;
    water.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    water.start();
    waterNodeRef.current = water;
    birdTimerRef.current = setInterval(() => {
      if (Math.random() > 0.6) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        const f = 2000 + Math.random() * 3000;
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f - 1000, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.05);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      }
    }, 2800);
    setIsMorningActive(true);
  };

  // --- TIMER EFFECT ---
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            playNotificationSound();
            if (pomodoroMode === 'work') {
              // Jika session kurang dari 25 menit, langsung selesai (tidak ada break)
              if (skipBreakAfterSession) {
                triggerModal('Sesi Selesai!', 'Sesi fokus kamu selesai dengan baik! 🎉');
                setPomodoroMode('work');
                setIsTimerActive(false);
                setSkipBreakAfterSession(false);
                setCurrentFocusActivity('');
                return 0;
              } else {
                // Jika 25 menit atau lebih, kasih break 25 menit
                setPomodoroMode('break');
                triggerModal('Waktunya Rehat!', 'Sesi fokus selesai. Ayo istirahat sejenak ☕');
                setInitialSeconds(300);
                return 300;
              }
            } else {
              setPomodoroMode('work');
              triggerModal('Mulai Fokus!', 'Waktu istirahat habis. Ayo kembali produktif 🚀');
              setInitialSeconds(1500);
              return 1500;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, pomodoroMode, skipBreakAfterSession]);

  // --- STATS LOGIC ---
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      days.push({ formatted: getFormattedDate(d), label: d.toLocaleDateString('id-ID', { weekday: 'short' }) });
    }
    return days;
  }, [selectedDate]);

  const statsData = useMemo(() => {
    return last7Days.map(day => {
      const hData = habitsData[day.formatted] || {};
      const rData = riyadhohData[day.formatted] || {};
      const hScore = userHabits.filter(h => hData[h] === true).length;
      let rScore = userSunnah.filter(s => rData[s.toLowerCase()] === true).length;
      if (rData.sholat5) rScore += Object.values(rData.sholat5).filter(v => v === true).length;
      return { ...day, hScore, rScore };
    });
  }, [last7Days, habitsData, riyadhohData, userHabits, userSunnah]);

  const financeTotals = useMemo(() => {
    const selected = new Date(selectedDate);
    const startOfWeek = () => {
      const d = new Date(selected);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day; // start Monday
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const endOfWeek = () => {
      const d = startOfWeek();
      d.setDate(d.getDate() + 6);
      d.setHours(23, 59, 59, 999);
      return d;
    };

    const isInRange = (k) => {
      const d = new Date(k);
      if (Number.isNaN(d.getTime())) return false;
      if (financeRange === 'day') return k === getFormattedDate(selected);
      if (financeRange === 'week') return d >= startOfWeek() && d <= endOfWeek();
      if (financeRange === 'month') return d.getFullYear() === selected.getFullYear() && d.getMonth() === selected.getMonth();
      if (financeRange === 'year') return d.getFullYear() === selected.getFullYear();
      return false;
    };

    let income = 0;
    let expenses = 0;
    Object.entries(financeData || {}).forEach(([k, v]) => {
      if (!isInRange(k)) return;
      const inc = (v.income || []).reduce((a, c) => a + (c.amount || 0), 0);
      const out = (v.expenses || []).reduce((a, c) => a + (c.amount || 0), 0);
      income += inc;
      expenses += out;
    });
    return { income, expenses, balance: income - expenses };
  }, [financeData, financeRange, selectedDate]);

  const dailyFinance = financeData[dateKey] || { income: [], expenses: [] };
  const dailyRiyadhoh = riyadhohData[dateKey] || { sholat5: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false } };
  const dailyHabits = habitsData[dateKey] || {};
  const calendarDays = Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1);

  return (
    <div className={`min-h-screen ${t.mainBg} font-sans ${t.primaryText} flex flex-col md:flex-row transition-colors duration-500 relative`}>
      
      {/* THEME MODAL MOBILE */}
      {showThemeModal && (
        <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 md:hidden">
          <div className={`${t.cardBg} w-full md:max-w-sm rounded-t-[3rem] md:rounded-[2.5rem] p-8 shadow-2xl border ${t.accentBorder} animate-in slide-in-from-bottom duration-300`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-2xl font-black ${t.accentText} uppercase tracking-tighter`}>Pilih Suasana</h3>
              <button onClick={() => setShowThemeModal(false)} className={`p-2 rounded-full ${t.accentText} hover:opacity-60 transition-all`}><X size={24}/></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption color="bg-pink-400" label="Blossom" active={theme==='pink'} onClick={()=>{setTheme('pink'); setShowThemeModal(false);}} />
              <ThemeOption color="bg-[#8D6E63]" label="Panda" active={theme==='brown'} onClick={()=>{setTheme('brown'); setShowThemeModal(false);}} />
              <ThemeOption color="bg-slate-900" label="Cosmic" active={theme==='midnight'} onClick={()=>{setTheme('midnight'); setShowThemeModal(false);}} />
              <ThemeOption color="bg-[#38BDF8]" label="Rocket" active={theme==='kids'} onClick={()=>{setTheme('kids'); setShowThemeModal(false);}} />
              <ThemeOption color="bg-[#8BC34A]" label="Forest" active={theme==='sage'} onClick={()=>{setTheme('sage'); setShowThemeModal(false);}} />
              <ThemeOption color="bg-[#111827]" label="Mono" active={theme==='minimalist'} onClick={()=>{setTheme('minimalist'); setShowThemeModal(false);}} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`${t.cardBg} w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl border ${t.accentBorder} text-center transform animate-in zoom-in-95 duration-300`}>
            <div className={`${modal.type === 'danger' ? 'bg-rose-500' : modal.type === 'warning' ? 'bg-amber-500' : t.accent} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg`}>
              {modal.onConfirm ? <AlertCircle className="text-white" size={36}/> : modal.type === 'warning' ? <X className="text-white" size={36}/> : <Check className="text-white" size={36}/>}
            </div>
            <h3 className={`text-2xl font-black ${t.accentText} mb-3 uppercase tracking-tighter`}>{modal.title}</h3>
            <p className={`${t.secondaryText} text-sm font-bold mb-10 leading-relaxed`}>{modal.message}</p>
            <div className="flex gap-3">
              {modal.onConfirm ? (
                <>
                  <button onClick={() => setModal({...modal, show: false})} className="flex-1 p-4 rounded-2xl bg-gray-100 text-gray-500 font-black text-xs uppercase">Batal</button>
                  <button onClick={modal.onConfirm} className={`flex-1 p-4 rounded-2xl ${t.button} text-white font-black text-xs uppercase shadow-md`}>Hapus</button>
                </>
              ) : (
                <button onClick={() => setModal({...modal, show: false})} className={`w-full p-4 rounded-2xl ${t.button} text-white font-black text-xs uppercase shadow-md`}>Siap!</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className={`w-64 ${t.sidebarBg} border-r ${t.accentBorder} hidden md:flex flex-col p-6 sticky top-0 h-screen z-20 shadow-sm`}>
        <div className="flex items-center gap-2 mb-10">
          <div className={`${t.accent} p-2 rounded-2xl shadow-lg`}>
            {ThemeIcon && <ThemeIcon className="text-white" size={24} />}
          </div>
          <h1 className={`text-xl font-bold ${t.accentText} italic tracking-tight uppercase`}>{t.displayName || theme}</h1>
        </div>
        
        <div className={`mb-8 p-3 rounded-2xl ${theme === 'midnight' ? 'bg-slate-800' : 'bg-white'} border ${t.accentBorder} shadow-inner`}>
           <span className={`text-[8px] font-black uppercase block mb-3 text-center ${theme === 'midnight' ? 'text-slate-500' : 'text-gray-400'}`}>Suasana</span>
           <div className="flex justify-center gap-1.5 flex-wrap">
             <ThemeDot color="bg-pink-400" active={theme==='pink'} onClick={()=>setTheme('pink')} />
             <ThemeDot color="bg-[#8D6E63]" active={theme==='brown'} onClick={()=>setTheme('brown')} />
             <ThemeDot color="bg-slate-900" active={theme==='midnight'} onClick={()=>setTheme('midnight')} />
             <ThemeDot color="bg-[#38BDF8]" active={theme==='kids'} onClick={()=>setTheme('kids')} />
             <ThemeDot color="bg-[#8BC34A]" active={theme==='sage'} onClick={()=>setTheme('sage')} />
             <ThemeDot color="bg-[#111827]" active={theme==='minimalist'} onClick={()=>setTheme('minimalist')} />
           </div>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarLink t={t} icon={<Calendar />} label="Agenda" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <SidebarLink t={t} icon={<Clock />} label="Time Blocking" active={activeTab === 'time'} onClick={() => setActiveTab('time')} />
          <SidebarLink t={t} icon={<PenTool />} label="Journal" active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
          <SidebarLink t={t} icon={<Heart />} label="Habit" active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} />
          <SidebarLink t={t} icon={<Wallet />} label="Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <SidebarLink t={t} theme={theme} icon={<Moon />} label="Riyadhoh" active={activeTab === 'riyadhoh'} onClick={() => setActiveTab('riyadhoh')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h2 className={`text-3xl font-black ${t.accentText} tracking-tight capitalize`}>{activeTab.replace('-', ' ')}</h2>
            <div className="mt-1">
              <span className={`${t.dateText} font-bold ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-800' : 'bg-white'} px-3 py-1 rounded-full border ${t.accentBorder} text-sm shadow-sm`}>
                {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
             <div className="text-xl mr-2 animate-bounce">{t.floral}</div>
             <input type="date" value={dateKey} onChange={(e) => e.target.value && setSelectedDate(new Date(e.target.value))} className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-600'} border-none rounded-xl p-2 text-xs font-bold shadow-sm outline-none cursor-pointer`}/>
             <button onClick={() => setShowThemeModal(true)} className={`md:hidden p-2.5 rounded-xl ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-800 text-slate-400' : 'bg-white ' + t.accentText} shadow-sm hover:shadow-md transition-all`}><Palette size={20}/></button>
          </div>
        </header>

        {/* --- VIEW: TIME BLOCKING --- */}
        {activeTab === 'time' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${t.cardBg} rounded-[3rem] p-10 shadow-xl border-4 transition-all duration-700 ${pomodoroMode === 'break' ? 'border-emerald-200 shadow-emerald-50' : `${t.accentBorder}`} flex flex-col items-center relative overflow-hidden`}>
                <div className="absolute top-6 left-6"><button onClick={() => isMorningActive ? stopMorningVibe() : playMorningVibe()} className={`p-4 rounded-full transition-all shadow-md ${isMorningActive ? 'bg-indigo-400 text-white animate-pulse' : `${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-700 text-slate-200' : 'bg-white ' + t.accentText}`}`}><Bird size={22}/></button></div>
                <div className="mb-6 text-center">{pomodoroMode === 'work' ? <span className={`${t.accentText} ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50' : 'bg-gray-50'} px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${t.accentBorder} shadow-sm`}><Timer size={14}/> Sesi Fokus</span> : <span className="text-emerald-500 bg-emerald-500/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border border-emerald-500/30 shadow-sm"><Wind size={14}/> Sesi Rehat</span>}</div>
                <h3 className={`text-sm font-bold ${theme === 'midnight' || theme === 'minimalist' ? 'text-slate-400' : 'text-gray-400'} uppercase mb-8 italic text-center min-h-[20px]`}>{currentFocusActivity || "Ready to shine?"}</h3>
                <div className="relative w-64 h-64 mb-10 flex items-center justify-center font-black text-6xl">
                    {/* RESTORED TIMER CIRCLE */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="8" fill="transparent" className="opacity-10" />
                      <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={690} strokeDashoffset={690 - (690 * timerSeconds) / initialSeconds} strokeLinecap="round" className={`${pomodoroMode === 'work' ? (theme === 'pink' ? 'text-pink-500' : theme === 'brown' ? 'text-[#8D6E63]' : theme === 'sage' ? 'text-[#8BC34A]' : theme === 'midnight' ? 'text-sky-400' : 'text-gray-700') : 'text-emerald-400'} transition-all duration-1000 ease-linear`} />
                    </svg>
                    <span className={pomodoroMode === 'work' ? t.accentText : 'text-emerald-500'}>{formatTimer(timerSeconds)}</span>
                </div>
                <div className="flex gap-3 mb-8">
                  <button onClick={() => { setIsTimerActive(false); setTimerSeconds(1500); setInitialSeconds(1500); setPomodoroMode('work'); }} className={`px-4 py-2 rounded-full text-[10px] font-black ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-700 text-slate-200' : 'bg-white ' + t.accentText} hover:shadow-md transition-all`}>25M FOCUS</button>
                  <button onClick={() => { setIsTimerActive(false); setTimerSeconds(300); setInitialSeconds(300); setPomodoroMode('break'); }} className="px-4 py-2 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 hover:shadow-md transition-all">5M BREAK</button>
                </div>
                <div className="flex gap-5">
                  <button onClick={() => setIsTimerActive(!isTimerActive)} className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transform transition-all hover:scale-110 ${isTimerActive ? 'bg-amber-400' : (pomodoroMode === 'work' ? t.button : 'bg-emerald-500')}`}>{isTimerActive ? <Pause size={36}/> : <Play size={36} className="ml-1"/>}</button>
                  <button onClick={() => {setIsTimerActive(false); setTimerSeconds(initialSeconds);}} className={`w-16 h-16 rounded-full ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-700 text-slate-400' : 'bg-white text-gray-300'} flex items-center justify-center hover:bg-gray-50/10 transition-all`}><RotateCcw size={28}/></button>
                </div>
              </div>
              <div className="space-y-6">
                <div className={`${t.cardBg} rounded-[2.5rem] p-8 shadow-xl border ${t.accentBorder}`}>
                  <h3 className={`text-xl font-black ${t.accentText} mb-6 flex items-center gap-2 uppercase`}><Clock/> Scheduling</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <TimeInput t={t} theme={theme} label="Start" value={newBlock.start} onChange={v => setNewBlock({...newBlock, start: v})} />
                    <TimeInput t={t} theme={theme} label="End" value={newBlock.end} onChange={v => setNewBlock({...newBlock, end: v})} />
                  </div>
                  <input type="text" placeholder="Apa rencanamu?" value={newBlock.activity} onChange={e => setNewBlock({...newBlock, activity: e.target.value})} className={`w-full ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50 text-slate-200' : 'bg-gray-50'} border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-sky-400 outline-none mb-4 shadow-inner border ${t.accentBorder}`}/>
                  <button onClick={addTimeBlock} className={`w-full ${t.button} text-white p-4 rounded-xl font-black text-sm shadow-lg ${t.buttonHover} transition-all flex items-center justify-center gap-2 uppercase tracking-widest`}><Plus size={20}/> Tambahkan</button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                  {timeBlocks.filter(b => b.date === dateKey).sort((a,b) => a.start.localeCompare(b.start)).map(block => (
                    <div key={block.id} className={`${t.cardBg} p-5 rounded-[2.5rem] shadow-sm border ${t.accentBorder} flex items-center justify-between group hover:shadow-md transition-all`}>
                      <div className="flex items-center gap-4">
                        <div className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50' : 'bg-white'} p-3 rounded-2xl ${t.accentText} font-black text-center text-xs min-w-[90px] shadow-sm`}>{block.start} - {block.end}</div>
                        <h4 className={`font-bold ${theme === 'midnight' ? 'text-slate-200' : 'text-gray-700'} text-sm`}>{block.activity}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startSessionFromBlock(block)} className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-700' : 'bg-white'} text-emerald-400 p-2.5 rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-sm`}><Play size={16} fill="currentColor"/></button>
                        <button onClick={() => setTimeBlocks(prev => prev.filter(b => b.id !== block.id))} className={`${theme === 'midnight' ? 'text-slate-600' : 'text-rose-300'} hover:text-rose-500 p-2.5 rounded-full transition-all`}><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: CALENDAR --- */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`lg:col-span-2 ${t.cardBg} rounded-[2.5rem] p-8 shadow-xl border ${t.accentBorder}`}>
               <div className="flex justify-between items-center mb-8">
                  <h3 className={`text-xl font-black ${t.accentText} uppercase tracking-widest`}>{selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-800 text-slate-500' : 'bg-white text-gray-400'} p-2 rounded-xl shadow-sm`}><ChevronLeft/></button>
                    <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-800 text-slate-500' : 'bg-white text-gray-400'} p-2 rounded-xl shadow-sm`}><ChevronRight/></button>
                  </div>
               </div>
               <div className="grid grid-cols-7 gap-3 text-center">
                 {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (<div key={d} className={`text-[10px] font-black ${theme === 'midnight' || theme === 'minimalist' ? 'text-slate-600' : 'text-gray-300'} uppercase mb-2`}>{d}</div>))}
                 {Array(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()).fill(null).map((_, i) => <div key={`e-${i}`}></div>)}
                 {calendarDays.map(day => {
                    const dObj = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                    const formatted = getFormattedDate(dObj);
                    const isSelected = selectedDate.getDate() === day && getFormattedDate(selectedDate) === formatted;
                    // TANDAI TANGGAL 4 (HARI INI)
                    const isToday = getFormattedDate(new Date()) === formatted;

                    return (
                      <div key={day} onClick={() => setSelectedDate(dObj)} className={`aspect-square border rounded-[1.25rem] p-2 cursor-pointer flex flex-col justify-between transition-all ${isSelected ? `${t.button} shadow-lg text-white border-transparent` : isToday ? `bg-white ring-4 ${t.todayRing} ${t.accentBorder}` : `${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-800/40 border-slate-700 hover:border-sky-400' : 'bg-white ' + t.accentBorder + ' hover:border-gray-400'}`}`}>
                        <span className={`text-sm font-black ${isToday && !isSelected ? t.accentText : ''}`}>{day}</span>
                        <div className="flex justify-center mb-0.5">{(events[formatted] || []).length > 0 && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : t.button} animate-pulse`}></div>}</div>
                      </div>
                    )
                 })}
               </div>
            </div>
            <div className={`${t.cardBg} rounded-[2.5rem] p-8 shadow-xl border-t-[10px] ${t.button.replace('bg-', 'border-')} h-fit border-x border-b ${t.accentBorder}`}>
              <h3 className={`text-lg font-black ${t.accentText} mb-6 flex items-center gap-2`}><BellRing size={20}/> Agenda</h3>
              <div className="flex gap-2 mb-6">
                <input type="text" placeholder="Ada tugas?" value={eventInput} onChange={(e) => setEventInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()} className={`flex-1 ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50 text-slate-200' : 'bg-white'} border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-400 outline-none shadow-sm`}/><button onClick={handleAddEvent} className={`${t.button} text-white p-3 rounded-xl active:scale-90`}><Send size={18}/></button>
              </div>
              <div className="space-y-3">
                {(events[dateKey] || []).map((e, idx) => (
                  <div key={idx} className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/30 border-slate-700' : 'bg-white border-gray-50'} p-4 rounded-2xl flex justify-between items-center border shadow-sm animate-in slide-in-from-right`}>
                    <span className="text-sm font-bold">{e}</span>
                    <button onClick={() => setEvents(p => ({ ...p, [dateKey]: p[dateKey].filter((_, i) => i !== idx) }))} className="text-slate-500 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: HABITS (CRUD) --- */}
        {activeTab === 'habits' && (
           <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
             <div className={`${t.cardBg} rounded-[2.5rem] p-8 shadow-xl border ${t.accentBorder}`}>
               <div className="flex justify-between items-center mb-8">
                 <h3 className={`text-lg font-black ${t.accentText} uppercase flex items-center gap-2`}><TrendingUp size={20}/> Habit Progress</h3>
                 <button onClick={() => setIsEditHabit(!isEditHabit)} className={`p-2 rounded-xl border ${t.accentBorder} ${t.accentText} hover:bg-white transition-all shadow-sm`}>{isEditHabit ? <Check size={18}/> : <Settings size={18}/>}</button>
               </div>
               <div className="flex items-end justify-between h-40 gap-2 px-4">
                 {statsData.map(day => {
                   const max = Math.max(1, userHabits.length);
                   return (
                     <div key={day.formatted} className="flex-1 flex flex-col items-center">
                       <div className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50' : 'bg-gray-50'} w-full rounded-t-xl h-32 flex items-end overflow-hidden border ${t.accentBorder} shadow-inner`}>
                         <div className={`w-full bg-gradient-to-t ${t.chartFrom} ${t.chartTo} transition-all duration-500`} style={{ height: `${(day.hScore/max)*100}%` }}>{day.hScore>0 && <div className="text-[10px] font-black text-white text-center pt-1">{day.hScore}</div>}</div>
                       </div>
                       <span className={`text-[9px] font-black ${theme === 'midnight' || theme === 'minimalist' ? 'text-slate-500' : 'text-gray-400'} mt-2 uppercase`}>{day.label}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
             <div className={`${t.cardBg} rounded-[2.5rem] p-10 shadow-xl border ${t.accentBorder}`}>
               <h3 className={`text-2xl font-black ${t.accentText} mb-8 uppercase text-center tracking-widest`}>Harian: {dateKey}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {userHabits.map((habit, idx) => (
                   <div key={idx} className="relative group">
                     <button onClick={() => !isEditHabit && setHabitsData(p => ({...p, [dateKey]: {...(p[dateKey]||{}), [habit]: !p[dateKey]?.[habit]}}))} className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${dailyHabits[habit] ? `${t.button} border-transparent text-white shadow-lg scale-105` : `bg-white ${t.accentBorder} ${t.accentText}`}`}>
                       <span className="font-black uppercase text-xs tracking-wider">{habit}</span>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${dailyHabits[habit] ? 'bg-white/20' : 'bg-gray-100'}`}>{dailyHabits[habit] && <CheckCircle2 size={18} />}</div>
                     </button>
                     {isEditHabit && <button onClick={() => handleRemoveItemFromList('habit', idx)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all z-10"><X size={14}/></button>}
                   </div>
                 ))}
                 {isEditHabit && (
                   <div className="flex gap-2 p-4 border-2 border-dashed rounded-[2rem] border-gray-300 bg-white/20">
                     <input value={newHabitName} onChange={e => setNewHabitName(e.target.value)} placeholder="Habit baru..." className={`flex-1 bg-transparent text-xs outline-none ${t.primaryText}`} />
                     <button onClick={() => handleAddItemToList('habit')} className={`${t.button} text-white p-2 rounded-xl shadow-md`}><Plus size={18}/></button>
                   </div>
                 )}
               </div>
             </div>
           </div>
        )}

        {/* --- VIEW: RIYADHOH --- */}
        {activeTab === 'riyadhoh' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
             <div className={`${t.cardBg} rounded-[2.5rem] p-8 shadow-xl border ${t.accentBorder}`}>
               <div className="flex justify-between items-center mb-8">
                 <h3 className={`text-lg font-black ${t.accentText} uppercase flex items-center gap-2`}><BarChart2 size={20}/> Spiritual Score</h3>
                 <button onClick={() => setIsEditSunnah(!isEditSunnah)} className={`p-2 rounded-xl border ${t.accentBorder} ${t.accentText} hover:bg-white transition-all shadow-sm`}>{isEditSunnah ? <Check size={18}/> : <Settings size={18}/>}</button>
               </div>
               <div className="flex items-end justify-between h-40 gap-2 px-4">
                 {statsData.map(day => {
                   const max = userSunnah.length + 5;
                   return (
                     <div key={day.formatted} className="flex-1 flex flex-col items-center">
                       <div className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50' : 'bg-gray-50'} w-full rounded-t-xl h-32 flex items-end overflow-hidden border ${t.accentBorder} shadow-inner`}>
                         <div className={`w-full bg-gradient-to-t ${theme === 'midnight' ? 'from-sky-600 to-sky-300' : theme === 'pink' ? 'from-indigo-400 to-pink-300' : theme === 'sage' ? 'from-[#33691E] to-[#8BC34A]' : theme === 'kids' ? 'from-[#FACC15] to-[#FEF08A]' : 'from-[#374151] to-[#A1887F]'} transition-all duration-500`} style={{ height: `${(day.rScore/max)*100}%` }}>{day.rScore>0 && <div className="text-[10px] font-black text-white text-center pt-1">{day.rScore}</div>}</div>
                       </div>
                       <span className={`text-[9px] font-black ${theme === 'midnight' || theme === 'minimalist' ? 'text-slate-500' : 'text-gray-400'} mt-2 uppercase`}>{day.label}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`${t.cardBg} rounded-[2.5rem] p-10 shadow-xl border ${t.accentBorder}`}>
                <h3 className={`text-2xl font-black ${t.accentText} mb-8 uppercase tracking-tighter`}><Moon className="inline mr-2" size={20}/> Sunnah</h3>
                <div className="grid grid-cols-1 gap-3">
                  {userSunnah.map((key, idx) => (
                    <div key={idx} className="relative group">
                      <RiyadhohCheck t={t} theme={theme} label={key} checked={dailyRiyadhoh[key.toLowerCase()]} onClick={() => !isEditSunnah && setRiyadhohData(p => ({...p, [dateKey]: {...(p[dateKey]||dailyRiyadhoh), [key.toLowerCase()]: !p[dateKey]?.[key.toLowerCase()]}}))} />
                      {isEditSunnah && <button onClick={() => handleRemoveItemFromList('sunnah', idx)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg z-10 hover:scale-110 transition-all"><X size={12}/></button>}
                    </div>
                  ))}
                  {isEditSunnah && (
                    <div className="flex gap-2 p-4 border-2 border-dashed rounded-[2rem] border-gray-300 bg-white/20">
                      <input value={newSunnahName} onChange={e => setNewSunnahName(e.target.value)} placeholder="Sunnah baru..." className={`flex-1 bg-transparent text-xs outline-none ${t.primaryText}`} />
                      <button onClick={() => handleAddItemToList('sunnah')} className={`${t.button} text-white p-2 rounded-xl shadow-md`}><Plus size={18}/></button>
                    </div>
                  )}
                </div>
              </div>
              <div className={`${t.cardBg} rounded-[2.5rem] p-10 shadow-xl border ${t.accentBorder}`}>
                <h3 className={`text-2xl font-black ${t.accentText} mb-8 uppercase tracking-tighter`}><Sun className="inline mr-2" size={20}/> Fardhu</h3>
                <div className="grid grid-cols-1 gap-3">
                  {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map(s => (
                    <RiyadhohCheck t={t} theme={theme} key={s} label={s} checked={dailyRiyadhoh.sholat5?.[s]} onClick={() => setRiyadhohData(p => ({...p, [dateKey]: {...(p[dateKey]||dailyRiyadhoh), sholat5: {...(p[dateKey]?.sholat5||dailyRiyadhoh.sholat5), [s]: !p[dateKey]?.sholat5?.[s]}}}))} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: FINANCE --- */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right duration-500">
            <div className="space-y-8">
              <FinanceBox 
                t={t} theme={theme} title="Income 💰" items={dailyFinance.income} color="green" 
                onAdd={(n, a) => setFinanceData(p => ({...p, [dateKey]: {...(p[dateKey]||{income:[],expenses:[]}), income: [...(p[dateKey]?.income||[]), {id:Date.now(),name:n,amount:parseFloat(a)}]}}))} 
                triggerModal={triggerModal}
              />
              <FinanceBox 
                t={t} theme={theme} title="Expenses 📉" items={dailyFinance.expenses} color="rose" 
                onAdd={(n, a) => setFinanceData(p => ({...p, [dateKey]: {...(p[dateKey]||{income:[],expenses:[]}), expenses: [...(p[dateKey]?.expenses||[]), {id:Date.now(),name:n,amount:parseFloat(a)}]}}))} 
                triggerModal={triggerModal}
              />
            </div>
            <div className={`bg-gradient-to-br ${theme === 'pink' ? 'from-pink-500 to-rose-400' : theme === 'brown' ? 'from-[#8D6E63] to-[#5D4037]' : theme === 'midnight' ? 'from-[#1E293B] to-[#0F172A]' : theme === 'sage' ? 'from-[#689F38] to-[#9CCC65]' : theme === 'kids' ? 'from-[#0EA5E9] to-[#FACC15]' : 'from-[#374151] to-[#111827]'} rounded-[3rem] p-12 text-white shadow-2xl h-fit text-center sticky top-10 border ${t.accentBorder}`}>
               <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 text-left">
                 <h3 className="text-lg md:text-xl font-black uppercase opacity-70 tracking-widest text-white leading-tight">Remaining Balance</h3>
                 <div className="w-full md:w-auto">
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-white/10 border border-white/25 rounded-2xl p-2 text-[11px] font-black uppercase tracking-[0.06em] justify-items-start">
                     {['day','week','month','year'].map(r => (
                       <button
                         key={r}
                         onClick={() => setFinanceRange(r)}
                         className={`w-full text-left rounded-xl px-3 py-1.5 transition-all whitespace-nowrap leading-tight ${financeRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-white/85 hover:bg-white/10 border border-transparent'}`}
                       >
                         {r === 'day' ? 'Day' : r === 'week' ? 'Week' : r === 'month' ? 'Month' : 'Year'}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
               <div className="text-6xl font-black drop-shadow-md text-white mb-6">Rp {financeTotals.balance.toLocaleString()}</div>
               <div className="grid grid-cols-2 gap-3 text-xs font-black uppercase tracking-widest">
                 <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                   <div className="text-white/70 mb-1">Masuk</div>
                   <div className="text-2xl">Rp {financeTotals.income.toLocaleString()}</div>
                 </div>
                 <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                   <div className="text-white/70 mb-1">Keluar</div>
                   <div className="text-2xl">Rp {financeTotals.expenses.toLocaleString()}</div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW: JOURNAL --- */}
        {activeTab === 'journal' && (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
            <div className={`${t.cardBg} rounded-[2.5rem] p-10 shadow-xl border ${t.accentBorder}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4"><MessageSquareQuote className={t.accentText} size={24}/><h3 className={`text-2xl font-black ${t.accentText} uppercase tracking-tighter`}>Journal</h3></div>
                <div className={`flex gap-2 ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50' : 'bg-gray-50'} p-2 rounded-2xl border ${t.accentBorder} shadow-inner`}>
                  <MoodButton icon={<Smile/>} active={journalData[dateKey]?.mood==='happy'} onClick={()=>updateJournal('mood','happy')} color="text-emerald-400" bg="bg-emerald-500/10"/>
                  <MoodButton icon={<Meh/>} active={journalData[dateKey]?.mood==='neutral'} onClick={()=>updateJournal('mood','neutral')} color="text-amber-400" bg="bg-amber-500/10"/>
                  <MoodButton icon={<Frown/>} active={journalData[dateKey]?.mood==='sad'} onClick={()=>updateJournal('mood','sad')} color="text-rose-400" bg="bg-rose-500/10"/>
                </div>
              </div>
              <textarea placeholder="Write your story..." className={`w-full h-80 ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50 text-slate-300' : 'bg-gray-50'} border-none rounded-[2rem] p-8 text-sm focus:ring-2 focus:ring-sky-400 outline-none resize-none font-medium mb-8 shadow-inner border ${t.accentBorder}`} value={journalData[dateKey]?.note || ''} onChange={(e)=>updateJournal('note',e.target.value)}/>
              <div className="space-y-4">
                <h4 className={`font-black ${t.accentText} text-xs uppercase tracking-widest flex items-center gap-2`}><Star size={14}/> Gratitude List</h4>
                {[0, 1, 2].map((i) => (<input key={i} type="text" placeholder="I'm grateful for..." className={`w-full ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50 text-slate-300 placeholder:text-slate-600' : 'bg-white'} border-none rounded-xl p-4 text-sm outline-none shadow-sm border ${t.accentBorder}`} value={journalData[dateKey]?.gratitudes?.[i] || ''} onChange={(e)=>{const n=[...(journalData[dateKey]?.gratitudes || ['', '', ''])]; n[i]=e.target.value; updateJournal('gratitudes',n)}}/>))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className={`${t.sidebarBg} fixed bottom-0 left-0 w-full backdrop-blur-md border-t ${t.accentBorder} flex justify-around p-4 md:hidden z-50 shadow-lg`}>
        <MobileLink t={t} theme={theme} icon={<Calendar/>} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
        <MobileLink t={t} theme={theme} icon={<Clock/>} active={activeTab === 'time'} onClick={() => setActiveTab('time')} />
        <MobileLink t={t} theme={theme} icon={<PenTool/>} active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
        <MobileLink t={t} theme={theme} icon={<Heart/>} active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} />
        <MobileLink t={t} theme={theme} icon={<Wallet/>} active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
        <MobileLink t={t} theme={theme} icon={<Moon/>} active={activeTab === 'riyadhoh'} onClick={() => setActiveTab('riyadhoh')} />
      </nav>
    </div>
  );
};

// --- KOMPONEN PENDUKUNG ---
const ThemeDot = ({ color, active, onClick }) => (<button onClick={onClick} className={`w-5 h-5 rounded-full ${color} border-2 transition-all ${active ? 'border-white ring-2 ring-slate-400' : 'border-transparent opacity-60 hover:opacity-100'}`}></button>);
const SidebarLink = ({ icon, label, active, onClick, t }) => (<button onClick={onClick} className={`w-full flex items-center gap-3 p-3.5 rounded-[1.25rem] transition-all font-black uppercase text-[10px] tracking-wider ${active ? t.tabActive : t.tabInactive}`}>{React.cloneElement(icon, { size: 16 })}<span>{label}</span></button>);
const MobileLink = ({ icon, active, onClick, t, theme }) => (<button onClick={onClick} className={`p-3 rounded-2xl transition-all ${active ? (theme === 'midnight' ? 'bg-sky-500 text-slate-900 scale-110 shadow-lg' : t.button + ' text-white scale-110 shadow-lg') : 'text-slate-400'}`}>{React.cloneElement(icon, { size: 24 })}</button>);
const TimeInput = ({ label, value, onChange, t, theme }) => (<div className="flex flex-col"><label className={`text-[10px] font-black ${t.accentText} uppercase ml-1 mb-1`}>{label}</label><input type="time" value={value} onChange={e => onChange(e.target.value)} className={`w-full ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900 text-slate-200' : 'bg-white'} border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-400 outline-none shadow-inner border ${t.accentBorder} font-bold`}/></div>);

const FinanceBox = ({ title, items, onAdd, color, t, theme, triggerModal }) => {
  const [n, setN] = useState('');
  const [a, setA] = useState('');
  const validateAndAdd = () => {
    if (!n.trim()) { triggerModal('Ups!', 'Masukkan nama item pengeluaran/pemasukan dulu ya!', null, 'warning'); return; }
    if (!a || isNaN(a) || parseFloat(a) <= 0) { triggerModal('Jumlah Belum Ada', 'Tolong masukkan angka nominal yang benar ya! 💰', null, 'warning'); return; }
    onAdd(n, a); setN(''); setA(''); triggerModal('Berhasil!', 'Data keuangan kamu sudah diperbarui ✨');
  };
  return (
    <div className={`${t.cardBg} rounded-[2.5rem] p-8 shadow-xl border-b-4 ${t.accentBorder} border-x border-t`}>
      <h3 className={`font-black ${t.accentText} mb-6 uppercase text-sm`}>{title}</h3>
      <div className="flex gap-2 mb-6">
        <input placeholder="Nama..." value={n} onChange={e => setN(e.target.value)} className={`flex-1 ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50 text-slate-200' : 'bg-gray-50'} border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-400 outline-none`}/>
        <input type="number" placeholder="Rp" value={a} onChange={e => setA(e.target.value)} className={`w-28 ${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/50 text-slate-200' : 'bg-gray-50'} border-none rounded-xl p-3 text-sm outline-none`}/>
        <button onClick={validateAndAdd} className={`${t.button} text-white p-3 rounded-xl active:scale-90 transition-all`}><Plus size={20}/></button>
      </div>
      <div className="space-y-3">{items?.map(i => <div key={i.id} className={`${theme === 'midnight' || theme === 'minimalist' ? 'bg-slate-900/30 border-slate-700' : 'bg-gray-50 border-white'} flex justify-between p-4 rounded-2xl text-xs font-black shadow-sm border`}><span>{i.name}</span><span className={color === 'green' ? 'text-emerald-400' : 'text-rose-400'}>Rp {i.amount.toLocaleString()}</span></div>)}</div>
    </div>
  );
};

const RiyadhohCheck = ({ label, checked, onClick, t, theme }) => (
  <button onClick={onClick} className={`w-full flex justify-between items-center p-5 rounded-[2rem] border-2 transition-all ${checked ? (theme === 'midnight' || theme === 'minimalist' ? 'bg-sky-500 border-transparent text-slate-900 scale-[1.02]' : t.button + ' border-transparent text-white scale-[1.02]') : (theme === 'midnight' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white ' + t.accentBorder + ' ' + t.accentText + ' hover:border-gray-300')}`}>
    <span className="font-black text-xs uppercase leading-none">{label}</span>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${checked ? (theme === 'midnight' ? 'bg-slate-900/20' : 'bg-white/20') : 'bg-slate-700/20 shadow-inner'}`}>{checked && <CheckCircle2 size={18} />}</div>
  </button>
);

const MoodButton = ({ icon, active, onClick, color, bg }) => (
  <button onClick={onClick} className={`p-3 rounded-2xl transition-all ${active ? `${bg} ${color} scale-110 shadow-sm border border-white/10` : 'text-slate-500'}`}>
    {React.cloneElement(icon, { size: 24, fill: active ? 'currentColor' : 'none', opacity: active ? 1 : 0.5 })}
  </button>
);

const ThemeOption = ({ color, label, active, onClick }) => (
  <button onClick={onClick} className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2 border-2 ${active ? 'border-white ring-2 ring-offset-2 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
    <div className={`w-12 h-12 rounded-full ${color} shadow-md`}></div>
    <span className="text-xs font-black uppercase">{label}</span>
  </button>
);

export default App;

