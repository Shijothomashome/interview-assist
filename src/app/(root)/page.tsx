"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Star, ArrowRight, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate, getBadgeVariant, upcomingInterviews, userInterviews } from "@/lib/utils"

export default function MinimalCleanDesign() {
  // Mock data for demonstration




  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="space-y-6 md:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight">Get Interview-Ready with AI-Powered Practice</h1>
          <p className="text-xl text-muted-foreground">
            Practice real interview questions & get instant feedback to improve your skills
          </p>
          <Button size="lg" className="gap-2">
            <Link href="/interview" className="flex items-center gap-2">
              Start an Interview <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="md:w-1/2 sm:flex justify-center hidden">
          <Image
            src="/images/ai-image.png"
            alt="AI Interview Assistant"
            width={100}
            height={100}
            className="rounded-lg invert-0 dark:invert"
          />
        </div>
      </div>

      <Separator className="my-12" />

      {/* Your Interviews Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Your Interviews</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {userInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userInterviews.map((interview) => (
              <Card key={interview.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium">{interview.role}</h3>
                    <Badge variant={getBadgeVariant(interview.type) as any}>{interview.type}</Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(interview.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">{interview.feedback?.totalScore}/100</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 line-clamp-2">{interview.feedback?.finalAssessment}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {interview.techstack.map((tech) => (
                        <Badge key={tech} variant="outline" className="bg-muted/50">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <Link href={`/interview/${interview.id}/feedback`}>Check Feedback</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">You haven't taken any interviews yet</p>
            <Button variant="outline" className="mt-4">
              <Link href="/interview">Start Your First Interview</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Take Interviews Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Take Interviews</h2>
          <Button variant="ghost" size="sm" className="gap-1">
            Browse All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {upcomingInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium">{interview.role}</h3>
                    <Badge variant={getBadgeVariant(interview.type) as any}>{interview.type}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(interview.createdAt)}</span>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Practice this interview to improve your skills and get valuable feedback.
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {interview.techstack.map((tech) => (
                        <Badge key={tech} variant="outline" className="bg-muted/50">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm">
                      <Link href={`/interview/${interview.id}`}>View Interview</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">There are no interviews available</p>
            <Button variant="outline" className="mt-4">
              <Link href="/interview">Check Back Later</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

