import { COMMUNITIES, type CommunityId } from '@/lib/constants'

interface CommunityBadgeProps {
  community: CommunityId
  size?: 'sm' | 'md' | 'lg'
}

const communityStyles = {
  'sheridan-junia': 'bg-[#e8f0fe] text-[#1a56db]',
  'wagnisshare': 'bg-[#fef3e8] text-[#c2410c]',
  'wogenau': 'bg-[#e8f5e9] text-[#166534]'
}

export default function CommunityBadge({ community, size = 'md' }: CommunityBadgeProps) {
  const communityData = COMMUNITIES[community]

  const sizeClasses = {
    sm: 'text-[12px] px-2.5 py-0.5',
    md: 'text-[12px] px-3 py-1',
    lg: 'text-[14px] px-4 py-1.5'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${communityStyles[community]} ${sizeClasses[size]}`}
    >
      {communityData.name}
    </span>
  )
}
