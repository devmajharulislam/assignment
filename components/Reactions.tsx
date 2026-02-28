"use client";

import { useState, useEffect, useRef } from "react";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

interface ReactionType {
    typeId: number;
    type: string;
}

const reactionEmojis: Record<string, string> = {
    like: "👍",
    love: "❤️",
    wow: "😮",
    haha: "😂",
    sad: "😢",
};

interface ReactionsProps {
    productId: number;
    initialUserReaction?: { typeId: number; type: { type: string } } | null;
    initialReactions?: any[];
}

export default function Reactions({ productId, initialUserReaction, initialReactions = [] }: ReactionsProps) {
    const [reactionTypes, setReactionTypes] = useState<ReactionType[]>([]);
    const [userReaction, setUserReaction] = useState<number | null>(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [reactionCounts, setReactionCounts] = useState<Record<number, number>>({});
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch reaction types
        async function fetchReactionTypes() {
            try {
                const res = await fetch(`${API}/client/v1/product/reactions/types`, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Tenant": "nextshop",
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setReactionTypes(data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch reaction types:", err);
            }
        }
        fetchReactionTypes();

        // Set initial user reaction
        if (initialUserReaction) {
            const typeId = initialUserReaction.typeId || initialUserReaction.type?.typeId;
            setUserReaction(typeId);
        }

        // Calculate initial reaction counts
        const counts: Record<number, number> = {};
        initialReactions.forEach((reaction: any) => {
            const typeId = reaction.type?.typeId || reaction.reaction_type?.typeId;
            if (typeId) {
                counts[typeId] = (counts[typeId] || 0) + 1;
            }
        });
        setReactionCounts(counts);
    }, [initialUserReaction, initialReactions]);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowReactionPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleReact = async (typeId: number) => {
        try {
            const token = localStorage.getItem("auth_token");

            const res = await fetch(`${API}/client/v1/product/reaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Tenant": "nextshop",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    productId,
                    typeId,
                }),
            });

            if (res.ok) {
                // Toggle or switch reaction
                if (userReaction === typeId) {
                    // Remove reaction
                    setUserReaction(null);
                    setReactionCounts((prev) => ({
                        ...prev,
                        [typeId]: Math.max((prev[typeId] || 0) - 1, 0),
                    }));
                } else {
                    // Switch reaction
                    if (userReaction) {
                        setReactionCounts((prev) => ({
                            ...prev,
                            [userReaction]: Math.max((prev[userReaction] || 0) - 1, 0),
                        }));
                    }
                    setUserReaction(typeId);
                    setReactionCounts((prev) => ({
                        ...prev,
                        [typeId]: (prev[typeId] || 0) + 1,
                    }));
                }
                setShowReactionPicker(false);
            }
        } catch (err) {
            console.error("Reaction failed:", err);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setShowReactionPicker(true);
        }, 500); // Show after 500ms hover
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        // Keep picker open briefly to allow moving mouse to it
        setTimeout(() => {
            if (!isHovering) {
                setShowReactionPicker(false);
            }
        }, 300);
    };

    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
    const userReactionType = reactionTypes.find((r) => r.typeId === userReaction);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reactions</h3>

            <div className="flex items-center gap-4 mb-4">
                {/* Like Button with Hover Picker */}
                <div className="relative" ref={pickerRef}>
                    <button
                        onClick={() => handleReact(1)} // Default to "Like" (typeId: 1)
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                            userReaction
                                ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                        }`}
                    >
                        {userReaction && userReactionType ? (
                            <>
                                <span className="text-2xl">{reactionEmojis[userReactionType.type]}</span>
                                <span className="font-semibold capitalize">{userReactionType.type}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">👍</span>
                                <span className="font-semibold">Like</span>
                            </>
                        )}
                    </button>

                    {/* Reaction Picker - Facebook Style */}
                    {showReactionPicker && (
                        <div
                            className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-2xl border-2 border-gray-200 p-2 flex gap-1 animate-in fade-in zoom-in duration-200"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => {
                                setIsHovering(false);
                                setShowReactionPicker(false);
                            }}
                        >
                            {reactionTypes.map((reaction) => (
                                <button
                                    key={reaction.typeId}
                                    onClick={() => handleReact(reaction.typeId)}
                                    className="relative group"
                                    title={reaction.type}
                                >
                  <span className="text-4xl hover:scale-150 transition-transform duration-200 block">
                    {reactionEmojis[reaction.type]}
                  </span>
                                    {/* Tooltip */}
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {reaction.type.charAt(0).toUpperCase() + reaction.type.slice(1)}
                  </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Total Count */}
                {totalReactions > 0 && (
                    <span className="text-gray-600 font-medium">
            {totalReactions} {totalReactions === 1 ? "reaction" : "reactions"}
          </span>
                )}
            </div>

            {/* Reaction Breakdown */}
            {totalReactions > 0 && (
                <div className="flex flex-wrap gap-2">
                    {reactionTypes.map((reaction) => {
                        const count = reactionCounts[reaction.typeId] || 0;
                        if (count === 0) return null;
                        return (
                            <div
                                key={reaction.typeId}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full"
                            >
                                <span className="text-lg">{reactionEmojis[reaction.type]}</span>
                                <span className="text-sm font-semibold text-gray-700">{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}