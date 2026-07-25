"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Team member card for the company store Team tab.
 */
export default function TeamMemberCard({ member, className }) {
  if (!member) return null;

  const initial = (member.name?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center gradient-water">
            <Avatar className="size-24 sm:size-28">
              <AvatarFallback className="bg-primary/15 text-3xl font-bold text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/95 via-background/40 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {member.name}
          </h3>
          {member.role ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {member.role}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
