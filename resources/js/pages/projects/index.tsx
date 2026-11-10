
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Sun, Zap, MapPin } from 'lucide-react';

interface Project {
    id: number;
    property_owner?: {
        id: number;
        name?: string;
    };
    inverter?: {
        id: number;
        name?: string;
        model?: string;
    };
    installer?: {
        id: number;
        name?: string;
    };
    grid_status?: {
        id: number;
        name?: string;
        status?: string;
    };
    installation_address: string;
    panel_count: number;
    total_capacity_kw: string;
    install_date: string;
    project_cost: string;
    grid_permit_no: string;
}

interface Props {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Solar Projects',
        href: '/projects',
    },
];

export default function Projects({ projects }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Solar Projects" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Solar Projects
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage and monitor solar installations.
                        </p>
                    </div>

                    <Link
                        href="/projects/create"
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        <Plus className="size-4" />
                        Add Solar Project
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                        <Sun className="mb-3 size-6 text-yellow-500" />
                        <p className="text-sm text-muted-foreground">
                            Total Projects
                        </p>
                        <h2 className="text-3xl font-bold">
                            {projects.total}
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <Zap className="mb-3 size-6 text-green-600" />
                        <p className="text-sm text-muted-foreground">
                            Current Page Capacity
                        </p>
                        <h2 className="text-3xl font-bold">
                            {projects.data
                                .reduce(
                                    (sum, project) =>
                                        sum + Number(project.total_capacity_kw || 0),
                                    0
                                )
                                .toFixed(2)} kW
                        </h2>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <MapPin className="mb-3 size-6 text-blue-600" />
                        <p className="text-sm text-muted-foreground">
                            Displayed Records
                        </p>
                        <h2 className="text-3xl font-bold">
                            {projects.data.length}
                        </h2>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b p-5">
                        <h2 className="font-semibold">
                            Registered Solar Installations
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Your registered solar project records.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="text-left">
                                    <th className="p-4">Project ID</th>
                                    <th className="p-4">Installation Address</th>
                                    <th className="p-4">Panels</th>
                                    <th className="p-4">Capacity</th>
                                    <th className="p-4">Installer</th>
                                    <th className="p-4">Grid Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.data.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="border-t"
                                    >
                                        <td className="p-4 font-medium">
                                            #{project.id}
                                        </td>

                                        <td className="p-4">
                                            {project.installation_address}
                                        </td>

                                        <td className="p-4">
                                            {project.panel_count}
                                        </td>

                                        <td className="p-4">
                                            {project.total_capacity_kw} kW
                                        </td>

                                        <td className="p-4">
                                            {project.installer?.name ?? 'Not assigned'}
                                        </td>

                                        <td className="p-4">
                                            {project.grid_status?.name ??
                                                project.grid_status?.status ??
                                                'Not assigned'}
                                        </td>
                                    </tr>
                                ))}

                                {projects.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-8 text-center text-muted-foreground"
                                        >
                                            No solar projects registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t p-4">
                        <p className="text-sm text-muted-foreground">
                            Total: {projects.total} projects
                        </p>

                        <div className="flex gap-2">
                            {projects.current_page > 1 && (
                                <Link
                                    href={`/projects?page=${projects.current_page - 1}`}
                                    className="rounded-md border px-3 py-2 text-sm"
                                >
                                    Previous
                                </Link>
                            )}

                            {projects.current_page < projects.last_page && (
                                <Link
                                    href={`/projects?page=${projects.current_page + 1}`}
                                    className="rounded-md border px-3 py-2 text-sm"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
