import React from 'react';
import { Mascot } from 'page-mascot';

// Note: page-mascot requires 3x3 sprite sheets for directions and reactions.
// The existing owl poses are individual images. To use with page-mascot,
// create aligned sprite sheets from the owl poses (or use the skill to generate).

export function PageMascotDemo() {
  return (
    <div style={{ padding: 40 }}>
      <h1>page-mascot test (needs sprite sheets)</h1>
      <p>To fully test, provide directions and reactions webp sheets.</p>
      {/* 
      <Mascot
        directions="/owl/owl-directions.webp"
        reactions="/owl/owl-reactions.webp"
        size={160}
      />
      */}
    </div>
  );
}
