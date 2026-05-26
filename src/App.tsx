/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SwipeStage from './components/SwipeStage';
import TasteMap from './components/TasteMap';
import TabLunchBuddy from './components/TabLunchBuddy';
import TabInternLunch from './components/TabInternLunch';
import { Restaurant, ReactionType, UserStatus } from './types';
import { MOCK_RESTAURANTS } from './restaurantsData';
import { Map, Users, Utensils, MessageSquareHeart, Sparkles, Smile, RefreshCw, Compass } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState<'swipe' | 'app'>('swipe');
  const [userReactions, setUserReactions] = useState<Record<string, ReactionType>>({});
  const [activeTab, setActiveTab] = useState<'lunch_buddy' | 'intern'>('lunch_buddy');
  const [userStatus, setUserStatus] = useState<UserStatus>('clear');
  const [soloLunchActive, setSoloLunchActive] = useState(true);
  const [activePersonalityFilter, setActivePersonalityFilter] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  const handleFinishSwipe = (finalReactions: Record<string, ReactionType>) => {
    setUserReactions(finalReactions);
    setStage('app');
  };

  const handleRestart = () => {
    setUserReactions({});
    setStage('swipe');
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#B8EEF0] text-[#004098] antialiased py-4 px-2 flex justify-center">
      {/* Simulation Box for Mobile H5 layout inside Desktop frame */}
      <div className="w-full max-w-md bg-white border-4 border-[#004098] rounded-[32px] shadow-[12px_12px_0px_#004098] overflow-hidden flex flex-col min-h-[820px] relative">
        
        {/* Dynamic H5 App Top StatusBar Simulator */}
        <div className="bg-[#004098] text-[10px] text-[#FBDF04] font-mono px-6 py-2.5 flex justify-between items-center tracking-tighter shrink-0 select-none border-b-4 border-[#004098] z-40">
          <span className="font-black flex items-center gap-1">
             📶 饭搭子 H5 PRO V1.0
          </span>
          <span className="font-extrabold">复兴SOHO 办公区 5G</span>
          <span className="font-black">12:00 PM</span>
        </div>

        {/* Dynamic Scene router layout using simple logic */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-10 scrollbar-none">
          <AnimatePresence mode="wait">
            {stage === 'swipe' ? (
              <motion.div
                key="swipe-stage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <SwipeStage
                  restaurants={MOCK_RESTAURANTS}
                  onFinish={handleFinishSwipe}
                />
              </motion.div>
            ) : (
              <motion.div
                key="app-tab-stage"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Visual Header containing Logo & Refresh bypass button */}
                <div className="flex justify-between items-center border-b-4 border-[#004098] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl filter rotate-6 bg-[#FBDF04] p-1.5 rounded-xl border-2 border-[#004098] block select-none">
                      🍱
                    </span>
                    <div>
                      <h1 className="text-xl font-black text-[#004098] tracking-tight flex items-center gap-1 leading-none">
                        饭搭子 <span className="text-[10px] font-mono font-bold tracking-widest text-[#004098] border border-[#004098] px-1 rounded-md ml-1 bg-[#B8EEF0]">H5</span>
                      </h1>
                      <p className="text-[9px] text-[#004098]/80 font-bold mt-1">Lunch Buddy · 复兴SOHO周边1km同好社</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRestart}
                    className="p-2 border-2 border-[#004098] rounded-xl bg-white hover:bg-rose-50 shadow-[2px_2px_0px_#004098] active:scale-95 transition-all text-xs font-black flex items-center gap-1 text-[#004098]"
                    title="重置口味标定重新构建"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                    重测 🧭
                  </button>
                </div>

                {/* 🗺️ Taste Map Collapse Panel Switch */}
                <div className="bg-white border-4 border-[#004098] p-3.5 rounded-3xl shadow-[5px_5px_0px_#004098]">
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="w-full flex justify-between items-center font-black text-xs text-[#004098] focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#FCA836] animate-spin" style={{ animationDuration: '8s' }} />
                      🗺️ 我的 1KM 口味地图 (Taste Map)
                    </span>
                    <span className="bg-[#B8EEF0] border-2 border-[#004098] px-2 py-0.5 rounded-lg text-[9px] text-[#004098] font-black">
                      {showMap ? '点击折叠 ⬆️' : '点击展开 🗺️'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showMap && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden mt-3 pt-2.5 border-t-2 border-dashed border-[#004098]/20"
                      >
                        <TasteMap
                          restaurants={MOCK_RESTAURANTS}
                          reactions={userReactions}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Compact, level tabs positioned underneath the Taste Map, ensuring decision occurs early */}
                <div className="flex justify-center w-full my-1">
                  <div className="bg-white border-3 border-[#004098] p-1 rounded-2xl flex shadow-[3px_3.5px_0px_#004098] max-w-[290px] w-full select-none">
                    <button
                      onClick={() => setActiveTab('lunch_buddy')}
                      className={`flex-1 py-1.5 px-2.5 text-[11.5px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'lunch_buddy'
                          ? 'bg-[#004098] text-white shadow-[1px_1.5px_0px_rgba(0,0,0,0.15)]'
                          : 'text-[#004098]/70 hover:text-[#004098] hover:bg-slate-50'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>我的好饭搭子</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('intern')}
                      className={`flex-1 py-1.5 px-2.5 text-[11.5px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'intern'
                          ? 'bg-[#004098] text-white shadow-[1px_1.5px_0px_rgba(0,0,0,0.15)]'
                          : 'text-[#004098]/70 hover:text-[#004098] hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>intern拼桌</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Switch View for the Tabs */}
                <div>
                  {activeTab === 'lunch_buddy' ? (
                    <TabLunchBuddy
                      reactions={userReactions}
                      userStatus={userStatus}
                      onChangeStatus={setUserStatus}
                      onSelectRestaurant={(rest) => {
                        // Expand the map to show selected rest
                        setShowMap(true);
                        // Trigger scroll to app root to see map
                        const mapElem = document.getElementById(`map-dot-${rest.id}`);
                        if (mapElem) {
                          mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          mapElem.click();
                        }
                      }}
                    />
                  ) : (
                    <TabInternLunch
                      soloLunchActive={soloLunchActive}
                      onToggleSoloLunch={setSoloLunchActive}
                      activePersonalityFilter={activePersonalityFilter}
                      onChangePersonalityFilter={setActivePersonalityFilter}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
