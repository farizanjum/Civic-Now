
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LegislationCard from "@/components/legislation/LegislationCard";
import VotingPoll from "@/components/voting/VotingPoll";
import { ArrowRight, FileText, PieChart, MessageCircle, Users, Vote, MapPin } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-civic-blue to-civic-blue-dark text-white py-16 md:py-24">
        <div className="civic-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Empowering Local Democracy for Everyone
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Connect with your local government, stay informed about neighborhood issues, and make your voice heard in the decisions that affect your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-civic-blue hover:bg-gray-100 font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md relative z-10">
                  <div className="space-y-6">
                    <div className="bg-white/20 h-10 rounded-md animate-pulse-slow"></div>
                    <div className="bg-white/20 h-4 rounded-md w-3/4 animate-pulse-slow"></div>
                    <div className="bg-white/20 h-4 rounded-md animate-pulse-slow"></div>
                    <div className="bg-white/20 h-4 rounded-md w-5/6 animate-pulse-slow"></div>
                    <div className="bg-white/20 h-4 rounded-md w-4/5 animate-pulse-slow"></div>
                    <div className="bg-white/20 h-10 rounded-md w-2/3 animate-pulse-slow"></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-civic-green/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="civic-container">
          <h2 className="section-title text-center">How CivicNow Helps</h2>
          <p className="section-subtitle text-center max-w-3xl mx-auto mb-12">
            Our platform bridges the gap between citizens and local government with powerful tools for engagement and transparency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-civic-blue" />
                </div>
                <CardTitle>Clear Legislation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get plain language summaries of local legislation and understand how it affects your neighborhood.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-civic-green" />
                </div>
                <CardTitle>Direct Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your thoughts directly with representatives and track responses to your feedback.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Community Voting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Participate in polls on local issues and see how your neighbors are voting on community matters.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Impact Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See how policies and decisions affect different neighborhoods and community segments.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Neighborhood Initiatives</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and join local initiatives to work with neighbors on community projects and improvements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Budget Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload and track community spending with our OCR technology to ensure transparency in local budgets.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legislation Preview */}
      <section className="py-16 bg-civic-gray-light">
        <div className="civic-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title mb-0">Recent Legislation</h2>
            <Link to="/legislation" className="flex items-center text-civic-blue hover:underline font-medium">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LegislationCard 
              id="leg-001"
              title="Green Space Development Plan"
              summary="A proposal to increase public parks and green spaces in residential neighborhoods by 15% over the next three years."
              status="in_review"
              date="April 5, 2023"
              category="Environment"
              neighborhoods={["Downtown", "Riverside"]}
              commentCount={24}
            />

            <LegislationCard 
              id="leg-002"
              title="Public Transit Expansion"
              summary="Extension of bus routes to underserved neighborhoods and increased frequency during peak hours."
              status="proposed"
              date="April 2, 2023"
              category="Transportation"
              neighborhoods={["Northside", "Westend", "Downtown"]}
              commentCount={42}
            />
          </div>
        </div>
      </section>

      {/* Community Voting Preview */}
      <section className="py-16 bg-white">
        <div className="civic-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title mb-0">Active Polls</h2>
            <Link to="/voting" className="flex items-center text-civic-blue hover:underline font-medium">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VotingPoll
              id="poll-001"
              title="New Community Center Location"
              description="Where should the new community center be built? This facility will include meeting spaces, recreational areas, and public services."
              endDate="May 15, 2023"
              category="Infrastructure"
              supportCount={156}
              opposeCount={43}
              neutralCount={27}
            />

            <VotingPoll
              id="poll-002"
              title="Weekend Farmers Market Proposal"
              description="Should we establish a weekly farmers market in the central plaza on weekends to promote local businesses and fresh produce?"
              endDate="May 10, 2023"
              category="Economic Development"
              supportCount={203}
              opposeCount={18}
              neutralCount={12}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-civic-blue text-white">
        <div className="civic-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of citizens who are actively participating in their local democracy through CivicNow.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-civic-blue hover:bg-gray-100 font-semibold">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
