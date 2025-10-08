import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportType, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (reportType) {
      case 'student-performance':
        systemPrompt = 'You are an academic report generator. Create comprehensive student performance reports based on attendance and marks data. Include insights, trends, and recommendations.';
        userPrompt = `Generate a detailed performance report for the following student data:\n\n${JSON.stringify(data, null, 2)}\n\nInclude:\n1. Overall performance summary\n2. Attendance analysis\n3. Subject-wise performance\n4. Areas of improvement\n5. Recommendations`;
        break;

      case 'course-outcome':
        systemPrompt = 'You are an academic report generator specializing in course outcome analysis. Analyze course performance and provide insights for improvement.';
        userPrompt = `Generate a course outcome report based on this data:\n\n${JSON.stringify(data, null, 2)}\n\nInclude:\n1. Overall course performance\n2. Student achievement analysis\n3. Learning outcome assessment\n4. Suggestions for course improvement`;
        break;

      case 'faculty-summary':
        systemPrompt = 'You are an academic report generator creating faculty performance summaries. Analyze teaching effectiveness and student outcomes.';
        userPrompt = `Generate a faculty summary report:\n\n${JSON.stringify(data, null, 2)}\n\nInclude:\n1. Teaching effectiveness\n2. Student performance trends\n3. Course management efficiency\n4. Areas of excellence and improvement`;
        break;

      case 'compliance':
        systemPrompt = 'You are an expert in NAAC/AICTE compliance documentation. Generate professional compliance reports with proper formatting and required metrics.';
        userPrompt = `Generate a compliance report for institutional documentation:\n\n${JSON.stringify(data, null, 2)}\n\nFormat according to NAAC/AICTE standards and include all required metrics and documentation references.`;
        break;

      default:
        systemPrompt = 'You are an academic report generator. Create professional reports based on the provided data.';
        userPrompt = `Generate a report based on this data:\n\n${JSON.stringify(data, null, 2)}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedReport = aiResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ report: generatedReport }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
