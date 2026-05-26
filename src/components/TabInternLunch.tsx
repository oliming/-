import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, Friend } from '../types';
import { MOCK_FRIENDS } from '../restaurantsData';
import { Sparkles, MessageCircle, Heart, UserPlus, ToggleLeft, ToggleRight } from 'lucide-react';

interface TabInternLunchProps {
  soloLunchActive: boolean;
  onToggleSoloLunch: (active: boolean) => void;
  activePersonalityFilter: string | null;
  onChangePersonalityFilter: (p: string | null) => void;
}

export default function TabInternLunch({
  soloLunchActive,
  onToggleSoloLunch,
  activePersonalityFilter,
  onChangePersonalityFilter
}: TabInternLunchProps) {
  // Custom user profile to mock
  const myUser: Friend = {
    id: 'my-user',
    name: '我 (Intern)',
    avatar: '🐣',
    department: '算法商业化',
    role: 'Intern',
    personality: ['边吃边聊型', '探店型'],
    favoriteRestaurantIds: [],
    statusSignal: true
  };

  // Custom lunch personality selection tags
  const personalitiesList = [
    '速战速决型',
    '边吃边聊型',
    '探店型',
    '养生型',
    '重口型'
  ];

  // Filtering coworkers based on selected personality Tag
  const filteredFriends = MOCK_FRIENDS.filter(f => {
    if (!activePersonalityFilter) return true;
    return f.personality.includes(activePersonalityFilter);
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Header Banner */}
      <div className="bg-[#004098] border-4 border-[#004098] p-5 rounded-3xl shadow-[5px_5px_0px_#004098] text-white relative overflow-hidden">
        {/* Playful background sun shape */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FCA836] rounded-full border-4 border-[#004098] -z-10" />
        
        <h4 className="text-[#FBDF04] font-mono text-[10px] font-black tracking-widest uppercase mb-1.5 flex items-center gap-1.55">
          <span className="animate-pulse w-2 h-2 rounded-full bg-[#FBDF04]" />
          Intern Matchmaking Radar
        </h4>
        <h2 className="text-2xl font-black tracking-tight leading-none mb-2">
          今天有人一起吃饭吗？
        </h2>
        <p className="text-[11px] text-sky-100 font-medium leading-relaxed max-w-[85%]">
          大厂不寂寞，午饭来搭伙。1对1极速约饭，聊聊实习生活 & 下午对齐八卦！
        </p>

        {/* Counter tags */}
        <div className="flex gap-2.5 mt-4">
          <div className="bg-white/10 px-2.5 py-1 rounded-xl border border-white/20 text-[10px] font-bold">
            🟢 在线 Intern: <span className="text-[#FBDF04] font-black font-mono">18人</span>
          </div>
          <div className="bg-white/10 px-2.5 py-1 rounded-xl border border-white/20 text-[10px] font-bold">
            ⚡ 活跃约饭中: <span className="text-[#B8EEF0] font-black font-mono">8对</span>
          </div>
        </div>
      </div>

      {/* 2. Solo Lunch Signal Activator */}
      <div className="bg-white border-4 border-[#004098] p-4 rounded-3xl shadow-[5px_5px_0px_#004098] flex flex-col gap-3">
        <div className="flex justify-between items-center bg-[#B8EEF0]/40 p-3 rounded-2xl border-2 border-[#004098]/20">
          <div>
            <h4 className="text-sm font-black text-[#004098]">🙋 Solo Lunch Signal (求约饭挂牌)</h4>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              开启后，你将标记状态为“今天可组饭”，同事可以直接找你秒约。
            </p>
          </div>
          <button
            onClick={() => onToggleSoloLunch(!soloLunchActive)}
            className="focus:outline-none transition-transform active:scale-95 text-black hover:opacity-90 cursor-pointer"
          >
            {soloLunchActive ? (
              <ToggleRight className="w-12 h-12 text-[#FCA836]" />
            ) : (
              <ToggleLeft className="w-12 h-12 text-gray-300" />
            )}
          </button>
        </div>

        {/* List of Solo hungry coworkers */}
        <div>
          <span className="text-[10px] uppercase font-black text-[#004098] tracking-wider mb-2.5 block">
            📍 此时可以被 1对1 秒约的 Solo 伙伴 ({soloLunchActive ? filteredFriends.length + 1 : filteredFriends.length}人):
          </span>

          <div className="flex flex-col gap-2">
            {/* Display logged in simulated User if active */}
            {soloLunchActive && (
              <div className="flex justify-between items-center p-2.5 bg-[#FBDF04]/20 border-2 border-dashed border-[#004098]/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl w-8 h-8 rounded-full border border-[#004098] bg-white flex items-center justify-center">
                    {myUser.avatar}
                  </span>
                  <div>
                    <div className="text-xs font-black text-[#004098]">
                      {myUser.name} <span className="bg-[#FBDF04] text-[8px] px-1 rounded text-black font-extrabold pb-0.5">ME</span>
                    </div>
                    <div className="text-[9px] text-[#004098]/60 font-bold font-mono">
                      {myUser.department} · {myUser.role}
                    </div>
                  </div>
                </div>
                <span className="bg-[#FCA836] text-[8px] font-black px-2 py-0.5 rounded border border-[#004098] text-black leading-none uppercase">
                  挂牌求约中...
                </span>
              </div>
            )}

            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors border-2 border-[#004098] rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl w-8 h-8 rounded-full border border-[#004098] bg-white flex items-center justify-center">
                    {friend.avatar}
                  </span>
                  <div>
                    <div className="text-xs font-black text-black font-sans">
                      {friend.name}
                    </div>
                    <div className="text-[9px] text-gray-400 font-bold font-mono">
                      {friend.department} · {friend.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {friend.personality.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="bg-white border-2 border-[#004098]/10 text-[8px] text-gray-650 px-1 py-0.2 rounded font-black">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => alert(`🎉 已向【${friend.name}】发送 1对1 约饭邀请：『哈喽！今天中午一起干饭吧，在复兴SOHO大厅碰头！』`)}
                    className="p-1 px-2.5 bg-[#B8EEF0] hover:bg-[#88def0] border-2 border-[#004098] text-[9px] text-[#004098] font-black rounded-lg shadow-[2px_2px_0px_#004098] active:scale-95 cursor-pointer transition-transform"
                  >
                    1-1秒约 ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Lunch Personality match section */}
      <div className="bg-white border-4 border-[#004098] p-5 rounded-3xl shadow-[5px_5px_0px_#004098]">
        <h3 className="text-lg font-black text-black mb-2 flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          Lunch Personality (饭搭子品位匹配)
        </h3>
        <p className="text-[10px] text-gray-500 font-bold mb-3">
          选择一个饭格标签，看看谁和你处于同一条美食频道，点击头像即可秒约！
        </p>

        {/* Dynamic selector list with active pill status */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => onChangePersonalityFilter(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 cursor-pointer transition-all ${
              activePersonalityFilter === null
                ? 'bg-[#004098] text-[#FBDF04] border-[#004098] shadow-[1.5px_1.5px_0px_#FBDF04]'
                : 'bg-slate-100 hover:bg-slate-200 text-gray-800 border-gray-300'
            }`}
          >
            显示全部 ✨
          </button>
          
          {personalitiesList.map((p) => {
            const isActive = activePersonalityFilter === p;
            return (
              <button
                key={p}
                onClick={() => onChangePersonalityFilter(p)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#004098] text-[#FBDF04] border-[#004098] shadow-[1.5px_1.5px_0px_#FBDF04]'
                    : 'bg-slate-100 hover:bg-slate-200 text-gray-800 border-gray-300'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Suggested buddy outcomes matching filters */}
        <div className="p-3 bg-yellow-50/50 border-2 border-[#004098] rounded-2xl">
          <span className="text-[9px] font-black text-[#004098] uppercase tracking-wider block mb-2">
            💡 同频 1对1 约饭伙伴推荐 (点击加入约饭):
          </span>
          <div className="flex flex-wrap gap-2">
            {filteredFriends.map(friend => (
              <div
                key={friend.id}
                className="flex items-center gap-1.5 bg-white border-2 border-[#004098] py-1 px-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_#004098] whitespace-nowrap cursor-pointer hover:scale-103 transition-transform active:scale-97"
                onClick={() => alert(`🎉 已向【${friend.name}】发送悄悄话：『看到咱俩超高合拍度！等会要不要一起去尝鲜呀？』`)}
              >
                <span>{friend.avatar}</span>
                <span>{friend.name}</span>
                <span className="text-[9px] font-bold text-orange-600 font-mono bg-[#FBDF04]/30 px-1 rounded">{(friend.personality.length * 20) + 20}% 绝配</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
