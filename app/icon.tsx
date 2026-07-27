import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
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
            gap: 24,
            height: 230,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 82,
              height: 142,
              borderRadius: '18px 18px 8px 8px',
              background: 'rgba(255,255,255,0.92)',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: 82,
              height: 230,
              borderRadius: '18px 18px 8px 8px',
              background: '#ffffff',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: 82,
              height: 184,
              borderRadius: '18px 18px 8px 8px',
              background: 'rgba(255,255,255,0.92)',
            }}
          />
        </div>
      </div>
    ),
    size
  )
}
