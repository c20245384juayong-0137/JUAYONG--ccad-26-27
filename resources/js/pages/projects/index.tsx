import SearchBar from '@/components/search-bar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { MapPin, Pencil, Plus, Sun, Zap } from 'lucide-react';

interface Project {
    id: number;
    project_name?: string;
    property_owner?: {
        id: number;
        property_owner?: string;
    };
    inverter?: {
        id: number;
        inverter_model?: string;
    };
    installer?: {
        id: number;
        lead_installer?: string;
    };
    grid_status?: {
        id: number;
        grid_status?: string;
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
    filters: {
        search: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Solar Projects',
        href: '/projects',
    },
];

function pageUrl(page: number, search: string): string {
    const params = new URLSearchParams({ page: String(page) });

    if (search) {
        params.set('search', search);
    }

    return `/projects?${params.toString()}`;
}

export default function Projects({ projects, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Solar Projects" />

            <div className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Solar Projects</h1>
                        <p className="text-muted-foreground text-sm">Manage and monitor solar installations.</p>
                    </div>

                    <Link
                        href="/projects/create"
                        className="bg-primary text-primary-foreground flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
                    >
                        <Plus className="size-4" />
                        Add Solar Project
                    </Link>
                </div>

                <SearchBar
                    key={filters.search}
                    action={route('projects.index')}
                    value={filters.search}
                    placeholder="Search projects, owners, installers..."
                />

                <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="bg-card min-w-0 rounded-xl border p-5">
                        <Sun className="mb-3 size-6 text-yellow-500" />
                        <p className="text-muted-foreground text-sm">Total Projects</p>
                        <h2 className="text-3xl font-bold">{projects.total}</h2>
                    </div>

                    <div className="bg-card min-w-0 rounded-xl border p-5">
                        <Zap className="mb-3 size-6 text-green-600" />
                        <p className="text-muted-foreground text-sm">Current Page Capacity</p>
                        <h2 className="text-2xl font-bold break-all sm:text-3xl">
                            {projects.data.reduce((sum, project) => sum + Number(project.total_capacity_kw || 0), 0).toFixed(2)} kW
                        </h2>
                    </div>

                    <div className="bg-card min-w-0 rounded-xl border p-5">
                        <MapPin className="mb-3 size-6 text-blue-600" />
                        <p className="text-muted-foreground text-sm">Displayed Records</p>
                        <h2 className="text-3xl font-bold">{projects.data.length}</h2>
                    </div>
                </div>

                <div className="bg-card min-w-0 overflow-hidden rounded-xl border">
                    <div className="border-b p-5">
                        <h2 className="font-semibold">Registered Solar Installations</h2>
                        <p className="text-muted-foreground text-sm">Your registered solar project records.</p>
                    </div>

                    <div className="space-y-3 p-4 2xl:hidden">
                        {projects.data.map((project) => (
                            <article key={project.id} className="rounded-lg border p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold break-words">{project.project_name || `Project #${project.id}`}</h3>
                                        <p className="text-muted-foreground mt-1 text-xs">Project #{project.id}</p>
                                    </div>
                                    <Link
                                        href={route('projects.edit', project.id)}
                                        className="hover:bg-muted inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
                                        aria-label={`Edit ${project.project_name || `project ${project.id}`}`}
                                    >
                                        <Pencil className="size-4" />
                                        <span className="sr-only sm:not-sr-only">Edit</span>
                                    </Link>
                                </div>

                                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                    <div className="col-span-2 min-w-0">
                                        <dt className="text-muted-foreground text-xs">Property Owner</dt>
                                        <dd className="break-words">{project.property_owner?.property_owner ?? 'Not assigned'}</dd>
                                    </div>
                                    <div className="col-span-2 min-w-0">
                                        <dt className="text-muted-foreground text-xs">Installation Address</dt>
                                        <dd className="break-words">{project.installation_address}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground text-xs">Panels</dt>
                                        <dd>{project.panel_count}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-muted-foreground text-xs">Capacity</dt>
                                        <dd className="break-words">{project.total_capacity_kw} kW</dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">Inverter</dt>
                                        <dd className="break-words">{project.inverter?.inverter_model ?? 'Not assigned'}</dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">Installer</dt>
                                        <dd className="break-words">{project.installer?.lead_installer ?? 'Not assigned'}</dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">Project Cost</dt>
                                        <dd className="break-words">{project.project_cost}</dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground text-xs">Grid Permit</dt>
                                        <dd className="break-all">{project.grid_permit_no || 'Not assigned'}</dd>
                                    </div>
                                    <div className="col-span-2 min-w-0">
                                        <dt className="text-muted-foreground text-xs">Grid Status</dt>
                                        <dd className="break-words">{project.grid_status?.grid_status ?? 'Not assigned'}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))}

                        {projects.data.length === 0 && (
                            <p className="text-muted-foreground rounded-lg border p-8 text-center text-sm">No solar projects registered yet.</p>
                        )}
                    </div>

                    <div className="hidden min-w-0 overflow-x-auto 2xl:block">
                        <table className="w-full min-w-[1100px] text-sm">
                            <thead className="bg-muted/50">
                                <tr className="text-left">
                                    <th className="p-4">Project Name</th>
                                    <th className="p-4">Property Owner</th>
                                    <th className="p-4">Installation Address</th>
                                    <th className="p-4">Panels</th>
                                    <th className="p-4">Capacity</th>
                                    <th className="p-4">Inverter</th>
                                    <th className="p-4">Installer</th>
                                    <th className="p-4">Project Cost</th>
                                    <th className="p-4">Grid Permit</th>
                                    <th className="p-4">Grid Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.data.map((project) => (
                                    <tr key={project.id} className="border-t">
                                        <td className="p-4 font-medium">{project.project_name || `Project #${project.id}`}</td>

                                        <td className="p-4 font-medium">{project.property_owner?.property_owner ?? 'Not assigned'}</td>

                                        <td className="p-4">{project.installation_address}</td>

                                        <td className="p-4">{project.panel_count}</td>

                                        <td className="p-4">{project.total_capacity_kw} kW</td>

                                        <td className="p-4">{project.inverter?.inverter_model ?? 'Not assigned'}</td>

                                        <td className="p-4">{project.installer?.lead_installer ?? 'Not assigned'}</td>

                                        <td className="p-4">{project.project_cost}</td>

                                        <td className="p-4">{project.grid_permit_no || 'Not assigned'}</td>

                                        <td className="p-4">{project.grid_status?.grid_status ?? 'Not assigned'}</td>

                                        <td className="p-4">
                                            <Link
                                                href={route('projects.edit', project.id)}
                                                className="hover:bg-muted inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
                                                aria-label={`Edit ${project.project_name || `project ${project.id}`}`}
                                            >
                                                <Pencil className="size-4" />
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {projects.data.length === 0 && (
                                    <tr>
                                        <td colSpan={11} className="text-muted-foreground p-8 text-center">
                                            No solar projects registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-muted-foreground text-sm">Total: {projects.total} projects</p>

                        <div className="flex flex-wrap gap-2">
                            {projects.current_page > 1 && (
                                <Link href={pageUrl(projects.current_page - 1, filters.search)} className="rounded-md border px-3 py-2 text-sm">
                                    Previous
                                </Link>
                            )}

                            {projects.current_page < projects.last_page && (
                                <Link href={pageUrl(projects.current_page + 1, filters.search)} className="rounded-md border px-3 py-2 text-sm">
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
