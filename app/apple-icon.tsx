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
          background: 'linear-gradient(180deg, #f7f4ee 0%, #edf3ec 100%)',
          color: '#1f4d43',
          borderRadius: 42,
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        SQ
      </div>
    ),
    size
  )
}
