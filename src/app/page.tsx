"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Sparkles,
    CheckCircle2,
    Circle,
    ChevronRight,
    ChevronDown,
    Battery,
    BatteryMedium,
    Zap,
    Clock,
    Loader2,
} from "lucide-react";

const api = axios.create({ baseURL: "https://automated-to-do-list.onrender.com" });

type EnergyLevel = "low" | "medium" | "high";

export default function TaskDashboard() {
    const queryClient = useQueryClient();
    const [energy, setEnergy] = useState<EnergyLevel>("medium");
    const [goal, setGoal] = useState("");
    const [minsAvailable, setMinsAvailable] = useState(60);
    const [recommendedId, setRecommendedId] = useState<number | string | null>(null);

    const { data: tasksResponse, isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await api.get("/tasks");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (taskTitle: string) => {
            const res = await api.post("/tasks/smart-create", null, {
                params: { title: taskTitle, description: "AI Architecture Breakdown" }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setGoal("");
        },
    });

    const toggleSubtaskMutation = useMutation({
        mutationFn: async ({ taskId, subTaskId }: { taskId: any; subTaskId: any }) => {
            const res = await api.patch(`/tasks/${taskId}/subtasks/${subTaskId}/toggle`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const recommendMutation = useMutation({
        mutationFn: async () => {
            const res = await api.get("/tasks/recommend", {
                params: { energy, mins: minsAvailable }
            });
            return res.data;
        },
        onSuccess: (response) => {
            if (response.data) {
                setRecommendedId(response.data.id);
            }
        }
    });

    const tasks = tasksResponse?.data || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-4 space-y-5">
                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-[#059669]/10 p-2 rounded-lg text-[#10b981]">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-white leading-none">Plan Your Farm Operations</h2>
                            <p className="text-[11px] text-slate-500 mt-1.5">Enter your farm plans</p>
                        </div>
                    </div>

                    <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Vaccination of Pigs..."
                        className="w-full bg-[#1e293b]/30 border border-[#1f2937] rounded-xl px-4 py-3 text-[13px] text-slate-200 min-h-[150px] focus:outline-none focus:border-[#10b981]/50 resize-none transition-colors"
                    />

                    <button
                        onClick={() => createMutation.mutate(goal)}
                        disabled={createMutation.isPending || !goal}
                        className="mt-4 w-full bg-[#10b981] hover:bg-[#059669] text-white py-3.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {createMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        {createMutation.isPending ? "Analyzing..." : "Generate Tasks"}
                    </button>
                </div>

                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 shadow-sm">
                    <h2 className="text-[15px] font-bold text-white mb-6">AI Pick</h2>
                    <div className="grid grid-cols-3 gap-2.5 mb-8">
                        <EnergyBtn active={energy === "low"} label="Low" icon={<Battery size={22} />} onClick={() => setEnergy("low")} />
                        <EnergyBtn active={energy === "medium"} label="Medium" icon={<BatteryMedium size={22} />} onClick={() => setEnergy("medium")} />
                        <EnergyBtn active={energy === "high"} label="High" icon={<Zap size={22} />} onClick={() => setEnergy("high")} />
                    </div>

                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Time Available</span>
                        <span className="text-[11px] font-bold text-[#10b981]">{minsAvailable}m</span>
                    </div>
                    <input
                        type="range" min="5" max="180" step="5"
                        value={minsAvailable}
                        onChange={(e) => setMinsAvailable(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-[#1f2937] rounded-lg appearance-none cursor-pointer accent-[#10b981] mb-8"
                    />

                    <button
                        onClick={() => recommendMutation.mutate()}
                        disabled={recommendMutation.isPending}
                        className="w-full bg-[#1e293b] border border-[#1f2937] hover:border-[#10b981]/50 text-white py-3 rounded-xl text-[12px] font-bold transition-all flex justify-center items-center gap-2"
                    >
                        {recommendMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                        Pick Best Match
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8">
                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-7 min-h-[85vh] shadow-sm relative overflow-hidden">
                    <h2 className="text-[17px] font-bold text-white mb-8">Farm Operations</h2>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-[#10b981]" size={40} />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-[#1f2937] rounded-2xl">
                                <p className="text-slate-500 text-sm italic">Taskboard is empty.</p>
                            </div>
                        ) : (
                            tasks.map((task: any) => (
                                <ProjectItem
                                    key={task.id}
                                    task={task}
                                    isRecommended={recommendedId === task.id}
                                    onToggle={(subId: any) =>
                                        toggleSubtaskMutation.mutate({ taskId: task.id, subTaskId: subId })
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EnergyBtn({ active, label, icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${
                active ? "bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]" : "bg-transparent border-[#1f2937] text-slate-500 hover:border-slate-700"
            }`}
        >
            {icon}
            <span className="text-[10px] font-bold mt-2.5 uppercase tracking-tighter">{label}</span>
        </button>
    );
}

function ProjectItem({ task, isRecommended, onToggle }: { task: any, isRecommended: boolean, onToggle: (id: any) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const subtasks = task.subTasks || task.subtasks || task.taskList || [];

    return (
        <div className={`bg-[#0b1120]/40 border rounded-2xl overflow-hidden transition-all duration-300 ${
            isRecommended ? 'border-[#10b981] ring-2 ring-[#10b981]/10 bg-[#10b981]/5 scale-[1.01]' : 'border-[#1f2937]'
        }`}>
            <div
                className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/[0.01]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="bg-[#1e293b] p-1.5 rounded-lg text-slate-400 shrink-0">
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className={`text-[14px] font-bold truncate transition-colors ${task.completed ? "text-slate-500 line-through" : "text-white"}`}>
                            {task.title}
                        </h3>
                        {isRecommended && (
                            <div className="flex items-center gap-1.5 text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
                                <Sparkles size={10} />
                                <span className="text-[9px] font-black uppercase tracking-widest">AI PICK</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex-1 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#10b981] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                style={{ width: `${task.progress || 0}%` }}
                            />
                        </div>
                        <span className="text-[11px] text-slate-500 font-bold tabular-nums">
                            {task.progress || 0}%
                        </span>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="px-[68px] pb-7 space-y-4 border-t border-[#1f2937]/30 pt-5 bg-black/5 animate-in fade-in slide-in-from-top-2">
                    {subtasks.length > 0 ? (
                        subtasks.map((sub: any) => (
                            <div
                                key={sub.id}
                                className="flex items-center gap-3.5 group cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle(sub.id);
                                }}
                            >
                                {sub.completed ? (
                                    <CheckCircle2 size={18} className="text-[#10b981] shrink-0" />
                                ) : (
                                    <Circle size={18} className="text-[#334155] shrink-0 group-hover:text-[#10b981]/50 transition-colors" />
                                )}
                                <span className={`text-[13px] select-none transition-all ${
                                    sub.completed ? "text-slate-500 line-through font-medium" : "text-slate-300 font-medium group-hover:text-white"
                                }`}>
                                    {sub.title}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center gap-2 text-slate-600 italic py-1">
                            <Clock size={12} />
                            <p className="text-[11px]">Breakdown tasks not available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}