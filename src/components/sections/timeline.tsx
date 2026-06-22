interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-8">
        {events.map((event, i) => (
          <div key={i} className="relative pl-12">
            <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-ink border-2 border-background" />
            <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
              {event.year}
            </span>
            <h4 className="font-heading text-lg font-bold text-ink mt-1">
              {event.title}
            </h4>
            <p className="text-sm text-foreground mt-1">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
