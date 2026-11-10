
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Folder,
    LayoutGrid,
    ClipboardList,
    Activity,
    ArrowUpRight,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const stats = [
    {
        title: 'Total Projects',
        value: '24',
        description: 'Projects registered',
        icon: Folder,
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
        title: 'Grid Status',
        value: '18',
        description: 'Active grid records',
        icon: LayoutGrid,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-950',
    },
    {
        title: 'Pending Tasks',
        value: '06',
        description: 'Tasks awaiting action',
        icon: ClipboardList,
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-950',
    },
    {
        title: 'System Activity',
        value: '98%',
        description: 'System performance',
        icon: Activity,
        color: 'text-purple-600',
        bg: 'bg-purple-100 dark:bg-purple-950',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">

                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Welcome! Here's an overview of your system.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                                        <Icon className={`size-5 ${stat.color}`} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-3xl font-bold">
                                        {stat.value}
                                    </h2>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Recent Projects */}
                    <div className="rounded-xl border bg-card p-5 lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">
                                    Recent Projects
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Overview of your latest projects
                                </p>
                            </div>

                            <a
                                href="/projects"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                View all
                                <ArrowUpRight className="size-4" />
                            </a>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Project Alpha', status: 'Active', color: 'bg-green-500' },
                                { name: 'Project Beta', status: 'Pending', color: 'bg-orange-500' },
                                { name: 'Project Gamma', status: 'Completed', color: 'bg-blue-500' },
                            ].map((project) => (
                                <div
                                    key={project.name}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-muted p-2">
                                            <Folder className="size-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {project.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Project overview
                                            </p>
                                        </div>
                                    </div>

                                    <span className="flex items-center gap-2 text-xs">
                                        <span className={`size-2 rounded-full ${project.color}`} />
                                        {project.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grid Status */}
                    <div className="rounded-xl border bg-card p-5">
                        <h2 className="font-semibold">
                            Grid Status
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Current grid overview
                        </p>

                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Operational</span>
                                    <span className="font-semibold">75%</span>
                                </div>

                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 w-3/4 rounded-full bg-green-500" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Under Maintenance</span>
                                    <span className="font-semibold">15%</span>
                                </div>

                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 w-[15%] rounded-full bg-orange-500" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Inactive</span>
                                    <span className="font-semibold">10%</span>
                                </div>

                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 w-[10%] rounded-full bg-red-500" />
                                </div>
                            </div>
                        </div>

                        <a
                            href="/grid-status"
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
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
