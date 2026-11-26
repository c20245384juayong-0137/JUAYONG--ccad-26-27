import InputError from '@/components/input-error';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus, Trash2, Wrench } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Installer {
    id: number;
    lead_installer: string;
}

interface Props {
    installers: {
        data: Installer[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Installers', href: '/installers' }];

function pageUrl(page: number, search: string): string {
    const params = new URLSearchParams({ page: String(page) });

    if (search) {
        params.set('search', search);
    }

    return `/installers?${params.toString()}`;
}

export default function Installers({ installers, filters }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingInstaller, setEditingInstaller] = useState<Installer | null>(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        lead_installer: '',
    });

    const openCreateDialog = () => {
        setEditingInstaller(null);
        reset();
        clearErrors();
        setDialogOpen(true);
    };

    const openEditDialog = (installer: Installer) => {
        setEditingInstaller(installer);
        setData('lead_installer', installer.lead_installer);
        clearErrors();
        setDialogOpen(true);
    };

    const submit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const options = {
            onSuccess: () => {
                setDialogOpen(false);
                setEditingInstaller(null);
                reset();
            },
        };

        if (editingInstaller) {
            put(route('installers.update', editingInstaller.id), options);
        } else {
            post(route('installers.store'), options);
        }
    };

    const deleteInstaller = (installer: Installer) => {
        if (window.confirm(`Delete ${installer.lead_installer}?`)) {
            router.delete(route('installers.destroy', installer.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Installers" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Installers</h1>
                        <p className="text-muted-foreground text-sm">Manage your solar project installers.</p>
                    </div>

                    <Button type="button" onClick={openCreateDialog}>
                        <Plus className="size-4" />
                        Add Installer
                    </Button>
                </div>

                <SearchBar key={filters.search} action={route('installers.index')} value={filters.search} placeholder="Search installers..." />

                <div className="bg-card overflow-hidden rounded-xl border">
                    <div className="border-b p-5">
                        <h2 className="font-semibold">Installer Directory</h2>
                        <p className="text-muted-foreground text-sm">Manage installer names used by your projects.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="text-left">
                                    <th className="p-4">Installer Name</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {installers.data.map((installer) => (
                                    <tr key={installer.id} className="border-t">
                                        <td className="p-4 font-medium">{installer.lead_installer}</td>
                                        <td className="flex flex-wrap gap-2 p-4">
                                            <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(installer)}>
                                                <Pencil className="size-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => deleteInstaller(installer)}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {installers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="text-muted-foreground p-8 text-center">
                                            <Wrench className="mx-auto mb-2 size-5" />
                                            No installers registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t p-4">
                        <p className="text-muted-foreground text-sm">Total: {installers.total} installers</p>
                        <div className="flex gap-2">
                            {installers.current_page > 1 && (
                                <Link href={pageUrl(installers.current_page - 1, filters.search)} className="rounded-md border px-3 py-2 text-sm">
                                    Previous
                                </Link>
                            )}
                            {installers.current_page < installers.last_page && (
                                <Link href={pageUrl(installers.current_page + 1, filters.search)} className="rounded-md border px-3 py-2 text-sm">
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingInstaller ? 'Edit Installer' : 'Add Installer'}</DialogTitle>
                        <DialogDescription>{editingInstaller ? 'Update the installer name.' : 'Enter a name to add an installer.'}</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lead_installer">Installer name</Label>
                            <Input
                                id="lead_installer"
                                value={data.lead_installer}
                                onChange={(event) => setData('lead_installer', event.target.value)}
                                disabled={processing}
                                autoFocus
                            />
                            <InputError message={errors.lead_installer} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="size-4 animate-spin" />}
                                {editingInstaller ? 'Save Changes' : 'Add Installer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
