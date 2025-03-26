"use client";

import Image from "next/image";
import { Phone, PhoneOff, Mic } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
  }
const Agent = ({ userName, profileImage }: { userName: string; profileImage?: string }) => {

    const [callState, setCallState] = useState<CallStatus>(CallStatus.INACTIVE);
  // Placeholder states - you'll implement real functionality later
  const isSpeaking = false;
  const lastMessage = "";

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-center text-2xl">Interview Session</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            {/* AI Interviewer */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarImage src="/ai-avatar.png" alt="AI Interviewer" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                {isSpeaking && (
                  <span className="absolute -right-1 -bottom-1 bg-green-500 p-1 rounded-full">
                    <Mic className="h-4 w-4 text-white animate-pulse" />
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-semibold text-lg">AI Interviewer</h3>
            </div>

            {/* Connection Status */}
            <div className="flex flex-col items-center">
              <div className={`h-1 w-32 md:w-48 rounded-full ${
                callState === CallStatus.INACTIVE
                  ? "bg-green-500" 
                  : callState === CallStatus.CONNECTING 
                    ? "bg-yellow-500" 
                    : "bg-gray-300"
              }`}>
                {callState === CallStatus.CONNECTING && (
                  <div className="h-full w-1/3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {callState === CallStatus.INACTIVE && "Ready to start"}
                {callState === CallStatus.CONNECTING && "Connecting..."}
                {callState === CallStatus.ACTIVE && "Call in progress"}
                {callState === CallStatus.FINISHED && "Call ended"}
              </p>
            </div>

            {/* User */}
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={profileImage || "/user-avatar.png"} alt={userName} />
                <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 font-semibold text-lg">{userName}</h3>
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 h-48 flex items-center justify-center">
            {lastMessage ? (
              <p className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}>
                {lastMessage}
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                Start the call to begin your interview
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6 bg-muted/20">
          {callState !== CallStatus.ACTIVE ? (
            <Button 
              size="lg"
              className="px-8 gap-2"
            >
              <Phone className="h-5 w-5" />
              Start Call
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              size="lg"
              className="px-8 gap-2"
            >
              <PhoneOff className="h-5 w-5" />
              End Call
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Agent;

