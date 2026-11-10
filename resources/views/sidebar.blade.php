<flux:sidebar.item
    icon="folder"
    href="{{ route('projects.index') }}"
    :current="request()->routeIs('projects.*')"
>
    Projects
</flux:sidebar.item>

<flux:sidebar.item
    icon="squares-2x2"
    href="{{ route('grid-status.index') }}"
    :current="request()->routeIs('grid-status.*')"
>
    Grid Status
</flux:sidebar.item>