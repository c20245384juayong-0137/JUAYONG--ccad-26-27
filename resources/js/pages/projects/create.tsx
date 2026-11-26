import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Plus } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Installer {
    id: number;
    lead_installer: string;
}

interface Props {
    installers: Installer[];
    gridPermitNo: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Solar Projects', href: '/projects' },
    { title: 'Create Project', href: '/projects/create' },
];

export default function CreateProject({ installers, gridPermitNo }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        project_name: '',
        property_owner: '',
        inverter: '',
        installer: '',
        grid_status: '',
        installation_address: '',
        panel_count: '',
        total_capacity_kw: '',
        install_date: '',
        project_cost: '',
        grid_permit_no: gridPermitNo,
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Solar Project" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">Create Solar Project</h1>
                        <p className="text-muted-foreground text-sm">Add a new solar installation record.</p>
                    </div>

                    <Link href={route('projects.index')} className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                        <ArrowLeft className="size-4" />
                        Back to projects
                    </Link>
                </div>

                <form onSubmit={submit} className="bg-card rounded-xl border p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="project_name">Project name</Label>
                            <Input
                                id="project_name"
                                value={data.project_name}
                                onChange={(e) => setData('project_name', e.target.value)}
                                disabled={processing}
                                placeholder="Sunrise Villa Solar"
                            />
                            <InputError message={errors.project_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="property_owner">Property owner</Label>
                            <Input
                                id="property_owner"
                                value={data.property_owner}
                                onChange={(e) => setData('property_owner', e.target.value)}
                                disabled={processing}
                                placeholder="Enter property owner"
                            />
                            <InputError message={errors.property_owner} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grid_status">Grid status</Label>
                            <Input
                                id="grid_status"
                                value={data.grid_status}
                                onChange={(e) => setData('grid_status', e.target.value)}
                                disabled={processing}
                                placeholder="Enter grid status"
                            />
                            <InputError message={errors.grid_status} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="inverter">Inverter</Label>
                            <Input
                                id="inverter"
                                value={data.inverter}
                                onChange={(e) => setData('inverter', e.target.value)}
                                disabled={processing}
                                placeholder="Enter inverter model"
                            />
                            <InputError message={errors.inverter} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="installer">Installer</Label>
                            <Select
                                value={String(installers.find((installer) => installer.lead_installer === data.installer)?.id ?? 'none')}
                                onValueChange={(value) =>
                                    setData(
                                        'installer',
                                        value === 'none'
                                            ? ''
                                            : (installers.find((installer) => String(installer.id) === value)?.lead_installer ?? ''),
                                    )
                                }
                                disabled={processing}
                            >
                                <SelectTrigger id="installer">
                                    <SelectValue placeholder={installers.length ? 'Select an installer' : 'No installers available'} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No installer</SelectItem>
                                    {installers.map((installer) => (
                                        <SelectItem key={installer.id} value={String(installer.id)}>
                                            {installer.lead_installer}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.installer} />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="installation_address">Installation address</Label>
                            <Input
                                id="installation_address"
                                value={data.installation_address}
                                onChange={(e) => setData('installation_address', e.target.value)}
                                disabled={processing}
                                placeholder="123 Solar Lane"
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
                            <Input id="grid_permit_no" value={data.grid_permit_no} readOnly disabled={processing} />
                            <p className="text-muted-foreground text-xs">Generated automatically for this project.</p>
                            <InputError message={errors.grid_permit_no} />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <Link href={route('projects.index')} className="text-muted-foreground text-sm">
                            Cancel
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                            <Plus className="mr-2 size-4" />
                            Save project
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
