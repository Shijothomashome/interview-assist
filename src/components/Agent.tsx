"use client";

import Image from "next/image";
import { Phone, PhoneOff, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
enum MessageTypeEnum {
  TRANSCRIPT = "transcript",
  FUNCTION_CALL = "function-call",
  FUNCTION_CALL_RESULT = "function-call-result",
  ADD_MESSAGE = "add-message",
}

enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

enum TranscriptMessageTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}
interface BaseMessage {
  type: MessageTypeEnum;
}
interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;
}

interface FunctionCallMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL;
  functionCall: {
    name: string;
    parameters: unknown;
  };
}

interface FunctionCallResultMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL_RESULT;
  functionCallResult: {
    forwardToClientEnabled?: boolean;
    result: unknown;
    [a: string]: unknown;
  };
}
type Message = | TranscriptMessage
  | FunctionCallMessage
  | FunctionCallResultMessage;

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error(error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push("/");
    }
  }, [callStatus, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ASSISTANT_ID!, {
      variableValues: {
        username: userName,
        userid: userId,
      },
    });
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const lastMessage = messages[messages.length - 1]?.content;

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

            {/* Call Status Indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`h-1 w-32 md:w-48 rounded-full ${
                  callStatus === CallStatus.INACTIVE
                    ? "bg-green-500"
                    : callStatus === CallStatus.CONNECTING
                    ? "bg-yellow-500"
                    : callStatus === CallStatus.ACTIVE
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {callStatus === CallStatus.INACTIVE && "Ready to start"}
                {callStatus === CallStatus.CONNECTING && "Connecting..."}
                {callStatus === CallStatus.ACTIVE && "Call in progress"}
                {callStatus === CallStatus.FINISHED && "Call ended"}
              </p>
            </div>

            {/* User Profile */}
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src="/user-avatar.png" alt={userName} />
                <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 font-semibold text-lg">{userName}</h3>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 h-48 flex items-center justify-center">
            {lastMessage ? (
              <p
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {lastMessage}
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                Start the call to begin your interview
              </p>
            )}
          </div>
        </CardContent>

        {/* Call Button */}
        <CardFooter className="flex justify-center p-6 bg-muted/20">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button onClick={handleCall} size="lg" className="px-8 gap-2">
              <Phone className="h-5 w-5" />
              {callStatus === CallStatus.CONNECTING ? ". . ." : "Start Call"}
            </Button>
          ) : (
            <Button
              onClick={handleDisconnect}
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
