import React from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Clock,
  Users,
  Volume2,
  Flame,
  XCircle,
  Key,
  Utensils,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function StudentHostelRules() {
  const ruleCategories = [
    {
      title: 'General Rules',
      icon: Shield,
      color: 'text-primary',
      rules: [
        'Carry your ID card at all times within hostel premises',
        'Maintain cleanliness in your room and common areas',
        'Respect fellow residents and maintain a peaceful environment',
        'Report maintenance issues or damages immediately',
        'Follow all instructions from hostel staff and security',
      ],
    },
    {
      title: 'Timing & Access',
      icon: Clock,
      color: 'text-secondary',
      rules: [
        'Hostel gates: Open 6:00 AM - Close 10:00 PM',
        'Late entry after 10:00 PM requires prior permission',
        'Quiet hours: 10:00 PM to 7:00 AM',
        'Mess timings: Breakfast (7-9 AM), Lunch (12-2 PM), Dinner (7-9 PM)',
        'Study room available 24/7',
      ],
    },
    {
      title: 'Visitors Policy',
      icon: Users,
      color: 'text-chart-3',
      rules: [
        'All visitors must register at reception with valid ID',
        'Visitors allowed only in common areas',
        'Visiting hours: 9 AM - 6 PM (weekdays), 9 AM - 8 PM (weekends)',
        'Overnight guests are strictly prohibited',
        'You are responsible for your visitors behavior',
      ],
    },
    {
      title: 'Safety Rules',
      icon: Flame,
      color: 'text-destructive',
      rules: [
        'Smoking strictly prohibited inside the building',
        'No candles, incense sticks, or open flames',
        'Do not tamper with fire safety equipment',
        'Keep emergency exits clear',
        'Report suspicious activity to security',
        'Electrical appliances must be approved',
      ],
    },
  ];

  const prohibitedItems = [
    'Alcohol and illegal substances',
    'Weapons of any kind',
    'Pets',
    'Cooking equipment in rooms',
    'Gambling materials',
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hostel Rules & Guidelines</h1>
          <p className="text-muted-foreground">
            Important rules and regulations for a safe and comfortable stay
          </p>
        </div>

        {/* Hero Image */}
        <Card className="overflow-hidden">
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_16ac3aa3-13c0-4a57-aad4-fe35d3780afa.jpg"
            alt="Hostel Rules"
            className="w-full h-64 object-cover"
          />
        </Card>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4 mt-6">
            {ruleCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span className="text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Prohibited Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prohibitedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_842d2df6-a700-4ea0-ac60-b46ef3fcb6eb.jpg"
                  alt="Common Area"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Common Lounge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Relax and socialize with fellow residents in our comfortable common area.
                    Available daily until 10:00 PM.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_629fc6d9-17af-46f9-a89e-7e90e40e94eb.jpg"
                  alt="Study Room"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Study Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Quiet study space available 24/7 with high-speed WiFi and comfortable seating.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_14eadc43-64d6-4f96-8f88-bc8360bee59a.jpg"
                  alt="Dining Hall"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Dining Hall</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nutritious meals served three times daily. Breakfast (7-9 AM), Lunch (12-2 PM),
                    Dinner (7-9 PM).
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_bf8a7d7a-907f-4c1b-9253-e5cb772d6f5b.jpg"
                  alt="Gym"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Fitness Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Well-equipped gym available for residents. Open 6:00 AM - 9:00 PM daily.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_0f9b6c63-44d1-40d9-83a4-bfafd6212373.jpg"
                  alt="Laundry"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Laundry Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Self-service laundry with washers and dryers. Available 7:00 AM - 10:00 PM.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_b5f06880-5945-46ce-a116-aac9b6ae9cac.jpg"
                  alt="Outdoor Area"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Recreation Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Outdoor space for sports and recreation. Perfect for relaxation and exercise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4 mt-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Flame className="h-5 w-5" />
                  Fire Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_09bfbba2-0bce-4cb6-b969-ea20aa2147f9.jpg"
                  alt="Fire Safety"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Familiarize yourself with fire exits and evacuation routes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Do not block fire exits or tamper with fire safety equipment
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-sm">
                      In case of fire alarm, evacuate immediately via nearest exit
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Gather at the designated assembly point outside the building
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-sm">Do not use elevators during fire emergencies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_892b012b-eac9-4f3b-a755-e9d4f463fb7a.jpg"
                  alt="Security"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm">24/7 security personnel on duty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm">CCTV surveillance in common areas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm">Secure entry system with ID verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm">Emergency contact numbers displayed prominently</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Hostel Warden:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Security Office:</strong> +1 (555) 123-4568
                  </p>
                  <p>
                    <strong>Medical Emergency:</strong> 911
                  </p>
                  <p>
                    <strong>Maintenance:</strong> +1 (555) 123-4569
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Disciplinary Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Warning:</strong> First-time minor violations result in a written warning.
            </p>
            <p>
              <strong>Fine:</strong> Repeated violations or property damage incur fines.
            </p>
            <p>
              <strong>Suspension:</strong> Serious violations may result in temporary suspension.
            </p>
            <p>
              <strong>Expulsion:</strong> Severe violations lead to permanent expulsion.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
