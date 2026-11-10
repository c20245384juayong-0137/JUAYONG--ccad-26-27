import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SelectOption {
    id: number;
    property_owner?: string;
    inverter_model?: string;
    lead_installer?: string;
    grid_status?: string;
}

interface Project {
    id: number;
    property_owner_id: number;
    inverter_id: number | null;
    installer_id: number | null;
    grid_status_id: number;
    installation_address: string;
    panel_count: number;
    total_capacity_kw: string;
    install_date: string;
    project_cost: string;
    grid_permit_no: string;
}

interface Props {
    project: Project;
    propertyOwners: SelectOption[];
    inverters: SelectOption[];
    installers: SelectOption[];
    gridStatuses: SelectOption[];
}

const breadcrumbs = (projectId: number): BreadcrumbItem[] => [
    { title: 'Solar Projects', href: '/projects' },
    { title: `Project #${projectId}`, href: `/projects/${projectId}` },
    { title: 'Edit Project', href: `/projects/${projectId}/edit` },
];

export default function EditProject({ project, propertyOwners, inverters, installers, gridStatuses }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        property_owner_id: String(project.property_owner_id ?? ''),
        inverter_id: String(project.inverter_id ?? ''),
        installer_id: String(project.installer_id ?? ''),
        grid_status_id: String(project.grid_status_id ?? ''),
        installation_address: project.installation_address ?? '',
        panel_count: String(project.panel_count ?? ''),
        total_capacity_kw: String(project.total_capacity_kw ?? ''),
        install_date: project.install_date ?? '',
        project_cost: String(project.project_cost ?? ''),
        grid_permit_no: project.grid_permit_no ?? '',
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        put(route('projects.update', project.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(project.id)}>
            <Head title={`Edit Project #${project.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Solar Project</h1>
                        <p className="text-sm text-muted-foreground">Update the project details.</p>
                    </div>

                    <Link href={route('projects.show', project.id)} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowLeft className="size-4" />
                        View project
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-xl border bg-card p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="property_owner_id">Property owner</Label>
                            <select
                                id="property_owner_id"
                                value={data.property_owner_id}
                                onChange={(e) => setData('property_owner_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                disabled={processing}
                            >
                                <option value="">Select owner</option>
                                {propertyOwners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>{owner.property_owner}</option>
                                ))}
                            </select>
                            <InputError message={errors.property_owner_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grid_status_id">Grid status</Label>
                            <select
                                id="grid_status_id"
                                value={data.grid_status_id}
                                onChange={(e) => setData('grid_status_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                disabled={processing}
                            >
                                <option value="">Select grid status</option>
                                {gridStatuses.map((status) => (
                                    <option key={status.id} value={status.id}>{status.grid_status}</option>
                                ))}
                            </select>
                            <InputError message={errors.grid_status_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="inverter_id">Inverter</Label>
                            <select
                                id="inverter_id"
                                value={data.inverter_id}
                                onChange={(e) => setData('inverter_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                disabled={processing}
                            >
                                <option value="">Select inverter</option>
                                {inverters.map((inverter) => (
                                    <option key={inverter.id} value={inverter.id}>{inverter.inverter_model}</option>
                                ))}
                            </select>
                            <InputError message={errors.inverter_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="installer_id">Installer</Label>
                            <select
                                id="installer_id"
                                value={data.installer_id}
                                onChange={(e) => setData('installer_id', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                disabled={processing}
                            >
                                <option value="">Select installer</option>
                                {installers.map((installer) => (
                                    <option key={installer.id} value={installer.id}>{installer.lead_installer}</option>
                                ))}
                            </select>
                            <InputError message={errors.installer_id} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="installation_address">Installation address</Label>
                            <Input
                                id="installation_address"
                                value={data.installation_address}
                                onChange={(e) => setData('installation_address', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.installation_address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="panel_count">Panel count</Label>
                            <Input
                                id="panel_count"
                                type="number"
                                min="1"
                                value={data.panel_count}
                                onChange={(e) => setData('panel_count', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.panel_count} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_capacity_kw">Total capacity (kW)</Label>
                            <Input
                                id="total_capacity_kw"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={data.total_capacity_kw}
                                onChange={(e) => setData('total_capacity_kw', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.total_capacity_kw} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="install_date">Installation date</Label>
                            <Input
                                id="install_date"
                                type="date"
                                value={data.install_date}
                                onChange={(e) => setData('install_date', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.install_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="project_cost">Project cost</Label>
                            <Input
                                id="project_cost"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.project_cost}
                                onChange={(e) => setData('project_cost', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.project_cost} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="grid_permit_no">Grid permit number</Label>
                            <Input
                                id="grid_permit_no"
                                value={data.grid_permit_no}
                                onChange={(e) => setData('grid_permit_no', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.grid_permit_no} />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Link href={route('projects.show', project.id)} className="text-sm text-muted-foreground">
                            Cancel
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                            <Save className="mr-2 size-4" />
                            Update project
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
