interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}
