import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Folder, Unplug, Zap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Project {
    id: number;
    project_name: string;
    grid_status?: { grid_status?: string } | null;
}

interface Props {
    statusCounts: {
        total: number;
        connected: number;
        pending: number;
        disconnected: number;
    };
    recentProjects: Project[];
}

const statusStyles = {
    connected: { label: 'Connected', icon: Zap, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-950', bar: 'bg-green-500' },
    pending: {
        label: 'Pending Connection',
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-950',
        bar: 'bg-orange-500',
    },
    disconnected: { label: 'Disconnected', icon: Unplug, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-950', bar: 'bg-red-500' },
};

function getStatusStyle(status: string) {
    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === 'connected') return statusStyles.connected;
    if (normalizedStatus === 'pending') return statusStyles.pending;
    if (normalizedStatus === 'disconnected') return statusStyles.disconnected;

    return { label: status || 'No status', color: 'text-muted-foreground', bar: 'bg-muted-foreground' };
}

export default function Dashboard({ statusCounts, recentProjects }: Props) {
    const stats = [
        {
            title: 'Total Projects',
            value: statusCounts.total,
            description: 'Projects registered',
            icon: Folder,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-950',
        },
        ...(['connected', 'pending', 'disconnected'] as const).map((status) => ({
            title: statusStyles[status].label,
            value: statusCounts[status],
            description: 'Projects',
            icon: statusStyles[status].icon,
            color: statusStyles[status].color,
            bg: statusStyles[status].bg,
        })),
    ];

    const gridStatuses = (['connected', 'pending', 'disconnected'] as const).map((status) => ({
        ...statusStyles[status],
        count: statusCounts[status],
        percent: statusCounts.total === 0 ? 0 : Math.round((statusCounts[status] / statusCounts.total) * 100),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome! Here's an overview of your system.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div key={stat.title} className="bg-card rounded-xl border p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>

                                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                                        <Icon className={`size-5 ${stat.color}`} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-3xl font-bold">{stat.value}</h2>

                                    <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Projects */}
                    <div className="bg-card rounded-xl border p-5 lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">Recent Projects</h2>
                                <p className="text-muted-foreground text-sm">Overview of your latest projects</p>
                            </div>

                            <a href="/projects" className="text-primary flex items-center gap-1 text-sm hover:underline">
                                View all
                                <ArrowUpRight className="size-4" />
                            </a>
                        </div>

                        <div className="space-y-4">
                            {recentProjects.map((project) => {
                                const status = project.grid_status?.grid_status ?? '';
                                const style = getStatusStyle(status);

                                return (
                                    <div key={project.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-muted rounded-lg p-2">
                                                <Folder className="size-5" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium">{project.project_name}</p>
                                                <p className="text-muted-foreground text-xs">Project #{project.id}</p>
                                            </div>
                                        </div>

                                        <span className={`flex items-center gap-2 text-xs ${style.color}`}>
                                            <span className={`size-2 rounded-full ${style.bar}`} />
                                            {style.label}
                                        </span>
                                    </div>
                                );
                            })}
                            {recentProjects.length === 0 && (
                                <p className="text-muted-foreground rounded-lg border p-6 text-center text-sm">No projects registered yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Grid Status */}
                    <div className="bg-card rounded-xl border p-5">
                        <h2 className="font-semibold">Grid Status</h2>

                        <p className="text-muted-foreground mt-1 text-sm">Current grid overview</p>

                        <div className="mt-6 space-y-5">
                            {gridStatuses.map((status) => (
                                <div key={status.label}>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>{status.label}</span>
                                        <span className="font-semibold">
                                            {status.count} ({status.percent}%)
                                        </span>
                                    </div>

                                    <div className="bg-muted h-2 rounded-full">
                                        <div className={`h-2 rounded-full ${status.bar}`} style={{ width: `${status.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/grid-status"
                            className="bg-primary text-primary-foreground mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90"
                        >
                            View Grid Status
                            <ArrowUpRight className="size-4" />
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
