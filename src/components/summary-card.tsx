import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
}

export function SummaryCard({ title, value, icon, trend }: SummaryCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 transition-all-smooth hover:shadow-lg hover:border-blue-500 hover:scale-102">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 transition-all-smooth">{title}</p>
            <p className="text-2xl font-bold text-white mt-1 transition-all-smooth">{value}</p>
            {trend && (
              <p className="text-sm text-green-400 mt-2 transition-all-smooth">{trend}</p>
            )}
          </div>
          <div className="text-3xl transition-transform-smooth hover:scale-105">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}