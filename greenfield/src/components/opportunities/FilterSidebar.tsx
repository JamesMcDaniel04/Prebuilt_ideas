import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Filters } from "@/lib/types";
import { emptyFilters } from "@/lib/types";
import { VOCAB } from "@/lib/vocab";

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  industries: string[];
};

export default function FilterSidebar({ filters, setFilters, industries }: Props) {
  function toggle(key: keyof Filters, value: string) {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: next });
  }

  const activeCount =
    filters.industries.length +
    filters.audiences.length +
    filters.difficulties.length +
    filters.modelTypes.length +
    filters.capitals.length +
    filters.times.length +
    filters.stacks.length;

  return (
    <aside className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search opportunities…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
      </div>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({ ...emptyFilters, q: filters.q })}
          className="w-full justify-start text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </Button>
      )}

      <Group title="Industry">
        {industries.map((v) => (
          <CheckRow key={v} label={v} checked={filters.industries.includes(v)} onChange={() => toggle("industries", v)} />
        ))}
      </Group>

      <Group title="Audience">
        {VOCAB.audience.map((v) => (
          <CheckRow key={v} label={v} checked={filters.audiences.includes(v)} onChange={() => toggle("audiences", v)} />
        ))}
      </Group>

      <Group title="Difficulty">
        {VOCAB.difficulty.map((v) => (
          <CheckRow key={v} label={v} checked={filters.difficulties.includes(v)} onChange={() => toggle("difficulties", v)} />
        ))}
      </Group>

      <Group title="Business model">
        {VOCAB.model_type.map((v) => (
          <CheckRow key={v} label={v} checked={filters.modelTypes.includes(v)} onChange={() => toggle("modelTypes", v)} />
        ))}
      </Group>

      <Group title="Starting capital">
        {VOCAB.starting_capital.map((v) => (
          <CheckRow key={v} label={v} checked={filters.capitals.includes(v)} onChange={() => toggle("capitals", v)} />
        ))}
      </Group>

      <Group title="Time to launch">
        {VOCAB.time_to_launch.map((v) => (
          <CheckRow key={v} label={v} checked={filters.times.includes(v)} onChange={() => toggle("times", v)} />
        ))}
      </Group>

      <Group title="Build approach">
        {VOCAB.build_stack_hint.map((v) => (
          <CheckRow key={v} label={v} checked={filters.stacks.includes(v)} onChange={() => toggle("stacks", v)} />
        ))}
      </Group>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  const id = `f-${label.replace(/\s+/g, "-")}`;
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm font-normal cursor-pointer">{label}</Label>
    </div>
  );
}
