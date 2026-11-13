"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const PollVote = ({ options, isVoting, onVote }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${selectedOption === option.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border/50 hover:border-primary/50 bg-background/50"
              }`}
          >
            <span className="font-medium text-lg">{option.text}</span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === option.id ? "border-primary" : "border-muted-foreground/30"
                }`}
            >
              {selectedOption === option.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={() => onVote(selectedOption)}
        disabled={isVoting || !selectedOption}
        className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20"
      >
        {isVoting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Casting Vote...
          </>
        ) : (
          "Submit Vote"
        )}
      </Button>
    </div>
  );
}
export default PollVote;
