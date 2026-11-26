import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Props {
    action: string;
    value: string;
    placeholder: string;
}

export default function SearchBar({ action, value, placeholder }: Props) {
    const [search, setSearch] = useState(value);

    const submit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const query = search.trim();

        router.get(action, query ? { search: query } : {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <form onSubmit={submit} role="search" className="w-full sm:max-w-md">
            <div className="relative">
                <Input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    className="pr-12"
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute top-1 right-1 size-8" aria-label="Search">
                    <Search className="size-4" />
                </Button>
            </div>
        </form>
    );
}
