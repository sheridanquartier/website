import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1d755b 0%, #0f4939 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            height: 80,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 27,
              height: 48,
              borderRadius: '6px 6px 3px 3px',
              background: 'rgba(255,255,255,0.92)',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: 27,
              height: 80,
              borderRadius: '6px 6px 3px 3px',
              background: '#ffffff',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: 27,
              height: 63,
              borderRadius: '6px 6px 3px 3px',
              background: 'rgba(255,255,255,0.92)',
            }}
          />
        </div>
      </div>
    ),
    size
  )
}
