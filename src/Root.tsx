import React from 'react';
import { Composition } from 'remotion';
import { JirehDia01 } from './JirehDia01';
import { TOTAL_FRAMES, FPS } from './timing';

export const Root: React.FC = () => (
  <Composition id="JirehDia01" component={JirehDia01} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
);
