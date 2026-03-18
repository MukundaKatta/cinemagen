import { NextRequest, NextResponse } from 'next/server';
import { buildPromptText, buildNegativePrompt, buildApiPayload } from '@/lib/prompt-builder';
import type { CinematicPrompt } from '@/types/cinema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: CinematicPrompt = body.prompt;
    const payload = buildApiPayload(prompt);

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: process.env.VIDEO_MODEL_VERSION || 'default',
        input: {
          prompt: payload.prompt,
          negative_prompt: payload.negative_prompt,
          num_frames: Math.round(prompt.duration * 8),
          fps: 8,
          guidance_scale: 17.5,
          num_inference_steps: 50,
          width: 1024,
          height: 576,
          seed: prompt.seed || undefined,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      status: 'queued',
      progress: 0,
      videoUrl: null,
      thumbnailUrl: null,
      estimatedTime: 120,
    });
  } catch (error) {
    console.error('CinemaGen generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
