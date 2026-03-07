import React, { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { getActiveHostelRules } from '@/db/api';
import type { HostelRule } from '@/types';

export default function StudentRulesPage() {
  const [rules, setRules] = useState<HostelRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const data = await getActiveHostelRules();
      setRules(data);
    } catch (error) {
      console.error('Failed to load rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'required':
        return <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />;
      case 'prohibited':
        return <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />;
      case 'info':
        return <AlertTriangle className="h-4 w-4 text-chart-3 shrink-0 mt-0.5" />;
      default:
        return <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />;
    }
  };

  // Group rules by category
  const rulesByCategory = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, HostelRule[]>);

  const categories = Object.keys(rulesByCategory);

  // Categorize for tabs
  const safetyCategories = ['Safety & Security', 'Prohibited Items'];
  const conductCategories = ['General Rules', 'Visitors & Guests', 'Noise & Disturbance'];
  const facilitiesCategories = ['Timing & Access', 'Room & Property', 'Food & Dining'];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hostel Rules & Guidelines</h1>
            <p className="text-muted-foreground">
              Important rules and regulations for a safe and comfortable stay
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <Card className="overflow-hidden">
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_16ac3aa3-13c0-4a57-aad4-fe35d3780afa.jpg"
            alt="Hostel Rules"
            className="w-full h-64 object-cover"
          />
        </Card>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Rules</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="conduct">Conduct</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {categories.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No rules available at the moment
                  </CardContent>
                </Card>
              ) : (
                categories.map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {rulesByCategory[category].map((rule) => (
                          <li key={rule.id} className="flex items-start gap-3">
                            {getRuleIcon(rule.rule_type)}
                            <div className="flex-1">
                              <div className="font-medium">{rule.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="safety" className="space-y-4 mt-6">
              {safetyCategories
                .filter((cat) => rulesByCategory[cat])
                .map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {rulesByCategory[category].map((rule) => (
                          <li key={rule.id} className="flex items-start gap-3">
                            {getRuleIcon(rule.rule_type)}
                            <div className="flex-1">
                              <div className="font-medium">{rule.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
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
              {conductCategories
                .filter((cat) => rulesByCategory[cat])
                .map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {rulesByCategory[category].map((rule) => (
                          <li key={rule.id} className="flex items-start gap-3">
                            {getRuleIcon(rule.rule_type)}
                            <div className="flex-1">
                              <div className="font-medium">{rule.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="facilities" className="space-y-4 mt-6">
              {facilitiesCategories
                .filter((cat) => rulesByCategory[cat])
                .map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {rulesByCategory[category].map((rule) => (
                          <li key={rule.id} className="flex items-start gap-3">
                            {getRuleIcon(rule.rule_type)}
                            <div className="flex-1">
                              <div className="font-medium">{rule.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="overflow-hidden">
                  <img
                    src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_842d2df6-a700-4ea0-ac60-b46ef3fcb6eb.jpg"
                    alt="Common Area"
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-base">Common Lounge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Relax and socialize with fellow residents in our comfortable common area.
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
                    <CardTitle className="text-base">Dining Hall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Nutritious meals served three times daily with varied menu options.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

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
    </StudentLayout>
  );
}
