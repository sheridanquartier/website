import Link from 'next/link'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'

interface ProjectCardProps {
  community: CommunityId
  href: string
  description: string
}

export default function ProjectCard({ community, href, description }: ProjectCardProps) {
  const communityData = COMMUNITIES[community]

  return (
    <Link href={href}>
      <div className="card hover:border-[#0071e3] transition-colors cursor-pointer h-full group">
        <h3 className="text-[24px] font-medium mb-3 text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
          {communityData.name}
        </h3>
        <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-4">
          {description}
        </p>
        <span className="inline-flex items-center text-[#0071e3] text-[14px] font-normal">
          Mehr erfahren →
        </span>
      </div>
    </Link>
  )
}
