import SearchBar from '@/components/search-bar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, LoaderCircle, Save, Unplug, Zap } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grid Status',
        href: '/grid-status',
    },
];

interface Project {
    id: number;
    project_name: string;
    property_owner?: { property_owner?: string } | null;
    installer?: { lead_installer?: string } | null;
    grid_status?: { grid_status?: string } | null;
}

interface Props {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        total: number;
    };
    statusCounts: {
        total: number;
        connected: number;
        pending: number;
        disconnected: number;
    };
    filters: {
        search: string;
    };
}

function ProjectStatusRow({ project }: { project: Project }) {
    const { data, setData, patch, processing, errors } = useForm({
        grid_status: project.grid_status?.grid_status ?? '',
    });

    const submit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        patch(route('projects.grid-status.update', project.id), { preserveScroll: true });
    };

    return (
        <tr className="border-t">
            <td className="p-4">
                <div className="font-medium">{project.project_name || `Project #${project.id}`}</div>
                <div className="text-muted-foreground text-xs">Project #{project.id}</div>
            </td>
            <td className="p-4">{project.property_owner?.property_owner ?? 'Not assigned'}</td>
            <td className="p-4">{project.installer?.lead_installer ?? 'Not assigned'}</td>
            <td className="p-4">
                <form onSubmit={submit} className="flex min-w-64 items-start gap-2">
                    <div className="grid flex-1 gap-1">
                        <Label className="sr-only" htmlFor={`grid-status-${project.id}`}>
                            Grid status for {project.project_name}
                        </Label>
                        <Input
                            id={`grid-status-${project.id}`}
                            value={data.grid_status}
                            onChange={(event) => setData('grid_status', event.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.grid_status} />
                    </div>
                    <Button type="submit" size="sm" disabled={processing} aria-label={`Save grid status for project ${project.id}`}>
                        {processing ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                        <span>Save</span>
                    </Button>
                </form>
            </td>
        </tr>
    );
}

function pageUrl(page: number, search: string): string {
    const params = new URLSearchParams({ page: String(page) });

    if (search) {
        params.set('search', search);
    }

    return `/grid-status?${params.toString()}`;
}

export default function GridStatus({ projects, statusCounts, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grid Status" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold">Solar Grid Status</h1>
                    <p className="text-muted-foreground text-sm">Monitor and update your solar project grid connections.</p>
                </div>

                <SearchBar
                    key={filters.search}
                    action={route('grid-status.index')}
                    value={filters.search}
                    placeholder="Search projects, owners, installers, status..."
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="bg-card rounded-xl border p-5">
                        <CheckCircle className="mb-3 size-6 text-blue-600" />
                        <p className="text-muted-foreground text-sm">Total Projects</p>
                        <h2 className="text-3xl font-bold">{statusCounts.total}</h2>
                    </div>

                    <div className="bg-card rounded-xl border p-5">
                        <Zap className="mb-3 size-6 text-green-600" />
                        <p className="text-muted-foreground text-sm">Connected</p>
                        <h2 className="text-3xl font-bold">{statusCounts.connected}</h2>
                    </div>

                    <div className="bg-card rounded-xl border p-5">
                        <AlertTriangle className="mb-3 size-6 text-orange-500" />
                        <p className="text-muted-foreground text-sm">Pending Connection</p>
                        <h2 className="text-3xl font-bold">{statusCounts.pending}</h2>
                    </div>

                    <div className="bg-card rounded-xl border p-5">
                        <Unplug className="mb-3 size-6 text-red-600" />
                        <p className="text-muted-foreground text-sm">Disconnected</p>
                        <h2 className="text-3xl font-bold">{statusCounts.disconnected}</h2>
                    </div>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border">
                    <div className="border-b p-5">
                        <h2 className="font-semibold">Grid Connection Monitoring</h2>
                        <p className="text-muted-foreground text-sm">Edit a project’s grid status below and save your change.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="text-left">
                                    <th className="p-4">Project</th>
                                    <th className="p-4">Property Owner</th>
                                    <th className="p-4">Installer</th>
                                    <th className="p-4">Grid Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.data.map((project) => (
                                    <ProjectStatusRow key={project.id} project={project} />
                                ))}
                                {projects.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-muted-foreground p-8 text-center">
                                            No solar projects registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t p-4">
                        <p className="text-muted-foreground text-sm">Total: {projects.total} projects</p>
                        <div className="flex gap-2">
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
