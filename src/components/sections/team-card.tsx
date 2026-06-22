import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "@/lib/sanity";
import type { TeamMember } from "@/types";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card className="card-depth-1">
      <CardContent className="p-6">
        {member.photo && (
          <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden border border-border">
            <Image
              src={urlFor(member.photo).width(400).height(533).url()}
              alt={member.name}
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 300px"
              loading="lazy"
            />
          </div>
        )}
        <h3 className="font-heading text-lg font-bold text-ink">
          {member.name}
        </h3>
        <p className="label-uppercase mt-1 mb-3">
          {member.title}
          {member.type === "board" && " — Board"}
        </p>
        {member.bio && (
          <p className="text-sm text-foreground leading-relaxed">{member.bio}</p>
        )}
      </CardContent>
    </Card>
  );
}
