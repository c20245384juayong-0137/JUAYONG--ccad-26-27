import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

interface Project {
    id: number;
    property_owner?: { property_owner?: string };
    inverter?: { inverter_model?: string };
    installer?: { lead_installer?: string };
    grid_status?: { grid_status?: string };
    installation_address: string;
    panel_count: number;
    total_capacity_kw: string;
    install_date: string;
    project_cost: string;
    grid_permit_no: string;
}

interface Props {
    project: Project;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Solar Projects', href: '/projects' },
    { title: 'Project Details', href: '/projects' },
];

export default function ShowProject({ project }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Project #${project.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">Project #{project.id}</h1>
                        <p className="text-sm text-muted-foreground">Solar installation details</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('projects.index')} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                        <Link href={route('projects.edit', project.id)} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                            <Pencil className="size-4" />
                            Edit
                        </Link>
                        <Link href={route('projects.destroy', project.id)} method="delete" as="button" className="inline-flex items-center gap-2 rounded-md border border-destructive px-3 py-2 text-sm font-medium text-destructive">
                            <Trash2 className="size-4" />
                            Delete
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Project overview</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Address</dt><dd>{project.installation_address}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Owner</dt><dd>{project.property_owner?.property_owner ?? 'Not assigned'}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Inverter</dt><dd>{project.inverter?.inverter_model ?? 'Not assigned'}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Installer</dt><dd>{project.installer?.lead_installer ?? 'Not assigned'}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Grid status</dt><dd>{project.grid_status?.grid_status ?? 'Not assigned'}</dd></div>
                        </dl>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Technical details</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Panel count</dt><dd>{project.panel_count}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Capacity</dt><dd>{project.total_capacity_kw} kW</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Install date</dt><dd>{project.install_date}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Project cost</dt><dd>${Number(project.project_cost).toLocaleString()}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Grid permit</dt><dd>{project.grid_permit_no}</dd></div>
                        </dl>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
