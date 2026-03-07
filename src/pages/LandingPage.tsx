import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  Shield,
  Users,
  Wifi,
  Utensils,
  Dumbbell,
  BookOpen,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Building2,
      title: 'Modern Infrastructure',
      description: 'State-of-the-art facilities with comfortable living spaces',
    },
    {
      icon: Shield,
      title: '24/7 Security',
      description: 'Round-the-clock security with CCTV surveillance',
    },
    {
      icon: Wifi,
      title: 'High-Speed WiFi',
      description: 'Free high-speed internet access throughout the hostel',
    },
    {
      icon: Utensils,
      title: 'Nutritious Meals',
      description: 'Three meals daily with varied menu options',
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description: 'Well-equipped gym for your fitness needs',
    },
    {
      icon: BookOpen,
      title: 'Study Rooms',
      description: 'Quiet study spaces available 24/7',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_1fc4602b-37ef-4092-877d-92363b175e18.jpg"
          alt="Hostel Building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/50" />
        <div className="relative container h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to Our Hostel Management System
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience comfortable living with modern amenities, secure environment, and excellent
              facilities designed for student success.
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button size="lg" asChild>
                  <span>Get Started</span>
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" asChild>
                  <span>Learn More</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Facilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide world-class amenities to ensure a comfortable and productive stay for all
              our residents
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="transition-smooth hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Our Hostel</h2>
            <p className="text-muted-foreground">Take a virtual tour of our facilities</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4b2b929b-7571-4ee6-acf2-b74a6263bd25.jpg"
                  alt="Dormitory Room"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">Comfortable Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clean and spacious rooms with all essential amenities
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_842d2df6-a700-4ea0-ac60-b46ef3fcb6eb.jpg"
                  alt="Common Area"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">Common Lounge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Relax and socialize in our comfortable common areas
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_629fc6d9-17af-46f9-a89e-7e90e40e94eb.jpg"
                  alt="Study Room"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">Study Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quiet study rooms available 24/7 for focused learning
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_14eadc43-64d6-4f96-8f88-bc8360bee59a.jpg"
                  alt="Dining Hall"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">Dining Hall</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nutritious meals served three times daily
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_bf8a7d7a-907f-4c1b-9253-e5cb772d6f5b.jpg"
                  alt="Gym"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">Fitness Center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modern gym equipment for your fitness goals
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_b5f06880-5945-46ce-a116-aac9b6ae9cac.jpg"
                  alt="Recreation Area"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">Outdoor Recreation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Outdoor spaces for sports and relaxation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Our Hostel?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Prime Location</h3>
                    <p className="text-muted-foreground">
                      Conveniently located near educational institutions and public transport
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Affordable Pricing</h3>
                    <p className="text-muted-foreground">
                      Competitive rates with flexible payment options
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">24/7 Support</h3>
                    <p className="text-muted-foreground">
                      Dedicated staff available round-the-clock for assistance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Safe Environment</h3>
                    <p className="text-muted-foreground">
                      Advanced security systems ensuring resident safety
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_43b799b2-9038-462e-94f1-ec23e7518ea8.jpg"
                alt="Reception"
                className="w-full h-64 object-cover rounded-lg"
              />
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_892b012b-eac9-4f3b-a755-e9d4f463fb7a.jpg"
                alt="Security"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Experience comfortable living with modern amenities. Login to access your account or
                contact us for more information.
              </p>
              <Link to="/login">
                <Button size="lg" variant="secondary" asChild>
                  <span>Login Now</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Hostel Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
