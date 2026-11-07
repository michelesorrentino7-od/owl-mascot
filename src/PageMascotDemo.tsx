import React from 'react';
import { Mascot } from 'page-mascot';

export function PageMascotDemo() {
  return (
    <div style={{ minHeight: '100vh', padding: 40, fontFamily: 'system-ui' }}>
      <h1>Owl + page-mascot test</h1>
      <p>Move your cursor — the owl head should track the pointer angle. Click it for a reaction.</p>
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <Mascot
          directions="/owl/mascots/owl-directions.webp"
          reactions="/owl/mascots/owl-reactions.webp"
          size={180}
          label="owl mascot"
        />
      </div>
    </div>
  );
}
