import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Shield, Users, BarChart3, CheckCircle, Brain, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            "It's so incredible to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              finally be understood.
            </span>
            "
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Only 15 minutes to get a "freakishly accurate" description of who you are and why you do things the way you do.
          </p>
          
          <Link 
            to="/assessment-mode"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Brain className="mr-2 h-5 w-5" />
            Take the Assessment
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">
            Free • No registration required • 15 minutes
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2.5M+</div>
              <div className="text-gray-600">Assessments Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">98.7%</div>
              <div className="text-gray-600">Accuracy Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">120</div>
              <div className="text-gray-600">Scientific Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">30</div>
              <div className="text-gray-600">Personality Facets</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PersonalityPro Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PersonalityPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced assessment platform combines scientific rigor with modern technology to deliver insights that truly matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI-Powered Analysis */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600">
                Advanced algorithms analyze your responses to provide deep personality insights.
              </p>
            </div>

            {/* Visual Reports */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Visual Reports
              </h3>
              <p className="text-gray-600">
                Beautiful radar charts and interactive dashboards to visualize your results.
              </p>
            </div>

            {/* Privacy First */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Privacy First
              </h3>
              <p className="text-gray-600">
                Your data is encrypted and secure. We never share personal information.
              </p>
            </div>

            {/* Team Insights */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Team Insights
              </h3>
              <p className="text-gray-600">
                Understand team dynamics and improve collaboration with group assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unlock Your True Potential Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Unlock Your True Potential
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our comprehensive personality assessment goes beyond surface-level traits to reveal the deeper patterns that drive your behavior and decisions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Discover your unique strengths and growth areas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Improve relationships and communication skills</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Make better career and life decisions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Unlock your full potential with personalized insights</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 mx-auto">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Your Personality Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Openness</span>
                    <span className="text-gray-900 font-semibold">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Conscientiousness</span>
                    <span className="text-gray-900 font-semibold">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '68%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Extraversion</span>
                    <span className="text-gray-900 font-semibold">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '76%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Agreeableness</span>
                    <span className="text-gray-900 font-semibold">84%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '84%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Neuroticism</span>
                    <span className="text-gray-900 font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who've discovered their true potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "This assessment gave me incredible insights into my work style. The results were spot-on and helped me understand my team better."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">SC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-sm text-gray-500">Product Manager at TechCorp</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "The most accurate personality test I've ever taken. The detailed report helped me identify areas for personal growth."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">MJ</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Marcus Johnson</div>
                  <div className="text-sm text-gray-500">Team Lead at InnovateLab</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "We use this for all our team building sessions. The insights have transformed how we work together."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">ER</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Elena Rodriguez</div>
                  <div className="text-sm text-gray-500">HR Director at GlobalTech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Discover Your True Self?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions who've unlocked their potential with PersonalityPro
          </p>
          <Link 
            to="/assessment-mode"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            <Brain className="mr-2 h-5 w-5" />
            Take the Assessment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

