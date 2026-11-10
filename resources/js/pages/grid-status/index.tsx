
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grid Status',
        href: '/grid-status',
    },
];

export default function GridStatus() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grid Status" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Solar Grid Status
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor solar project grid connections.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                        <Zap className="mb-3 size-6 text-green-600" />
                        <p className="text-sm text-muted-foreground">
                            Connected
                        </p>
                        <h2 className="text-3xl font-bold">18</h2>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <AlertTriangle className="mb-3 size-6 text-orange-500" />
                        <p className="text-sm text-muted-foreground">
                            Pending Connection
                        </p>
                        <h2 className="text-3xl font-bold">4</h2>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <CheckCircle className="mb-3 size-6 text-blue-600" />
                        <p className="text-sm text-muted-foreground">
                            Operational
                        </p>
                        <h2 className="text-3xl font-bold">18</h2>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5">
                    <h2 className="mb-4 font-semibold">
                        Grid Connection Monitoring
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Your solar grid connection records will appear here.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
