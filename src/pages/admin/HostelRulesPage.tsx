import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Clock,
  Users,
  Volume2,
  Flame,
  Cigarette,
  Utensils,
  Wifi,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function HostelRulesPage() {
  const ruleCategories = [
    {
      title: 'General Rules',
      icon: Shield,
      color: 'text-primary',
      rules: [
        {
          text: 'All residents must carry their ID cards at all times within the hostel premises',
          type: 'required',
        },
        {
          text: 'Residents must maintain cleanliness in their rooms and common areas',
          type: 'required',
        },
        {
          text: 'Respect fellow residents and maintain a peaceful environment',
          type: 'required',
        },
        {
          text: 'Report any maintenance issues or damages immediately to the administration',
          type: 'required',
        },
        {
          text: 'Follow all instructions given by hostel staff and security personnel',
          type: 'required',
        },
      ],
    },
    {
      title: 'Timing & Access',
      icon: Clock,
      color: 'text-secondary',
      rules: [
        {
          text: 'Hostel gates open at 6:00 AM and close at 10:00 PM daily',
          type: 'required',
        },
        {
          text: 'Late entry after 10:00 PM requires prior permission from the warden',
          type: 'required',
        },
        {
          text: 'Quiet hours: 10:00 PM to 7:00 AM - maintain silence during these hours',
          type: 'required',
        },
        {
          text: 'Mess timings: Breakfast (7-9 AM), Lunch (12-2 PM), Dinner (7-9 PM)',
          type: 'info',
        },
        {
          text: 'Study room available 24/7 for students',
          type: 'info',
        },
      ],
    },
    {
      title: 'Visitors & Guests',
      icon: Users,
      color: 'text-chart-3',
      rules: [
        {
          text: 'All visitors must register at the reception desk with valid ID',
          type: 'required',
        },
        {
          text: 'Visitors are allowed only in common areas, not in residential rooms',
          type: 'required',
        },
        {
          text: 'Visiting hours: 9:00 AM to 6:00 PM on weekdays, 9:00 AM to 8:00 PM on weekends',
          type: 'required',
        },
        {
          text: 'Overnight guests are strictly prohibited',
          type: 'prohibited',
        },
        {
          text: 'Residents are responsible for their visitors behavior',
          type: 'required',
        },
      ],
    },
    {
      title: 'Noise & Disturbance',
      icon: Volume2,
      color: 'text-chart-4',
      rules: [
        {
          text: 'Playing loud music or creating noise disturbance is prohibited',
          type: 'prohibited',
        },
        {
          text: 'Use headphones for personal entertainment devices',
          type: 'required',
        },
        {
          text: 'No parties or gatherings in rooms without prior permission',
          type: 'prohibited',
        },
        {
          text: 'Common areas must be vacated by 10:00 PM',
          type: 'required',
        },
      ],
    },
    {
      title: 'Safety & Security',
      icon: Flame,
      color: 'text-destructive',
      rules: [
        {
          text: 'Smoking is strictly prohibited inside the hostel building',
          type: 'prohibited',
        },
        {
          text: 'Use of candles, incense sticks, or open flames is not allowed',
          type: 'prohibited',
        },
        {
          text: 'Do not tamper with fire safety equipment or security cameras',
          type: 'prohibited',
        },
        {
          text: 'Keep emergency exits clear at all times',
          type: 'required',
        },
        {
          text: 'Report any suspicious activity to security immediately',
          type: 'required',
        },
        {
          text: 'Electrical appliances must be approved by hostel administration',
          type: 'required',
        },
      ],
    },
    {
      title: 'Prohibited Items',
      icon: XCircle,
      color: 'text-destructive',
      rules: [
        {
          text: 'Alcohol and illegal substances are strictly prohibited',
          type: 'prohibited',
        },
        {
          text: 'Weapons of any kind are not allowed',
          type: 'prohibited',
        },
        {
          text: 'Pets are not permitted in the hostel',
          type: 'prohibited',
        },
        {
          text: 'Cooking equipment (hot plates, electric stoves) in rooms is prohibited',
          type: 'prohibited',
        },
        {
          text: 'Gambling or any illegal activities are strictly forbidden',
          type: 'prohibited',
        },
      ],
    },
    {
      title: 'Room & Property',
      icon: Key,
      color: 'text-primary',
      rules: [
        {
          text: 'Do not modify or damage hostel property',
          type: 'prohibited',
        },
        {
          text: 'Lost keys must be reported immediately - replacement fee applies',
          type: 'required',
        },
        {
          text: 'Room changes require approval from hostel administration',
          type: 'required',
        },
        {
          text: 'Keep rooms locked when not present',
          type: 'required',
        },
        {
          text: 'Residents are liable for damages caused to hostel property',
          type: 'required',
        },
      ],
    },
    {
      title: 'Food & Dining',
      icon: Utensils,
      color: 'text-secondary',
      rules: [
        {
          text: 'Maintain cleanliness in the dining hall',
          type: 'required',
        },
        {
          text: 'Do not waste food - take only what you can consume',
          type: 'required',
        },
        {
          text: 'Return trays and utensils to designated areas',
          type: 'required',
        },
        {
          text: 'Outside food delivery is allowed but must be consumed in designated areas',
          type: 'info',
        },
      ],
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'required':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'prohibited':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'info':
        return <AlertTriangle className="h-4 w-4 text-chart-3" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hostel Rules & Regulations</h1>
          <p className="text-muted-foreground">
            Complete guidelines for hostel residents to ensure a safe and comfortable living
            environment
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Rules</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="conduct">Conduct</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {ruleCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-3">
                        {getIcon(rule.type)}
                        <span className="text-sm flex-1">{rule.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="safety" className="space-y-4 mt-6">
            {ruleCategories
              .filter((cat) =>
                ['Safety & Security', 'Prohibited Items'].includes(cat.title)
              )
              .map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-3">
                          {getIcon(rule.type)}
                          <span className="text-sm flex-1">{rule.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

            <Card className="overflow-hidden">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_09bfbba2-0bce-4cb6-b969-ea20aa2147f9.jpg"
                alt="Fire Safety Equipment"
                className="w-full h-48 object-cover"
              />
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">Emergency Procedures</h3>
                <p className="text-sm text-muted-foreground">
                  In case of fire or emergency, follow evacuation procedures and gather at the
                  designated assembly point. Do not use elevators during emergencies.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conduct" className="space-y-4 mt-6">
            {ruleCategories
              .filter((cat) =>
                ['General Rules', 'Visitors & Guests', 'Noise & Disturbance'].includes(cat.title)
              )
              .map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-3">
                          {getIcon(rule.type)}
                          <span className="text-sm flex-1">{rule.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4 mt-6">
            {ruleCategories
              .filter((cat) =>
                ['Timing & Access', 'Room & Property', 'Food & Dining'].includes(cat.title)
              )
              .map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-3">
                          {getIcon(rule.type)}
                          <span className="text-sm flex-1">{rule.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Disciplinary Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Warning:</strong> First-time minor violations will result in a written
              warning.
            </p>
            <p>
              <strong>Fine:</strong> Repeated violations or property damage will incur fines as per
              hostel policy.
            </p>
            <p>
              <strong>Suspension:</strong> Serious violations may result in temporary suspension
              from hostel facilities.
            </p>
            <p>
              <strong>Expulsion:</strong> Severe violations including violence, illegal activities,
              or repeated serious offenses will result in permanent expulsion.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              <strong>Note:</strong> These rules are subject to change. Residents will be notified
              of any updates. By residing in the hostel, you agree to abide by all rules and
              regulations.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
