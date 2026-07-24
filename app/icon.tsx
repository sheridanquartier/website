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
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background:
            'linear-gradient(180deg, #f8f3ea 0%, #edf3ec 54%, #dde8dc 100%)',
          color: '#1f4d43',
          borderRadius: '120px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: -1.5,
            }}
          >
            Sheridan
          </div>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 9999,
              background: '#c56842',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fffaf4',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            SQ
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -3,
              maxWidth: '78%',
            }}
          >
            Quartier
          </div>
          <div
            style={{
              display: 'flex',
              gap: 12,
              fontSize: 22,
              color: '#627067',
            }}
          >
            <span>Nachbarschaft</span>
            <span>Kalender</span>
            <span>Brett</span>
          </div>
        </div>
      </div>
    ),
    size
  )
}
